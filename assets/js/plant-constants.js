(function initPlantConstants(global) {
    var WEATHER_CONDITIONS = [
        { value: 'sunny', icon: '☀️', label: '晴天' },
        { value: 'partly_cloudy', icon: '⛅', label: '多雲' },
        { value: 'cloudy', icon: '☁️', label: '陰天' },
        { value: 'rainy', icon: '🌧️', label: '雨天' },
        { value: 'stormy', icon: '⛈️', label: '雷雨' },
        { value: 'snowy', icon: '❄️', label: '下雪' },
        { value: 'windy', icon: '🌬️', label: '強風' },
        { value: 'hot', icon: '🌡️', label: '酷熱' }
    ];

    var COMPANION_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

    var MEMO_COLORS = [
        { name: 'bg-yellow-200', hex: '#fef08a' },
        { name: 'bg-pink-200', hex: '#fbcfe8' },
        { name: 'bg-blue-200', hex: '#bfdbfe' },
        { name: 'bg-green-200', hex: '#bbf7d0' },
        { name: 'bg-purple-200', hex: '#e9d5ff' },
        { name: 'bg-orange-200', hex: '#fed7aa' }
    ];

    var NODE_STYLES = {
        hotel: { border: '#8b5cf6', bg: '#f5f3ff', icon: '🏨', label: '住宿' },
        restaurant: { border: '#f59e0b', bg: '#fffbeb', icon: '🍽️', label: '餐廳' },
        meal: { border: '#f59e0b', bg: '#fffbeb', icon: '🍽️', label: '餐食' },
        location: { border: '#3b82f6', bg: '#eff6ff', icon: '📍', label: '地點' },
        activity: { border: '#10b981', bg: '#ecfdf5', icon: '🎯', label: '活動' },
        transit: { border: '#6366f1', bg: '#eef2ff', icon: '🚃', label: '交通' },
        flight: { border: '#0ea5e9', bg: '#f0f9ff', icon: '✈️', label: '飛行' },
        shopping: { border: '#ec4899', bg: '#fdf2f8', icon: '🛍️', label: '購物' }
    };

    var DEFAULT_NODE_STYLE = { border: '#64748b', bg: '#f8fafc', icon: '📌', label: '其他' };

    global.PlantConstants = {
        WEATHER_CONDITIONS: WEATHER_CONDITIONS,
        COMPANION_COLORS: COMPANION_COLORS,
        MEMO_COLORS: MEMO_COLORS,
        NODE_STYLES: NODE_STYLES,
        DEFAULT_NODE_STYLE: DEFAULT_NODE_STYLE
    };
})(window);
