import EventEmitter from '../EventEmitter'
import IModel from './IModel'
import Range from './Range'
import List from './List'
import Slider from './Slider'

class Model {
    slider :Slider;
    list :List;
    _step :number;
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
                ((range.getCurrent() - this.slider.getMin()) / this.slider.getAbsoluteRange()) * 100
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
            let smallestDistance = this.slider.getAbsoluteRange();
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
    selectCloseOfValue(value :number) {
        const index = this.getIndexCloseOfValue(value);
        return this.selectRange(index);
    }
    getIndexCloseOfValue(value :number) {
        const index = this.slider.getIndexByValue(value);
        const inRange :Range = this.slider.getRange(index);
        const prevRange :Range = this.slider.getRange(index - 1);
        if (!prevRange) return index;
        return (inRange.current - value < value - prevRange.current) ? index : index - 1;
    }
    getCurrentRangeIndex() {
        return this.slider.getCurrent();
    }
    setCurrent(perValue :number) {
        const selectedRange = this.slider.ranges[this.slider.getCurrent()];
        const newValue = perValue * this.slider.getAbsoluteRange() / 100 + this.slider.getMin();
        this.slider.setCurrentValue(newValue);
        return this.triggerValues(this.getPerValues());
    }
    setValue(value :number) {
        this.slider.setCurrentValue(value)
        return this.triggerValues(this.getPerValues());
    }

    getMin() {
        return this.slider.getMin();
    }
    getMax() {
        return this.slider.getMax();
    }
    getStep() {
        return this._step;
    }

    getList() {
        return this.list.getItems();
    }

    getCurrentValue() {
        return this.slider.ranges[this.getCurrentRangeIndex()].getCurrent();
    }

    setMin(min: number) {
        return this.slider.setMin(min);
    }
    setMax(max: number) {
        return this.slider.setMax(max);
    }

    _init(config :IModel) {
        if (!config) {
            this._step = 1;
            this.slider = new Slider();
            this.list = new List();
            return;
        }
        this._step = config.step ? config.step : 1;
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
        if (config.list) {
            this.list = this._makeList(config.list, this._step, this.slider.getMin());
            this._correctLimitsForList(this._step);
        } else {
            this.list = new List();
        }
    }
    _correctLimitsForList(step :number) {
        let isFlat = true;
        let lastIndex :number | null = null;
        this.list.items.forEach((name, index) => {
            if (lastIndex !== null && lastIndex !== index - step) {
                isFlat = false;
            }
            if(index < this.slider.getMin()) {
                this.slider.setMin(index);
            } else if(index > this.slider.getMax()) {
                this.slider.setMax(index);
            }
            lastIndex = index;
        })
        if(isFlat) {
            this.slider.setMax(lastIndex);
        }
    }
    _makeList(list :Array<string | Array<number | string>>, step :number, min :number) {
        const items :Map<number, string> = new Map();
        let key = min;
        list.forEach(item => {
            if (typeof(item) !== 'string') {
                const specKey = typeof(item[0]) === 'number' ? item[0] : parseInt(item[0]);
                const value = typeof(item[1]) === 'string' ? item[1] : item[1].toString();
                items.set(specKey, value);
                key = specKey > key ? specKey + step : key;
            } else {
                while (items.has(key)) {
                    key += step;
                }
                items.set(key, item);
                key += step;
            }
        })
        return new List(items);
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