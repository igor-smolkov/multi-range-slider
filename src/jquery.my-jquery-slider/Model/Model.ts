import EventEmitter from '../EventEmitter'
import IModel from './IModel'
import Range from './Range'
import List from './List'
import Slider from './Slider'

class Model {
    private _eventEmitter: EventEmitter;
    private _slider: Slider;
    private _list: List;
    constructor(config: IModel) {
        this._eventEmitter = new EventEmitter();
        this._list = new List();
        this._init(config);
    }
    public on(event: string, callback: Function) {
        this._eventEmitter.subscribe(event, callback);
    }
    public update(config: IModel) {
        if (!config) return;
        let configModified;
        if (config.isDouble || config.limits) {
            configModified = Object.assign({}, this._getConfig(), config);
            this._slider = this._makeSlider(configModified);
        } else {
            configModified = config;
        }
        this._configurateSlider(configModified);
        if (configModified.list) {
            this._list = this._makeList(configModified.list, this._slider.getStep(), this.slider.getMin());
            this._correctLimitsForList(this._slider.getStep());
        }
    }
    private _init(config: IModel) {
        if (!config) {
            this._slider = new Slider();
            return;
        }
        this._slider = this._makeSlider(config);
        this._configurateSlider(config);
        if (config.list) {
            this._list = this._makeList(config.list, this._slider.getStep(), this.slider.getMin());
            this._correctLimitsForList(this._slider.getStep());
        }
    }
    private _configurateSlider(config: IModel) {
        if (config.min) {
            this._slider.setMin(config.min);
        }
        if (config.max) {
            this._slider.setMax(config.max);
        }
        if (config.value) {
            this._slider.setCurrentValue(config.value);
        }
        if (config.step) {
            this._slider.setStep(config.step);
        }
        if (config.isDouble) {
            this._slider.setCurrent(1);
        }
        if (config.minInterval) {
            this._slider.setValueByIndex(config.minInterval, 0);
        }
        if (config.maxInterval) {
            this._slider.setValueByIndex(config.maxInterval, this._slider.getCountOfRanges()-1);
        }
    }
    private _makeSlider(config: IModel) {
        if (this._isSimpleSlider(config)) return new Slider();
        const limits = config.limits ? config.limits : [0, 25, 75, 100];
        const ranges :Array<Range> = [];
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
        return new Slider({ 
            ranges: ranges,
            active: config.active ? config.active : 0,
        });
    }
    private _isSimpleSlider(config: IModel) {
        return !(config.isDouble || config.maxInterval || config.minInterval || config.limits)
    }
    private _makeList(list: Array<string | Array<number | string>>, step: number, min: number) {
        const items: Map<number, string> = new Map();
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
    private _correctLimitsForList(step :number) {
        const [maxKey, minKey] = [this._list.getMaxKey(), this._list.getMinKey()]
        if (minKey < this._slider.getMin()) {
            this._slider.setMin(minKey);
        }
        if (maxKey > this._slider.getMax() || this._list.isFlat(step)) {
            this._slider.setMax(maxKey);
        }
    }
    private _getConfig() {
        return {
            min: this._slider.getMin(),
            max: this._slider.getMax(),
            value: this._slider.getCurrentValue(),
            step: this._slider.getStep(),
            isDouble: this._slider.isDouble(),
            minInterval: this._slider.getMinInterval(),
            maxInterval: this._slider.getMaxInterval(),
            limits: this._slider.getLimits(),
            active: this._slider.getCurrent(),
            list: this._list.getList(),
        }
    }
    private _triggerSelect(index :number) {
        this._eventEmitter.emit('select', index);
        return index;
    }
    private _triggerStep(step :number) {
        this._eventEmitter.emit('step', step);
        return step;
    }
    private _triggerValues(perValues :Array<number>) {
        this._eventEmitter.emit('values', perValues);
        return perValues;
    }
    private _triggerName(name :string) {
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
}
export default Model;