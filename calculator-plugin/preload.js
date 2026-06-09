// uTools 预加载脚本 - 高级计算器插件
// 监听插件进入事件
utools.onPluginEnter(({ code, type, payload }) => {
    console.log('插件进入:', code, type, payload);
    // 根据功能代码跳转到对应面板
    const panelMap = {
        'calculator': 'basic',
        'equation': 'equation',
        'matrix': 'matrix',
        'geometry': 'geometry',
        'calculus': 'calculus',
        'statistics': 'statistics',
        'converter': 'converter',
        'tutorial': 'tutorial'
    };
    const panel = panelMap[code] || 'basic';
    // 等待页面加载完成后切换面板
    setTimeout(() => {
        if (typeof switchPanel === 'function') switchPanel(panel);
    }, 100);
});

// 监听插件退出事件
utools.onPluginOut(() => {
    console.log('插件退出');
});

// 复制文本到剪贴板
function copyToClipboard(text) {
    utools.copyText(text);
    utools.showNotification('已复制到剪贴板');
}

// 从剪贴板粘贴
function pasteFromClipboard() {
    const text = utools.getCopyedFiles();
    if (text && text.length > 0) return text[0].name;
    return '';
}

// 保存数据到本地
function saveData(key, data) {
    utools.db.put({ _id: key, data: data });
}

// 从本地读取数据
function loadData(key) {
    const result = utools.db.get(key);
    return result ? result.data : null;
}
