interface IEventEmitter {
    [key: string]: Array<Function>;
}

class EventEmitter {
    events: IEventEmitter;
    constructor() {
        this.events = {};
    }
    subscribe(eventName :string, callback :Function) {
        !this.events[eventName] && (this.events[eventName] = []);
        this.events[eventName].push(callback);
    }
    unsubscribe(eventName :string, callback :Function) {
        this.events[eventName] = this.events[eventName].filter(eventCallback => callback !== eventCallback);
    }
    emit(eventName :string, args :any = null) {
        const event = this.events[eventName];
        event && event.forEach(callback => callback.call(null, args));
    }
}

export {EventEmitter}