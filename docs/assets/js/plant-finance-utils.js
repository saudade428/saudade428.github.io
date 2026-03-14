(function () {
    'use strict';

    function collectActualExpenseEntries(plan, normalizeExpenseItems) {
        return (plan.days || []).flatMap(function (day) {
            return (day.nodes || []).flatMap(function (node) {
                return normalizeExpenseItems(node)
                    .filter(function (it) { return Number(it.amount || 0) > 0 && it.expenseStatus !== 'estimated'; })
                    .map(function (it) {
                        return {
                            dayTitle: day.title,
                            nodeTitle: node.title || '未命名',
                            ...it
                        };
                    });
            });
        });
    }

    function buildCompanionSummary(companions, entries, baseCurrency, rates, deps) {
        var convertCurrencyAmount = deps.convertCurrencyAmount;
        var getEffectiveSplitAmong = deps.getEffectiveSplitAmong;

        return companions.map(function (comp) {
            var paid = entries
                .filter(function (it) { return it.paidBy === comp.id; })
                .reduce(function (sum, it) {
                    return sum + convertCurrencyAmount(Number(it.amount || 0), it.currency || 'TWD', baseCurrency, rates);
                }, 0);

            var shouldPay = entries.reduce(function (sum, it) {
                var splitList = getEffectiveSplitAmong(it, companions);
                if (!splitList.includes(comp.id) || splitList.length === 0) return sum;
                var converted = convertCurrencyAmount(Number(it.amount || 0), it.currency || 'TWD', baseCurrency, rates);
                return sum + converted / splitList.length;
            }, 0);

            return {
                ...comp,
                paid: paid,
                shouldPay: shouldPay,
                diff: paid - shouldPay
            };
        });
    }

    function mapTransfersToDisplayLines(transfers, companions, baseCurrency) {
        return transfers.map(function (item) {
            var from = (companions.find(function (c) { return c.id === item.fromId; }) || {}).name || '未命名';
            var to = (companions.find(function (c) { return c.id === item.toId; }) || {}).name || '未命名';
            return {
                from: from,
                to: to,
                text: from + ' -> ' + to + ': ' + baseCurrency + ' ' + Number(item.amount || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })
            };
        });
    }

    function summarizePaymentSourcesUsage(paymentSources, entries, baseCurrency, rates, deps) {
        var harmonizeExpensePaymentFields = deps.harmonizeExpensePaymentFields;
        var convertCurrencyAmount = deps.convertCurrencyAmount;

        return paymentSources.map(function (source) {
            var relatedEntries = entries.filter(function (it) {
                var enriched = harmonizeExpensePaymentFields(it, paymentSources);
                return enriched.paymentSourceId === source.id;
            });

            var amountInBase = relatedEntries.reduce(function (sum, it) {
                return sum + convertCurrencyAmount(Number(it.amount || 0), it.currency || 'TWD', baseCurrency, rates);
            }, 0);

            var origByCurrency = relatedEntries.reduce(function (acc, it) {
                var cur = it.currency || 'TWD';
                acc[cur] = (acc[cur] || 0) + Number(it.amount || 0);
                return acc;
            }, {});

            var origText = Object.entries(origByCurrency).length === 0
                ? '尚未使用'
                : Object.entries(origByCurrency)
                    .map(function (_ref) {
                        var cur = _ref[0];
                        var amt = _ref[1];
                        return cur + ' ' + Number(amt).toLocaleString(undefined, { maximumFractionDigits: 0 });
                    })
                    .join(' / ');

            var remaining = source.currency
                ? Math.max(0, Number(source.initialAmount || 0) - Number(origByCurrency[source.currency] || 0))
                : null;

            return {
                source: source,
                amountInBase: amountInBase,
                origByCurrency: origByCurrency,
                origText: origText,
                remaining: remaining
            };
        });
    }

    window.PlantFinanceUtils = {
        collectActualExpenseEntries: collectActualExpenseEntries,
        buildCompanionSummary: buildCompanionSummary,
        mapTransfersToDisplayLines: mapTransfersToDisplayLines,
        summarizePaymentSourcesUsage: summarizePaymentSourcesUsage
    };
})();
