type TEvents = {
  [key: string]: Array<() => unknown>;
};

interface IEventEmitter {
  subscribe(eventName: string, callback: () => unknown): void;
  unsubscribe(eventName: string, callback: () => unknown): void;
  emit(eventName: string, args?: unknown): void;
}

class EventEmitter implements IEventEmitter {
  events: TEvents;

  constructor() {
    this.events = {};
  }

  public subscribe(eventName: string, callback: () => unknown): void {
    if (!this.events[eventName]) this.events[eventName] = [];
    this.events[eventName].push(callback);
  }

  public unsubscribe(
    eventName: string,
    callback: () => unknown,
  ): void {
    this.events[eventName] = this.events[eventName].filter(
      (eventCallback) => callback !== eventCallback,
    );
  }

  public emit(eventName: string, args?: unknown): void {
    const event = this.events[eventName];
    if (event) {
      event.forEach(
        (callback: (params?: unknown) => unknown) => callback(args),
      );
    }
  }
}

export { EventEmitter, IEventEmitter };
