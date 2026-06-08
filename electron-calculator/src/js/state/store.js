/**
 * Store — 简易响应式状态管理
 * 集中管理计算器状态，状态变更自动通知订阅者
 *
 * 用法:
 *   import { calculatorStore } from './store.js';
 *   calculatorStore.subscribe((state, prev) => { ... });
 *   calculatorStore.setState({ display: '42' });
 */
class Store {
    #state;
    #subscribers = new Set();

    constructor(initialState) {
        this.#state = Object.freeze(structuredClone(initialState));
    }

    /**
     * 获取当前状态（只读副本）
     * @returns {object}
     */
    getState() {
        return this.#state;
    }

    /**
     * 更新状态
     * @param {object|Function} updater - 新状态对象或 (prevState) => newState 函数
     */
    setState(updater) {
        const prevState = this.#state;
        const patch = typeof updater === 'function' ? updater(prevState) : updater;
        const nextState = Object.freeze({ ...prevState, ...patch });
        this.#state = nextState;

        this.#subscribers.forEach(callback => {
            try {
                callback(nextState, prevState);
            } catch (error) {
                console.error('Store: subscriber error:', error);
            }
        });
    }

    /**
     * 订阅状态变更
     * @param {Function} callback - (newState, prevState) => void
     * @returns {Function} 取消订阅函数
     */
    subscribe(callback) {
        this.#subscribers.add(callback);
        return () => this.#subscribers.delete(callback);
    }

    /**
     * 获取订阅者数量
     */
    get subscriberCount() {
        return this.#subscribers.size;
    }
}

// 计算器全局状态
export const calculatorStore = new Store({
    // 显示
    display: '0',
    expression: '',
    pendingOp: '',
    pendingVal: 0,
    newInput: true,

    // 模式
    shifted: false,
    deg: true,
    bracketCount: 0,

    // 历史
    history: [],

    // UI
    currentPanel: 'basic',
    theme: 'system',
});
