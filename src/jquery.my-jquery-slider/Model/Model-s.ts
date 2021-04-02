import EventEmitter from '../EventEmitter'
import IModel from './IModel'
import IRange from './IRange-s'
import Range from './Range-s'
import List from './List'
import Slider from './Slider-s'

class Model {
    eventEmitter :EventEmitter;
    range :Range;
    list :List;
    slider :Slider;
    constructor(config :IModel) {
        this.eventEmitter = new EventEmitter();
        this.init(config);
    }
    init(config :IModel) {
        const defaultRange = new Range({
            min: 0,
            max: 100,
            current: 50,
        });
        if (!config) {
            this.slider = new Slider({
                ranges: [defaultRange],
                current: 0,
            })
            this.list = new List(new Map());
            return;
        }
        if (config.double || config.maxInterval || config.minInterval) {
            defaultRange.setRange(
                config.min ?? 0, 
                config.maxInterval ?? 75
            );
            defaultRange.setCurrent(
                config.minInterval ?? 25
            );
            const secondRange = new Range({
                min: config.minInterval ?? 25,
                max: config.max ?? 100,
                current: config.maxInterval ?? 75,
            })
            this.slider = new Slider({
                ranges: [defaultRange, secondRange],
                current: 1,
            })
        } else {
            defaultRange.setRange(
                config.min ?? 0, 
                config.max ?? 100
            );
            this.slider = new Slider({
                ranges: [defaultRange],
                current: 0,
            })
        }
        if (config.maxInterval) {
            this.slider.setValueByIndex(config.maxInterval, this.slider.ranges.length-1);
        }
        if (config.minInterval) {
            this.slider.setValueByIndex(config.minInterval, 0);
        }
        if (config.max) {
            this.slider.setMax(config.max);
        }
        if (config.min) {
            this.slider.setMin(config.min);
        }
        if (config.current) {
            if(this.slider.ranges.length > 1) {
                this.slider.setCurrent(config.current);
            } else {
                this.slider.setCurrentValue(config.current);
            }
        }
        const step = config.step ?? 1;
        if (config.list) {
            const items :Map<number, string> = new Map();
            let key = this.slider.getMin();
            let isFlat = true;
            config.list.forEach(item => {
                if (typeof(item) !=='string') {
                    const specKey = typeof(item[0]) === 'number' ? item[0] : parseInt(item[0]);
                    const value = typeof(item[1]) === 'string' ? item[1] : item[1].toString();
                    items.set(specKey, value);
                    key = specKey > key ? specKey + step : key;
                    isFlat = false;
                } else {
                    while (items.has(key)) {
                        key += step;
                    }
                    items.set(key, item);
                    key += step;
                }
            })
            this.list = new List(items);
            if(isFlat || (key - step) > this.slider.getMax()) {
                this.slider.setMax(key-1);
            }
        } else {
            this.list = new List(new Map());
        }
    }

    on(event :string, callback :Function) {
        this.eventEmitter.subscribe(event, callback);
    }
    triggerSelect(index :number) {
        this.eventEmitter.emit('select', index);
        return index;
    }
    triggerStep(step :number) {
        this.eventEmitter.emit('step', step);
        return step;
    }
    triggerValues(perValues :Array<number>) {
        this.eventEmitter.emit('values', perValues);
        return perValues;
    }
    triggerName(name :string) {
        this.eventEmitter.emit('name', name);
        return name;
    }

    getPerValues() {
        const perValues :Array<number> = [];
        this.slider.ranges.forEach(range => {
            perValues.push(
                ((range.getCurrent() - this.slider.getMin()) / this.slider.getRange()) * 100
            );
        })
        return perValues;
    }
    getPerValue() {
        return ((this.range.getCurrent() - this.range.getMin()) / this.range.getRange()) * 100;
    }
    setPerValue(perValue :number) {
        this.range.setCurrent(
            perValue * this.range.getRange() / 100 + this.range.getMin()
        );
        this.checkName();
        // return this.triggerValue(
        //     this.getPerValue()
        // );
    }
    checkName() {
        const name :string | false = this.list.getName(this.slider.getCurrentValue());
        if(!name) return;
        return this.triggerName(name);
    }
    getClosestName() {
        let name :string | false = this.list.getName(this.slider.getCurrentValue());
        if(name) return name;
        else {
            let smallestDistance = this.slider.getRange();
            let closest = null;
             this.list.items.forEach((value, key) => {
                const current = this.slider.getCurrentValue();
                const distance = key > current ? key - current : current - key;
                if (distance < smallestDistance) {
                    smallestDistance = distance;
                    closest = key;
                }
            });
            name = closest !== null ? this.list.items.get(closest) : name;
            return name;
        }
    }
    selectRange(index :number) {
        return this.triggerSelect(
            this.slider.setCurrent(index)
        );
    }
    getCurrentRangeIndex() {
        return this.slider.getCurrent();
    }
    setCurrent(perValue :number) {
        const selectedRange = this.slider.ranges[this.slider.getCurrent()];
        const newValue = perValue * this.slider.getRange() / 100 + this.slider.getMin();
        this.slider.setCurrentValue(newValue);
        return this.triggerValues(this.getPerValues());
    }
}
export default Model;