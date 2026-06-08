// Preload script — 安全桥接层
// 在 contextIsolation: true 环境下，通过 contextBridge 暴露安全的 API
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // 窗口控制
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close'),

    // 平台信息
    platform: process.platform,
    version: process.versions.electron,

    // 安全的对话框调用
    showAbout: () => ipcRenderer.invoke('dialog:about'),

    // 文件操作（预留）
    readFile: (filePath) => ipcRenderer.invoke('file:read', filePath),
    writeFile: (filePath, content) => ipcRenderer.invoke('file:write', filePath, content),
});
