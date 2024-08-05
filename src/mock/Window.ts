export type EventName =
  | 'network-change'
  | 'sats-connect-rpc-call'
  | 'sats-connect-rpc-respond';

export interface Event {
  name: EventName;
  detail: Record<string, any>;
}

export type EventListener = (event: Event) => Promise<void>;

export interface Window {
  addEventListener(eventName: EventName, listener: EventListener): string;
  removeListener(eventName: string, id: string): void;
  dispatchEvent(eventName: EventName, detail: Record<string, any>): Promise<boolean>;
}

/**
 * Instead of running apps in browser, creating a mock "event pub sub" to run everything in node runtime
 * to focus on main functionality building now.
 */
export class MockWindow implements Window {
  constructor(
    private readonly listeners: Record<string, Record<string, EventListener>> = {},
  ) {}

  addEventListener(eventName: EventName, listener: EventListener): string {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = {};
    }

    const randomId = `${Math.floor(Math.random() * 100_000_000)}`;
    this.listeners[eventName][randomId] = listener;

    return randomId;
  }

  removeListener(eventName: string, id: string): void {
    if (this.listeners[eventName]) {
      if (this.listeners[eventName][id]) {
        delete this.listeners[eventName][id];
      }
    }
  }

  async dispatchEvent(eventName: EventName, detail: Record<string, any>): Promise<boolean> {
    if (this.listeners[eventName]) {
      await Promise.allSettled(Object.values(this.listeners[eventName]).map(listener => listener({
        name: eventName,
        detail,
      })));
      return true;
    }

    return false;
  }

}
