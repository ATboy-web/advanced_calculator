/**
 * 键盘快捷键支持
 */
import { eventBus } from '../core/event-bus.js';

export class KeyboardManager {
    #enabled = true;

    constructor() {
        document.addEventListener('keydown', (e) => this.#handleKeydown(e));
    }

    #handleKeydown(e) {
        if (!this.#enabled) return;

        // 忽略在输入框中的按键
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        const k = e.key;

        // 数字键
        if ('0123456789'.includes(k)) {
            eventBus.emit('digit:input', k);
            return;
        }

        // 运算符
        if (['+', '-', '*', '/'].includes(k)) {
            eventBus.emit('operator:input', k);
            return;
        }

        // 特殊键
        switch (k) {
            case '.':
                eventBus.emit('dot:input');
                break;
            case 'Enter':
            case '=':
                e.preventDefault();
                eventBus.emit('equals:press');
                break;
            case 'Backspace':
                eventBus.emit('backspace:press');
                break;
            case 'Escape':
            case 'c':
            case 'C':
                eventBus.emit('clear:press');
                break;
            case '%':
                eventBus.emit('percent:press');
                break;
            case '(':
                eventBus.emit('paren:input', '(');
                break;
            case ')':
                eventBus.emit('paren:input', ')');
                break;
        }
    }

    enable() { this.#enabled = true; }
    disable() { this.#enabled = false; }
    get isEnabled() { return this.#enabled; }
}
