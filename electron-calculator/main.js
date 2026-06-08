const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 420,
        height: 700,
        minWidth: 380,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true,       // 允许 app.js 中的 DOM 操作
            contextIsolation: false      // 兼容 Three.js 和现有代码
        },
        icon: path.join(__dirname, 'icon.png'),
        title: '高级计算器',
        backgroundColor: '#0f0f1a',
        show: false
    });

    mainWindow.loadFile('index.html');

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // 创建菜单
    const menuTemplate = [
        {
            label: '文件',
            submenu: [
                { label: '退出', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
            ]
        },
        {
            label: '视图',
            submenu: [
                { label: '重新加载', accelerator: 'CmdOrCtrl+R', click: () => mainWindow?.reload() },
                { label: '开发者工具', accelerator: 'F12', click: () => mainWindow?.toggleDevTools() },
                { type: 'separator' },
                { label: '全屏', accelerator: 'F11', click: () => mainWindow?.setFullScreen(!mainWindow?.isFullScreen()) }
            ]
        },
        {
            label: '帮助',
            submenu: [
                { label: '关于', click: () => showAbout() }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
}

function showAbout() {
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: '关于高级计算器',
        message: '高级计算器 v2.0.0',
        detail: '跨平台高级计算器应用\n支持基础计算、科学计算、函数绘图、方程求解、单位转换等功能\n\n© 2026 CodeBuddy'
    });
}

// IPC handlers
ipcMain.handle('dialog:about', () => {
    showAbout();
});

// 窗口控制 IPC
ipcMain.on('window:minimize', () => mainWindow?.minimize());
ipcMain.on('window:maximize', () => {
    if (mainWindow?.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow?.maximize();
    }
});
ipcMain.on('window:close', () => mainWindow?.close());

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
