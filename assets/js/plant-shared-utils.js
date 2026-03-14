(function () {
    'use strict';

    function parseTimeToMinutes(timeText) {
        if (!timeText || typeof timeText !== 'string' || !timeText.includes(':')) return null;
        var parts = timeText.split(':').map(Number);
        var h = parts[0];
        var m = parts[1];
        if (Number.isNaN(h) || Number.isNaN(m)) return null;
        return h * 60 + m;
    }

    function parseDurationToMinutes(durationText) {
        if (durationText === null || durationText === undefined) return 0;
        var text = String(durationText).trim();
        if (!text) return 0;

        var hourMatch = text.match(/(\d+(?:\.\d+)?)\s*(h|hr|hrs|hour|hours|小時)/i);
        var minuteMatch = text.match(/(\d+(?:\.\d+)?)\s*(m|min|mins|minute|minutes|分|分鐘)/i);
        if (hourMatch || minuteMatch) {
            var h = hourMatch ? Number(hourMatch[1] || 0) : 0;
            var m = minuteMatch ? Number(minuteMatch[1] || 0) : 0;
            return Math.round(h * 60 + m);
        }

        var firstNumber = Number((text.match(/\d+(?:\.\d+)?/) || [0])[0]);
        return Number.isFinite(firstNumber) ? Math.round(firstNumber) : 0;
    }

    function detectDayConflicts(day) {
        var nodes = Array.isArray(day && day.nodes) ? day.nodes : [];
        var conflicts = [];

        for (var i = 1; i < nodes.length; i += 1) {
            var prev = nodes[i - 1];
            var curr = nodes[i];
            var prevMin = parseTimeToMinutes(prev && prev.time);
            var currMin = parseTimeToMinutes(curr && curr.time);
            if (prevMin !== null && currMin !== null && currMin < prevMin) {
                conflicts.push({
                    type: 'sequence',
                    message: '排序與時間不一致：' + (prev.title || '未命名') + ' (' + (prev.time || '') + ') 在 ' + (curr.title || '未命名') + ' (' + (curr.time || '') + ') 之前。'
                });
            }
        }

        var timedNodes = nodes
            .map(function (node) {
                return {
                    node: node,
                    start: parseTimeToMinutes(node && node.time),
                    duration: parseDurationToMinutes(node && node.duration)
                };
            })
            .filter(function (item) { return item.start !== null; })
            .sort(function (a, b) { return a.start - b.start; });

        for (var j = 0; j < timedNodes.length - 1; j += 1) {
            var current = timedNodes[j];
            var next = timedNodes[j + 1];
            var currentEnd = current.start + Math.max(0, current.duration || 0);
            if (current.duration > 0 && next.start < currentEnd) {
                conflicts.push({
                    type: 'overlap',
                    message: '時間重疊：' + (current.node.title || '未命名') + ' (' + (current.node.time || '') + ') 與 ' + (next.node.title || '未命名') + ' (' + (next.node.time || '') + ')。'
                });
            }
        }

        return conflicts;
    }

    var DEFAULT_EXCHANGE_RATES_TO_TWD = {
        TWD: 1,
        JPY: 0.22,
        USD: 32,
        EUR: 35,
        KRW: 0.024
    };

    function convertCurrencyAmount(amount, fromCurrency, toCurrency, ratesToTwd) {
        var safeAmount = Number(amount || 0);
        var from = fromCurrency || 'TWD';
        var to = toCurrency || 'TWD';
        if (from === to) return safeAmount;

        var fromRate = Number((ratesToTwd && ratesToTwd[from]) || 0);
        var toRate = Number((ratesToTwd && ratesToTwd[to]) || 0);
        if (!fromRate || !toRate) return safeAmount;

        var inTwd = safeAmount * fromRate;
        return inTwd / toRate;
    }

    function calculateSettlementTransfers(summaryRows) {
        var creditors = summaryRows
            .filter(function (row) { return row.diff > 0.01; })
            .map(function (row) { return { id: row.id, amount: row.diff }; })
            .sort(function (a, b) { return b.amount - a.amount; });

        var debtors = summaryRows
            .filter(function (row) { return row.diff < -0.01; })
            .map(function (row) { return { id: row.id, amount: Math.abs(row.diff) }; })
            .sort(function (a, b) { return b.amount - a.amount; });

        var transfers = [];
        var i = 0;
        var j = 0;

        while (i < debtors.length && j < creditors.length) {
            var debtor = debtors[i];
            var creditor = creditors[j];
            var payAmount = Math.min(debtor.amount, creditor.amount);

            transfers.push({
                fromId: debtor.id,
                toId: creditor.id,
                amount: payAmount
            });

            debtor.amount -= payAmount;
            creditor.amount -= payAmount;

            if (debtor.amount <= 0.01) i += 1;
            if (creditor.amount <= 0.01) j += 1;
        }

        return transfers;
    }

    window.PlantSharedUtils = {
        parseTimeToMinutes: parseTimeToMinutes,
        parseDurationToMinutes: parseDurationToMinutes,
        detectDayConflicts: detectDayConflicts,
        DEFAULT_EXCHANGE_RATES_TO_TWD: DEFAULT_EXCHANGE_RATES_TO_TWD,
        convertCurrencyAmount: convertCurrencyAmount,
        calculateSettlementTransfers: calculateSettlementTransfers
    };
})();
