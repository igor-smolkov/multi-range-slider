import EventEmitter from '../EventEmitter'
import IModel from './IModel'
import IRange from './IRange-s'
import Range from './Range-s'

class Model {
    eventEmitter :EventEmitter;
    range :Range;
    constructor(config :IModel) {
        this.eventEmitter = new EventEmitter();
        this.init(config);
    }
    init(config :IModel) {
        this.range = new Range({
            min: 0,
            max: 100,
            current: 50,
        });
        if (!config) return;
        if (config.list) {
            const list :Map<number, string> = new Map();
            let key = 0;
            let isFlat = true;
            config.list.forEach(item => {
                if (typeof(item) !=='string') {
                    const specKey = typeof(item[0]) === 'number' ? item[0] : parseInt(item[0]);
                    const value = typeof(item[1]) === 'string' ? item[1] : item[1].toString();
                    list.set(specKey, value);
                    key = specKey+1;
                    isFlat = false;
                } else {
                    list.set(key, item);
                    key++;
                }
            })
            this.range.setList(list);
            if(isFlat) {
                this.range.setMax(key-1);
            }
        }
        if (config.max) {
            this.range.setMax(config.max);
        }
        if (config.min) {
            this.range.setMin(config.min);
        }
        if (config.current) {
            this.range.setCurrent(config.current);
        }
    }

    on(event :string, callback :Function) {
        this.eventEmitter.subscribe(event, callback);
    }
    triggerCurrentIndex(index :number) {
        this.eventEmitter.emit('current-index', index);
        return index;
    }
    triggerStep(step :number) {
        this.eventEmitter.emit('step', step);
        return step;
    }
    triggerValue(value :number) {
        this.eventEmitter.emit('value', value);
        return value;
    }
    triggerName(name :string) {
        this.eventEmitter.emit('name', name);
        return name;
    }

    getPerValue() {
        return ((this.range.getCurrent() - this.range.getMin()) / this.range.getRange()) * 100;
    }
    setPerValue(perValue :number) {
        this.range.setCurrent(
            perValue * this.range.getRange() / 100 + this.range.getMin()
        );
        this.checkName();
        return this.triggerValue(
            this.getPerValue()
        );
    }
    checkName() {
        const name :string | false = this.range.getCurrentName();
        if(!name) return;
        return this.triggerName(name);
    }
    getClosestName() {
        let name :string | false = this.range.getCurrentName();
        if(name) return name;
        else {
            let smallestDistance = this.range.getRange();
            let closest = null;
             this.range.list.forEach((value, key) => {
                const current = this.range.getCurrent();
                const distance = key > current ? key - current : current - key;
                if (distance < smallestDistance) {
                    smallestDistance = distance;
                    closest = key;
                }
            });
            name = closest !== null ? this.range.list.get(closest) : name;
            return name;
        }
    }
}
export default Model;