(function () {
    'use strict';

    var EXPORT_MEMO_COLORS = {
        'bg-yellow-200': { bg: '#fef9c3', border: '#fde68a', text: '#92400e', titleBg: '#fde68a' },
        'bg-pink-200': { bg: '#fce7f3', border: '#f9a8d4', text: '#9d174d', titleBg: '#f9a8d4' },
        'bg-blue-200': { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af', titleBg: '#93c5fd' },
        'bg-green-200': { bg: '#dcfce7', border: '#86efac', text: '#166534', titleBg: '#86efac' },
        'bg-purple-200': { bg: '#f3e8ff', border: '#c4b5fd', text: '#6b21a8', titleBg: '#c4b5fd' },
        'bg-orange-200': { bg: '#ffedd5', border: '#fdba74', text: '#9a3412', titleBg: '#fdba74' }
    };

    var EXPORT_DEFAULT_MEMO = EXPORT_MEMO_COLORS['bg-yellow-200'];

    function buildMemoCard(m, compact) {
        var ms = EXPORT_MEMO_COLORS[m.color] || EXPORT_DEFAULT_MEMO;
        var mCard = document.createElement('div');
        mCard.style.cssText = 'background:' + ms.bg + ';border:1px solid ' + ms.border + ';border-radius:8px;overflow:hidden;page-break-inside:avoid;break-inside:avoid;';

        var mHeader = document.createElement('div');
        mHeader.style.cssText = 'background:' + ms.titleBg + ';padding:' + (compact ? '4px 10px' : '6px 12px') + ';';

        var mTitleText = document.createElement('div');
        mTitleText.style.cssText = 'font-size:' + (compact ? '11px' : '12px') + ';font-weight:bold;color:' + ms.text + ';';
        mTitleText.textContent = '📌 ' + (m.title || 'MEMO');
        mHeader.appendChild(mTitleText);
        mCard.appendChild(mHeader);

        var mBody = document.createElement('div');
        mBody.style.cssText = 'padding:' + (compact ? '6px 10px' : '8px 12px') + ';';

        var mText = document.createElement('div');
        mText.style.cssText = 'font-size:' + (compact ? '12px' : '13px') + ';color:' + ms.text + ';white-space:pre-wrap;line-height:1.5;word-break:break-all;overflow-wrap:break-word;';
        mText.textContent = m.text;
        mBody.appendChild(mText);

        if (m.image) {
            var img = document.createElement('img');
            img.src = m.image;
            img.style.cssText = 'max-width:' + (compact ? '140px' : '200px') + ';max-height:' + (compact ? '70px' : '100px') + ';margin-top:6px;border-radius:4px;border:1px solid ' + ms.border + ';';
            mBody.appendChild(img);
        }

        mCard.appendChild(mBody);
        return mCard;
    }

    function buildChecklistContainer(plan, containerWidth, contentPaddingPx) {
        if (contentPaddingPx === void 0) contentPaddingPx = 16;

        var container = document.createElement('div');
        container.style.cssText = 'width:' + containerWidth + 'px;background:#fff;padding:' + Math.round(contentPaddingPx) + 'px;font-family:\'Segoe UI\',Tahoma,sans-serif;box-sizing:border-box;page-break-after:always;break-after:always;';

        var planHeader = document.createElement('div');
        planHeader.style.cssText = 'background:linear-gradient(135deg,#1e293b 0%,#334155 100%);color:#fff;padding:10px 16px;border-radius:8px 8px 0 0;';
        planHeader.innerHTML = '<div style="font-size:15px;font-weight:bold;letter-spacing:0.5px;">✈️ ' + plan.name + '</div>';
        container.appendChild(planHeader);

        var clHeader = document.createElement('div');
        clHeader.style.cssText = 'background:linear-gradient(135deg,#fef3c7 0%,#fde68a 100%);padding:12px 16px;border-radius:0 0 8px 8px;margin-bottom:20px;border:1px solid #fde68a;border-top:none;display:flex;justify-content:space-between;align-items:center;';

        var totalItems = 0;
        var checkedItems = 0;
        (plan.checklists || []).forEach(function (c) {
            c.items.forEach(function (i) {
                if (!i.isNote) {
                    totalItems += 1;
                    if (i.isChecked) checkedItems += 1;
                }
            });
        });
        var progress = totalItems === 0 ? 0 : Math.round((checkedItems / totalItems) * 100);

        clHeader.innerHTML = [
            '<div>',
            '<div style="font-size:22px;font-weight:bold;color:#78350f;">📋 行前準備清單</div>',
            '<div style="font-size:13px;color:#92400e;font-weight:500;margin-top:2px;">出發前再確認一次！</div>',
            '</div>',
            '<div style="text-align:right;">',
            '<div style="font-size:12px;font-weight:bold;color:#92400e;margin-bottom:4px;">準備進度: ' + progress + '%</div>',
            '<div style="width:120px;height:8px;background:#fef3c7;border-radius:4px;overflow:hidden;border:1px solid #fcd34d;">',
            '<div style="height:100%;background:#f59e0b;width:' + progress + '%;"></div>',
            '</div>',
            '</div>'
        ].join('');
        container.appendChild(clHeader);

        if (!plan.checklists || plan.checklists.length === 0) {
            var emptyMsg = document.createElement('div');
            emptyMsg.style.cssText = 'text-align:center;padding:40px;color:#94a3b8;font-size:14px;';
            emptyMsg.textContent = '此方案目前沒有任何清單項目。';
            container.appendChild(emptyMsg);
        } else {
            var grid = document.createElement('div');
            grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;';

            plan.checklists.forEach(function (cat) {
                var catCard = document.createElement('div');
                catCard.style.cssText = 'background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;page-break-inside:avoid;break-inside:avoid;';

                var catTitle = document.createElement('div');
                catTitle.style.cssText = 'font-size:16px;font-weight:bold;color:#1e293b;margin-bottom:12px;border-bottom:2px solid #cbd5e1;padding-bottom:6px;';
                catTitle.textContent = '📂 ' + cat.category;
                catCard.appendChild(catTitle);

                if (cat.items.length === 0) {
                    var emptyItem = document.createElement('div');
                    emptyItem.style.cssText = 'font-size:13px;color:#94a3b8;font-style:italic;';
                    emptyItem.textContent = '無項目';
                    catCard.appendChild(emptyItem);
                } else {
                    cat.items.forEach(function (item) {
                        var itemRow = document.createElement('div');
                        itemRow.style.cssText = 'display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;';

                        if (item.isNote) {
                            itemRow.innerHTML = [
                                '<span style="font-size:14px;margin-top:2px;">📌</span>',
                                '<span style="font-size:14px;color:#0f172a;font-weight:500;line-height:1.4;">' + item.text + '</span>'
                            ].join('');
                        } else {
                            var checkIcon = item.isChecked ? '☑️' : '🔲';
                            var textDecoration = item.isChecked ? 'line-through' : 'none';
                            var textColor = item.isChecked ? '#94a3b8' : '#334155';
                            itemRow.innerHTML = [
                                '<span style="font-size:14px;margin-top:2px;">' + checkIcon + '</span>',
                                '<span style="font-size:14px;color:' + textColor + ';text-decoration:' + textDecoration + ';line-height:1.4;">' + item.text + '</span>'
                            ].join('');
                        }
                        catCard.appendChild(itemRow);
                    });
                }
                grid.appendChild(catCard);
            });

            container.appendChild(grid);
        }

        var footerLine = document.createElement('div');
        footerLine.style.cssText = 'margin-top:24px;border-top:1px solid #e2e8f0;padding-top:8px;';
        footerLine.innerHTML = '<div style="font-size:11px;color:#94a3b8;text-align:center;">✈️ ' + plan.name + '  ·  行前清單</div>';
        container.appendChild(footerLine);

        return container;
    }

    window.PlantPdfUtils = {
        buildMemoCard: buildMemoCard,
        buildChecklistContainer: buildChecklistContainer
    };
})();
