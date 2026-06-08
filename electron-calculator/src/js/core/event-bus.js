/**
 * EventBus — 发布/订阅事件总线
 * 模块间解耦通信的核心基础设施
 *
 * 用法:
 *   import { eventBus } from './event-bus.js';
 *   eventBus.on('panel:changed', (name) => { ... });
 *   eventBus.emit('panel:changed', 'scientific');
 */
export class EventBus {
    #listeners = new Map();

    /**
     * 订阅事件
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     * @returns {Function} 取消订阅函数
     */
    on(event, callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Event callback must be a function');
        }
        if (!this.#listeners.has(event)) {
            this.#listeners.set(event, new Set());
        }
        this.#listeners.get(event).add(callback);
        return () => this.off(event, callback);
    }

    /**
     * 一次性订阅
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     * @returns {Function} 取消订阅函数
     */
    once(event, callback) {
        const wrapper = (...args) => {
            this.off(event, wrapper);
            callback(...args);
        };
        return this.on(event, wrapper);
    }

    /**
     * 取消订阅
     * @param {string} event - 事件名称
     * @param {Function} callback - 要移除的回调函数
     */
    off(event, callback) {
        const listeners = this.#listeners.get(event);
        if (listeners) {
            listeners.delete(callback);
            if (listeners.size === 0) {
                this.#listeners.delete(event);
            }
        }
    }

    /**
     * 触发事件
     * @param {string} event - 事件名称
     * @param  {...any} args - 传递给回调的参数
     */
    emit(event, ...args) {
        const listeners = this.#listeners.get(event);
        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback(...args);
                } catch (error) {
                    console.error(`EventBus: handler error for "${event}":`, error);
                }
            });
        }
    }

    /**
     * 移除所有监听器
     * @param {string} [event] - 可选，指定事件名；不传则清除全部
     */
    clear(event) {
        if (event) {
            this.#listeners.delete(event);
        } else {
            this.#listeners.clear();
        }
    }

    /**
     * 获取某事件的监听器数量
     * @param {string} event
     * @returns {number}
     */
    listenerCount(event) {
        return this.#listeners.get(event)?.size ?? 0;
    }
}

// 全局单例
export const eventBus = new EventBus();
