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
        this.range = new Range({
            min: 0,
            max: 100,
            current: 50,
        });
        if (!config) return;
        if (config.double) {
            this.range.setRange(0, 75)
            const secondRange = new Range({
                min: 25,
                max: 100,
                current: 75,
            })
            this.slider = new Slider({
                ranges: [this.range, secondRange],
                current: 1,
            })
        }
        if (config.list) {
            const items :Map<number, string> = new Map();
            let key = 0;
            let isFlat = true;
            config.list.forEach(item => {
                if (typeof(item) !=='string') {
                    const specKey = typeof(item[0]) === 'number' ? item[0] : parseInt(item[0]);
                    const value = typeof(item[1]) === 'string' ? item[1] : item[1].toString();
                    items.set(specKey, value);
                    key = specKey+1;
                    isFlat = false;
                } else {
                    items.set(key, item);
                    key++;
                }
            })
            this.list = new List(items);
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
        const name :string | false = this.list.getName(this.range.getCurrent());
        if(!name) return;
        return this.triggerName(name);
    }
    getClosestName() {
        let name :string | false = this.list.getName(this.range.getCurrent());
        if(name) return name;
        else {
            let smallestDistance = this.range.getRange();
            let closest = null;
             this.list.items.forEach((value, key) => {
                const current = this.range.getCurrent();
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
        console.log(newValue);
        this.slider.setCurrentValue(newValue);
        return this.triggerValues(this.getPerValues());
    }
}
export default Model;