import { describe, it, expect, vi } from 'vitest';
import { Store } from '../../src/js/state/store.js';

describe('Store — 状态管理', () => {
    it('getState 返回初始状态', () => {
        const store = new Store({ count: 0 });
        expect(store.getState()).toEqual({ count: 0 });
    });

    it('setState 合并更新', () => {
        const store = new Store({ count: 0, name: 'test' });
        store.setState({ count: 5 });
        expect(store.getState().count).toBe(5);
        expect(store.getState().name).toBe('test');
    });

    it('setState 支持函数式更新', () => {
        const store = new Store({ count: 0 });
        store.setState(prev => ({ count: prev.count + 1 }));
        expect(store.getState().count).toBe(1);
    });

    it('subscribe 接收状态变更通知', () => {
        const store = new Store({ count: 0 });
        const handler = vi.fn();
        store.subscribe(handler);
        store.setState({ count: 1 });
        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith(
            expect.objectContaining({ count: 1 }),
            expect.objectContaining({ count: 0 })
        );
    });

    it('subscribe 返回取消函数', () => {
        const store = new Store({ count: 0 });
        const handler = vi.fn();
        const unsub = store.subscribe(handler);
        unsub();
        store.setState({ count: 1 });
        expect(handler).not.toHaveBeenCalled();
    });

    it('getState 返回不可变副本', () => {
        const store = new Store({ nested: { value: 1 } });
        const state = store.getState();
        expect(() => { state.newProp = 'test'; }).toThrow();
    });

    it('subscriberCount 正确计数', () => {
        const store = new Store({ count: 0 });
        expect(store.subscriberCount).toBe(0);
        const unsub = store.subscribe(() => {});
        expect(store.subscriberCount).toBe(1);
        unsub();
        expect(store.subscriberCount).toBe(0);
    });
});
