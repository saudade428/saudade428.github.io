(function () {
    'use strict';

    function resolveExportSections(settings, exportTemplates) {
        var safeSettings = settings || {};
        var templates = exportTemplates || { full: { defaults: { includeChecklist: true, includeSplitSummary: true, includeConflictSummary: true } } };
        var tplKey = safeSettings.template || 'full';
        var templateDefaults = (templates[tplKey] && templates[tplKey].defaults) || templates.full.defaults;
        return {
            includeChecklist: safeSettings.includeChecklist ?? templateDefaults.includeChecklist,
            includeSplitSummary: safeSettings.includeSplitSummary ?? templateDefaults.includeSplitSummary,
            includeConflictSummary: safeSettings.includeConflictSummary ?? templateDefaults.includeConflictSummary
        };
    }

    function buildConflictSummaryContainer(plan, containerWidth, contentPaddingPx, detectDayConflicts) {
        if (contentPaddingPx === void 0) contentPaddingPx = 16;
        var byDay = (plan.days || [])
            .map(function (day) { return ({ day: day, conflicts: detectDayConflicts(day) }); })
            .filter(function (x) { return x.conflicts.length > 0; });
        if (byDay.length === 0) return null;

        var container = document.createElement('div');
        container.style.cssText = 'width:' + containerWidth + 'px;background:#fff;padding:' + Math.round(contentPaddingPx) + 'px;font-family:\'Segoe UI\',Tahoma,sans-serif;box-sizing:border-box;page-break-after:always;break-after:always;';
        container.innerHTML = '\n                    <div style="background:linear-gradient(135deg,#7f1d1d 0%,#b91c1c 100%);color:#fff;padding:14px 16px;border-radius:10px;">\n                        <div style="font-size:20px;font-weight:800;">⚠️ 行程衝突摘要</div>\n                        <div style="font-size:12px;opacity:.9;margin-top:2px;">時間重疊、時序異常檢查結果</div>\n                    </div>\n                ';

        byDay.forEach(function (item) {
            var block = document.createElement('div');
            block.style.cssText = 'margin-top:12px;border:1px solid #fecaca;background:#fff1f2;border-radius:8px;padding:10px;';
            var title = document.createElement('div');
            title.style.cssText = 'font-size:13px;font-weight:700;color:#991b1b;margin-bottom:6px;';
            title.textContent = item.day.title + (item.day.subtitle ? ' - ' + item.day.subtitle : '');
            block.appendChild(title);
            item.conflicts.forEach(function (c) {
                var line = document.createElement('div');
                line.style.cssText = 'font-size:12px;color:#7f1d1d;margin-bottom:4px;';
                line.textContent = '• ' + c.message;
                block.appendChild(line);
            });
            container.appendChild(block);
        });

        return container;
    }

    function buildExportPages(plan, settings, containerWidth, mode, deps) {
        var sections = resolveExportSections(settings, deps.EXPORT_TEMPLATES);
        var pages = [];
        var measureRoot = null;
        var metrics = deps.getPaperMetrics(settings || {});
        var contentPaddingPx = metrics.contentPaddingPx;
        var printableHeightPx = metrics.printableHeightPx;
        var printableWmm = metrics.printableWmm;
        var printableHmm = metrics.printableHmm;
        var dynamicPrintSplit = mode === 'print' && printableWmm > 0 && printableHmm > 0;

        pages.push(deps.buildDashboardCover(plan, containerWidth, contentPaddingPx, printableHeightPx).outerHTML);

        if (sections.includeSplitSummary) {
            var splitSummary = deps.buildSplitSummaryContainer(plan, containerWidth, deps.splitBaseCurrency, deps.exchangeRatesToTwd, contentPaddingPx);
            if (splitSummary) pages.push(splitSummary.outerHTML);
        }

        if (sections.includeChecklist && plan.checklists && plan.checklists.length > 0) {
            var clContainer = deps.buildChecklistContainer(plan, containerWidth, contentPaddingPx);
            pages.push(clContainer.outerHTML);
        }

        if (sections.includeConflictSummary) {
            var conflictSummary = buildConflictSummaryContainer(plan, containerWidth, contentPaddingPx, deps.detectDayConflicts);
            if (conflictSummary) pages.push(conflictSummary.outerHTML);
        }

        function ensureMeasureRoot() {
            if (measureRoot) return measureRoot;
            var root = document.createElement('div');
            root.style.cssText = 'position:fixed;left:-99999px;top:0;width:' + containerWidth + 'px;visibility:hidden;pointer-events:none;z-index:-1;';
            document.body.appendChild(root);
            measureRoot = root;
            return root;
        }

        function measureFits(planObj, dayObj, dayIndex, start, end) {
            var root = ensureMeasureRoot();
            var sample = deps.buildDayContainer(planObj, dayObj, dayIndex, containerWidth, {
                nodeStart: start,
                nodeEnd: end,
                segmentIndex: 0,
                segmentTotal: 1
            }, contentPaddingPx);
            root.appendChild(sample);
            var h = sample.scrollHeight;
            root.removeChild(sample);
            return h <= printableHeightPx;
        }

        function splitDayByHeight(planObj, dayObj, dayIndex) {
            var total = dayObj.nodes.length;
            if (total === 0) return [{ start: 0, end: 0 }];
            var ranges = [];
            var start = 0;

            while (start < total) {
                var low = start + 1;
                var high = total;
                var best = start + 1;

                while (low <= high) {
                    var mid = Math.floor((low + high) / 2);
                    if (measureFits(planObj, dayObj, dayIndex, start, mid)) {
                        best = mid;
                        low = mid + 1;
                    } else {
                        high = mid - 1;
                    }
                }

                ranges.push({ start: start, end: best });
                start = best;
            }

            return ranges;
        }

        try {
            for (var i = 0; i < plan.days.length; i += 1) {
                var day = plan.days[i];

                if (!dynamicPrintSplit) {
                    var dayContainerSingle = deps.buildDayContainer(plan, day, i, containerWidth, {
                        nodeStart: 0,
                        nodeEnd: day.nodes.length,
                        segmentIndex: 0,
                        segmentTotal: 1
                    }, contentPaddingPx);
                    pages.push(dayContainerSingle.outerHTML);
                    continue;
                }

                var ranges = splitDayByHeight(plan, day, i);
                var segTotal = ranges.length;
                ranges.forEach(function (r, segIdx) {
                    var dayContainer = deps.buildDayContainer(plan, day, i, containerWidth, {
                        nodeStart: r.start,
                        nodeEnd: r.end,
                        segmentIndex: segIdx,
                        segmentTotal: segTotal
                    }, contentPaddingPx);
                    pages.push(dayContainer.outerHTML);
                });
            }
        } finally {
            if (measureRoot && measureRoot.parentNode) {
                measureRoot.parentNode.removeChild(measureRoot);
            }
        }

        if (mode === 'preview') {
            return pages.map(function (html) {
                return html.replace('margin:0 auto;', 'margin:0 auto 40px auto;box-shadow:0 2px 12px rgba(0,0,0,0.1);border-radius:8px;');
            });
        }
        return pages;
    }

    window.PlantExportUtils = {
        resolveExportSections: resolveExportSections,
        buildConflictSummaryContainer: buildConflictSummaryContainer,
        buildExportPages: buildExportPages
    };
})();
