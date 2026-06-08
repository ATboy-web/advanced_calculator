/**
 * 主题管理器
 * 支持 light / dark / system 三种模式
 */
import { eventBus } from '../core/event-bus.js';

export class ThemeManager {
    #currentTheme;
    #mediaQuery;

    constructor() {
        this.#mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.#currentTheme = localStorage.getItem('theme') || 'system';
        this.#apply();
        this.#mediaQuery.addEventListener('change', () => this.#apply());
    }

    /**
     * 设置主题
     * @param {'system'|'light'|'dark'} theme
     */
    setTheme(theme) {
        this.#currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.#apply();
        eventBus.emit('theme:changed', theme);
    }

    /**
     * 循环切换主题: system → light → dark → system
     */
    cycle() {
        const themes = ['system', 'light', 'dark'];
        const index = themes.indexOf(this.#currentTheme);
        this.setTheme(themes[(index + 1) % themes.length]);
    }

    /**
     * 获取当前主题设置
     * @returns {string}
     */
    get current() {
        return this.#currentTheme;
    }

    /**
     * 获取实际生效的模式（resolved）
     * @returns {'light'|'dark'}
     */
    get resolved() {
        if (this.#currentTheme === 'dark') return 'dark';
        if (this.#currentTheme === 'light') return 'light';
        return this.#mediaQuery.matches ? 'dark' : 'light';
    }

    #apply() {
        const isDark = this.#currentTheme === 'dark'
            || (this.#currentTheme === 'system' && this.#mediaQuery.matches);
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
}
