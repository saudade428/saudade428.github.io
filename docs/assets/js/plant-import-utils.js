(function () {
    'use strict';

    function normalizeImportedTripData(importedData, deps) {
        var normalizeStoredData = deps.normalizeStoredData;
        var getPlanCompanionRules = deps.getPlanCompanionRules;
        var getPlanPaymentSources = deps.getPlanPaymentSources;
        var syncLegacyExpenseFields = deps.syncLegacyExpenseFields;
        var normalizeExpenseItems = deps.normalizeExpenseItems;

        if (!importedData || !Array.isArray(importedData.plans)) return null;
        return normalizeStoredData({
            ...importedData,
            plans: importedData.plans.map(function (plan) {
                return {
                    ...plan,
                    companions: plan.companions || [],
                    companionRules: getPlanCompanionRules(plan),
                    paymentSources: getPlanPaymentSources(plan),
                    days: (plan.days || []).map(function (day, dayIndex) {
                        return {
                            ...day,
                            id: day.id || 'import-day-' + (dayIndex + 1),
                            title: day.title || 'Day ' + (dayIndex + 1),
                            subtitle: day.subtitle || '',
                            journal: day.journal || '',
                            weather: day.weather || { condition: '', tempHigh: '', tempLow: '' },
                            memos: (day.memos || []).map(function (memo, memoIndex) {
                                return {
                                    id: memo.id || 'import-memo-' + (dayIndex + 1) + '-' + (memoIndex + 1),
                                    x: 50,
                                    y: 150,
                                    width: 224,
                                    height: null,
                                    title: 'MEMO',
                                    text: '',
                                    color: 'bg-yellow-200',
                                    image: null,
                                    linkedNodeId: null,
                                    ...memo
                                };
                            }),
                            nodes: (day.nodes || []).map(function (node, nodeIndex) {
                                var baseNode = {
                                    ...node,
                                    id: node.id || 'import-node-' + (dayIndex + 1) + '-' + (nodeIndex + 1),
                                    time: node.time || '',
                                    tags: node.tags || '',
                                    lat: node.lat || '',
                                    lng: node.lng || '',
                                    paidBy: node.paidBy || '',
                                    splitAmong: Array.isArray(node.splitAmong) ? node.splitAmong : [],
                                    children: Array.isArray(node.children) ? node.children : [],
                                    subtasks: Array.isArray(node.subtasks) ? node.subtasks : []
                                };
                                return syncLegacyExpenseFields(baseNode, normalizeExpenseItems(baseNode));
                            })
                        };
                    }),
                    checklists: Array.isArray(plan.checklists) ? plan.checklists : []
                };
            })
        });
    }

    function simplifyPlanForComparison(plan, deps) {
        var getPlanCompanionRules = deps.getPlanCompanionRules;
        var getPlanPaymentSources = deps.getPlanPaymentSources;
        var normalizeExpenseItems = deps.normalizeExpenseItems;

        if (!plan) return null;
        return {
            name: String(plan.name || ''),
            companions: (plan.companions || []).map(function (companion) {
                return {
                    name: String(companion.name || ''),
                    color: String(companion.color || '')
                };
            }),
            companionRules: getPlanCompanionRules(plan),
            paymentSources: getPlanPaymentSources(plan).map(function (source) {
                return {
                    name: String(source.name || ''),
                    method: String(source.method || ''),
                    currency: String(source.currency || ''),
                    initialAmount: Math.max(0, Number(source.initialAmount || 0)),
                    note: String(source.note || '')
                };
            }),
            days: (plan.days || []).map(function (day) {
                return {
                    title: String(day.title || ''),
                    subtitle: String(day.subtitle || ''),
                    journal: String(day.journal || ''),
                    weather: {
                        condition: String((day.weather && day.weather.condition) || ''),
                        tempHigh: String((day.weather && day.weather.tempHigh) || ''),
                        tempLow: String((day.weather && day.weather.tempLow) || '')
                    },
                    nodes: (day.nodes || []).map(function (node) {
                        return {
                            title: String(node.title || ''),
                            type: String(node.type || ''),
                            time: String(node.time || ''),
                            tags: String(node.tags || ''),
                            lat: String(node.lat || ''),
                            lng: String(node.lng || ''),
                            paidBy: String(node.paidBy || ''),
                            splitAmong: Array.isArray(node.splitAmong) ? node.splitAmong.slice().sort() : [],
                            subtasks: (node.subtasks || []).map(function (subtask) {
                                return {
                                    text: String(subtask.text || ''),
                                    type: String(subtask.type || '')
                                };
                            }),
                            children: (node.children || []).map(function (child) {
                                return {
                                    title: String(child.title || ''),
                                    estimatedCostEnabled: child.estimatedCostEnabled === true,
                                    estimatedCostType: String(child.estimatedCostType || 'single'),
                                    estimatedCost: Number(child.estimatedCost || 0),
                                    estimatedCostMin: Number(child.estimatedCostMin || 0),
                                    estimatedCostMax: Number(child.estimatedCostMax || 0),
                                    estimatedCostCurrency: String(child.estimatedCostCurrency || 'TWD'),
                                    subtasks: (child.subtasks || []).map(function (subtask) {
                                        return { text: String(subtask.text || '') };
                                    })
                                };
                            }),
                            expenseItems: normalizeExpenseItems(node).map(function (item) {
                                return {
                                    currency: String(item.currency || 'TWD'),
                                    amount: Number(item.amount || 0),
                                    category: String(item.category || 'other'),
                                    subCategory: String(item.subCategory || ''),
                                    note: String(item.note || ''),
                                    paidBy: String(item.paidBy || ''),
                                    splitAmong: Array.isArray(item.splitAmong) ? item.splitAmong.slice().sort() : [],
                                    expenseStatus: String(item.expenseStatus || 'actual'),
                                    paymentMethod: String(item.paymentMethod || 'cash'),
                                    paymentSourceId: String(item.paymentSourceId || ''),
                                    paymentStatus: String(item.paymentStatus || 'cash')
                                };
                            })
                        };
                    }),
                    memos: (day.memos || []).map(function (memo) {
                        return {
                            title: String(memo.title || ''),
                            text: String(memo.text || ''),
                            color: String(memo.color || 'bg-yellow-200')
                        };
                    })
                };
            }),
            checklists: (plan.checklists || []).map(function (checklist) {
                return {
                    category: String(checklist.category || ''),
                    items: (checklist.items || []).map(function (item) {
                        return {
                            text: String(item.text || ''),
                            isChecked: item.isChecked === true,
                            isNote: item.isNote === true
                        };
                    })
                };
            })
        };
    }

    function buildImportMergeSelection(sourcePlan, activePlan, deps) {
        var getPlanPaymentSources = deps.getPlanPaymentSources;
        return {
            sourcePlanId: (sourcePlan && sourcePlan.id) || '',
            mergedPlanName: ((activePlan && activePlan.name) || (sourcePlan && sourcePlan.name) || '行程') + '（匯入合併）',
            includeCompanionRules: true,
            companions: ((sourcePlan && sourcePlan.companions) || []).map(function (companion) {
                return { id: companion.id, selected: true };
            }),
            paymentSources: getPlanPaymentSources(sourcePlan).map(function (source) {
                return { id: source.id, selected: true };
            }),
            checklists: ((sourcePlan && sourcePlan.checklists) || []).map(function (checklist) {
                return { id: checklist.id, selected: true };
            }),
            days: ((sourcePlan && sourcePlan.days) || []).map(function (day) {
                return {
                    id: day.id,
                    selected: true,
                    includeMeta: true,
                    targetDayId: '__new__',
                    nodes: (day.nodes || []).map(function (node) { return { id: node.id, selected: true }; }),
                    memos: (day.memos || []).map(function (memo) { return { id: memo.id, selected: true }; })
                };
            })
        };
    }

    window.PlantImportUtils = {
        normalizeImportedTripData: normalizeImportedTripData,
        simplifyPlanForComparison: simplifyPlanForComparison,
        buildImportMergeSelection: buildImportMergeSelection
    };
})();
