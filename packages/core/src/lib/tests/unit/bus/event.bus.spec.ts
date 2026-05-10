import { describe, it, expect, vi } from 'vitest';
import { EventBus } from '../../../bus/event.bus.js';
import type { SdkEvent } from '../../../sdk.events.js';

type TestEvents = SdkEvent & {
  'test:void': void;
  'test:data': { value: number };
};

describe('EventBus', () => {
  describe('on / emit / off', () => {
    it('calls handler when event is emitted', () => {
      const bus = new EventBus<TestEvents>();
      const handler = vi.fn();
      bus.on('test:data', handler);
      bus.emit('test:data', { value: 42 });
      expect(handler).toHaveBeenCalledWith({ value: 42 });
    });

    it('does not call handler after unsubscribe', () => {
      const bus = new EventBus<TestEvents>();
      const handler = vi.fn();
      const off = bus.on('test:data', handler);
      off();
      bus.emit('test:data', { value: 1 });
      expect(handler).not.toHaveBeenCalled();
    });

    it('calls multiple handlers registered for the same event', () => {
      const bus = new EventBus<TestEvents>();
      const h1 = vi.fn();
      const h2 = vi.fn();
      bus.on('test:data', h1);
      bus.on('test:data', h2);
      bus.emit('test:data', { value: 5 });
      expect(h1).toHaveBeenCalledTimes(1);
      expect(h2).toHaveBeenCalledTimes(1);
    });

    it('emits void events without a payload', () => {
      const bus = new EventBus<TestEvents>();
      const handler = vi.fn();
      bus.on('test:void', handler);
      bus.emit('test:void');
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('once()', () => {
    it('fires exactly once then stops', () => {
      const bus = new EventBus<TestEvents>();
      const handler = vi.fn();
      bus.once('test:data', handler);
      bus.emit('test:data', { value: 1 });
      bus.emit('test:data', { value: 2 });
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({ value: 1 });
    });
  });

  describe('onAny()', () => {
    it('receives all events with their event name and payload', () => {
      const bus = new EventBus<TestEvents>();
      const handler = vi.fn();
      bus.onAny(handler);
      bus.emit('test:data', { value: 10 });
      expect(handler).toHaveBeenCalledWith('test:data', { value: 10 });
    });

    it('unsubscribes when returned function is called', () => {
      const bus = new EventBus<TestEvents>();
      const handler = vi.fn();
      const off = bus.onAny(handler);
      off();
      bus.emit('test:data', { value: 1 });
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('emitIf()', () => {
    it('emits when condition is true and returns true', () => {
      const bus = new EventBus<TestEvents>();
      const handler = vi.fn();
      bus.on('test:data', handler);
      const result = bus.emitIf(true, 'test:data', { value: 7 });
      expect(result).toBe(true);
      expect(handler).toHaveBeenCalledWith({ value: 7 });
    });

    it('does not emit when condition is false and returns false', () => {
      const bus = new EventBus<TestEvents>();
      const handler = vi.fn();
      bus.on('test:data', handler);
      const result = bus.emitIf(false, 'test:data', { value: 7 });
      expect(result).toBe(false);
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('use() middleware', () => {
    it('middleware executes in order before handlers', () => {
      const bus = new EventBus<TestEvents>();
      const order: string[] = [];

      bus.use((_ctx, next) => {
        order.push('mw1');
        next();
      });
      bus.use((_ctx, next) => {
        order.push('mw2');
        next();
      });
      bus.on('test:data', () => order.push('handler'));

      bus.emit('test:data', { value: 1 });
      expect(order).toEqual(['mw1', 'mw2', 'handler']);
    });

    it('middleware can intercept and block handlers', () => {
      const bus = new EventBus<TestEvents>();
      const handler = vi.fn();
      bus.use((_ctx, _next) => {
        /* don't call next */
      });
      bus.on('test:data', handler);
      bus.emit('test:data', { value: 1 });
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('waitFor()', () => {
    it('resolves with payload when event fires', async () => {
      const bus = new EventBus<TestEvents>();
      const promise = bus.waitFor('test:data');
      bus.emit('test:data', { value: 99 });
      const result = await promise;
      expect(result).toEqual({ value: 99 });
    });

    it('rejects after timeout if event does not fire', async () => {
      const bus = new EventBus<TestEvents>();
      await expect(bus.waitFor('test:data', undefined, 10)).rejects.toThrow(
        /waitFor timeout/
      );
    });
  });
});
