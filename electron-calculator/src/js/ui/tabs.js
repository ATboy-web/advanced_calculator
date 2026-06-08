/**
 * 标签页管理器
 * 使用事件委托替代内联 onclick
 */
import { eventBus } from '../core/event-bus.js';
import { $ } from '../utils/dom.js';

export class TabManager {
    #container;
    #activePanel;

    constructor(containerSelector) {
        this.#container = document.querySelector(containerSelector);
        this.#activePanel = 'basic';
        if (this.#container) {
            this.#init();
        }
    }

    #init() {
        // 事件委托：点击切换
        this.#container.addEventListener('click', (event) => {
            const tab = event.target.closest('[data-panel]');
            if (!tab) return;
            event.preventDefault();
            this.switchTo(tab.dataset.panel);
        });

        // 键盘导航
        this.#container.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                const tab = event.target.closest('[data-panel]');
                if (tab) {
                    event.preventDefault();
                    this.switchTo(tab.dataset.panel);
                }
            }
        });
    }

    /**
     * 切换到指定面板
     * @param {string} panelName
     */
    switchTo(panelName) {
        const panel = $(panelName);
        if (!panel) return;

        // 移除所有激活状态
        this.#container.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

        // 激活目标
        const tab = this.#container.querySelector(`[data-panel="${panelName}"]`);
        if (tab) {
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
        }
        panel.classList.add('active');
        this.#activePanel = panelName;

        // 触发面板切换事件
        eventBus.emit('panel:changed', panelName);
    }

    /**
     * 获取当前活跃面板
     * @returns {string}
     */
    get activePanel() {
        return this.#activePanel;
    }
}
