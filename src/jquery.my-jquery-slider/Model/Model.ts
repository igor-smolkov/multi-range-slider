import EventEmitter from '../EventEmitter'
import IModel from './IModel'
import Range from './Range'
import List from './List'
import Slider from './Slider'

class Model {
    slider :Slider;
    list :List;
    _eventEmitter :EventEmitter;
    constructor(config :IModel) {
        this._eventEmitter = new EventEmitter();
        this._init(config);
    }
    on(event :string, callback :Function) {
        this._eventEmitter.subscribe(event, callback);
    }
    triggerSelect(index :number) {
        this._eventEmitter.emit('select', index);
        return index;
    }
    triggerStep(step :number) {
        this._eventEmitter.emit('step', step);
        return step;
    }
    triggerValues(perValues :Array<number>) {
        this._eventEmitter.emit('values', perValues);
        return perValues;
    }
    triggerName(name :string) {
        this._eventEmitter.emit('name', name);
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

    _init(config :IModel) {
        if (!config) {
            this.slider = new Slider();
            this.list = new List();
            return;
        }
        this.slider = this._makeSlider(config);
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
                    if(specKey < this.slider.getMin()) {
                        this.slider.setMin(specKey);
                    }
                    if(specKey > this.slider.getMax()) {
                        this.slider.setMax(specKey);
                    }
                } else {
                    while (items.has(key)) {
                        key += step;
                    }
                    items.set(key, item);
                    key += step;
                }
            })
            this.list = new List(items);
            if(isFlat) {
                this.slider.setMax(key - step);
            }
        } else {
            this.list = new List(new Map());
        }
    }
    _makeSlider(config :IModel) {
        if (config.double || config.maxInterval || config.minInterval || config.limits) {
            return config.limits ? 
                this._makeMultiSlider(config.limits) : 
                this._makeDoubleSlider({
                    min: config.min,
                    max: config.max,
                    minInterval: config.minInterval,
                    maxInterval: config.maxInterval,
                });
        } else {
            return new Slider();
        }
    }
    _makeDoubleSlider({min = 0, max = 100, minInterval = 25, maxInterval = 75}) {
        return new Slider({
            ranges: [
                new Range({
                    min: min,
                    max: maxInterval,
                    current: minInterval,
                }),
                new Range({
                    min: minInterval,
                    max: max,
                    current: maxInterval,
                })
            ],
            current: 1,
        })
    }
    _makeMultiSlider(limits :Array<number> = []) {
        const ranges :Array<Range> = []
        switch (limits.length) {
            case 0:
                ranges.push(new Range());
                break;
            case 1:
                ranges.push(new Range({ min: 0, max: limits[0] }));
                break;
            case 2:
                ranges.push(new Range({ min: limits[0], max: limits[1] }));
                break;
            default:
                for (let i = 1; i < limits.length-1; i++) {
                    ranges.push(new Range({
                        min: limits[i-1],
                        max: limits[i+1],
                        current: limits[i],
                    }));
                }
        }
        return new Slider({ ranges: ranges });
    }
}
export default Model;