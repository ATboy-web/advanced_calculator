import { describe, it, expect, vi } from 'vitest';
import { EventBus } from '../../src/js/core/event-bus.js';

describe('EventBus', () => {
    it('on + emit 基本通信', () => {
        const bus = new EventBus();
        const handler = vi.fn();
        bus.on('test', handler);
        bus.emit('test', 'hello');
        expect(handler).toHaveBeenCalledWith('hello');
    });

    it('多个监听器都能收到事件', () => {
        const bus = new EventBus();
        const h1 = vi.fn();
        const h2 = vi.fn();
        bus.on('test', h1);
        bus.on('test', h2);
        bus.emit('test', 42);
        expect(h1).toHaveBeenCalledWith(42);
        expect(h2).toHaveBeenCalledWith(42);
    });

    it('off 取消订阅', () => {
        const bus = new EventBus();
        const handler = vi.fn();
        bus.on('test', handler);
        bus.off('test', handler);
        bus.emit('test');
        expect(handler).not.toHaveBeenCalled();
    });

    it('on 返回取消函数', () => {
        const bus = new EventBus();
        const handler = vi.fn();
        const unsub = bus.on('test', handler);
        unsub();
        bus.emit('test');
        expect(handler).not.toHaveBeenCalled();
    });

    it('once 只触发一次', () => {
        const bus = new EventBus();
        const handler = vi.fn();
        bus.once('test', handler);
        bus.emit('test', 1);
        bus.emit('test', 2);
        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith(1);
    });

    it('clear 清除指定事件', () => {
        const bus = new EventBus();
        const h1 = vi.fn();
        const h2 = vi.fn();
        bus.on('a', h1);
        bus.on('b', h2);
        bus.clear('a');
        bus.emit('a');
        bus.emit('b');
        expect(h1).not.toHaveBeenCalled();
        expect(h2).toHaveBeenCalled();
    });

    it('clear() 无参数清除全部', () => {
        const bus = new EventBus();
        const h1 = vi.fn();
        const h2 = vi.fn();
        bus.on('a', h1);
        bus.on('b', h2);
        bus.clear();
        bus.emit('a');
        bus.emit('b');
        expect(h1).not.toHaveBeenCalled();
        expect(h2).not.toHaveBeenCalled();
    });

    it('listenerCount 返回监听器数量', () => {
        const bus = new EventBus();
        expect(bus.listenerCount('test')).toBe(0);
        bus.on('test', () => {});
        bus.on('test', () => {});
        expect(bus.listenerCount('test')).toBe(2);
    });

    it('handler 抛错不影响其他 handler', () => {
        const bus = new EventBus();
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const h1 = vi.fn(() => { throw new Error('oops'); });
        const h2 = vi.fn();
        bus.on('test', h1);
        bus.on('test', h2);
        bus.emit('test');
        expect(h2).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});
