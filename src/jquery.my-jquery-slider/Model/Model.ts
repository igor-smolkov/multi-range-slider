import { EventEmitter } from '../EventEmitter'
import { IModel } from './IModel'
import { Range } from './Range'
import { List } from './List'
import { Slider } from './Slider'

class Model {
    private _eventEmitter: EventEmitter;
    private _slider: Slider;
    private _list: List;
    private _config: IMyJquerySlider;

    constructor(options: IMyJquerySlider) {
        this._eventEmitter = new EventEmitter();
        this._init(options);
    }

    public on(event: string, callback: Function) {
        this._eventEmitter.subscribe(event, callback);
    }
    public update(options: IMyJquerySlider) {
        if (!options) return;
        if (options.isDouble || options.limits) {
            const oldConfig = Object.assign({}, this.getConfig());
            const newConfig = Object.assign({}, options);
            newConfig.minInterval = newConfig.minInterval ?? (oldConfig.minInterval > newConfig.min ? oldConfig.minInterval : newConfig.min);
            newConfig.maxInterval = newConfig.maxInterval ?? (oldConfig.maxInterval < newConfig.max ? oldConfig.maxInterval : newConfig.max);
            this._slider = this._makeSlider(newConfig);
        }
        this._configurateSlider(options);
        if (options.list) {
            this._list = this._makeList(options.list, this._slider.getStep(), this._slider.getMin());
            this._correctLimitsForList(this._slider.getStep());
        }
        this._setConfig(options);
    }
    public setMin(min: number) {
        return this._slider.setMin(min);
    }
    public getMin() {
        return this._slider.getMin();
    }
    public setMax(max: number) {
        return this._slider.setMax(max);
    }
    public getMax() {
        return this._slider.getMax();
    }
    public setValue(value :number) {
        return this._triggerChangeValue(
            this._slider.setValue(value)
        );
    }
    public getValue() {
        return this._slider.getValue();
    }
    public setPerValue(perValue: number) {
        return this._triggerChangeValue(
            this._slider.setPerValue(perValue)
        );
    }
    public getStep() {
        return this._slider.getStep();
    }
    public isDouble() {
        return this._slider.isDouble();
    }
    public getMinInterval() {
        return this._slider.getMinInterval();
    }
    public getMaxInterval() {
        return this._slider.getMaxInterval();
    }
    public getLimits() {
        return this._slider.getLimits();
    }
    public setActive(index: number) {
        return this._triggerChangeActive(
            this._slider.setActive(index)
        );
    }
    public getActive() {
        return this._slider.getActive();
    }
    public setActiveCloseOfValue(value: number) {
        return this._slider.setActiveCloseOfValue(value);
    }
    public getListMap() {
        return this._list.getItems();
    }
    public getActuals() {
        return this._slider.getActuals();
    }
    public getPerValues() {
        return this._slider.getPerValues();
    }

    private _init(options: IMyJquerySlider) {
        this._list = new List();
        if (!options) {
            this._slider = new Slider();
            this._setConfig(options);
            return;
        }
        this._slider = this._makeSlider(options);
        this._configurateSlider(options);
        if (options.list) {
            this._list = this._makeList(options.list, this._slider.getStep(), this._slider.getMin());
            this._correctLimitsForList(this._slider.getStep());
        }
        this._setConfig(options);
    }
    private _makeSlider(config: IModel) {
        if (this._isSimpleSlider(config)) return new Slider();
        const limits = config.limits ? config.limits : [
            config.min ?? 0, 
            config.minInterval ?? (config.active === 0 ? config.value : (config.min ?? 25)),
            config.maxInterval ?? (config.active === 1 ? config.value : (config.max ?? 75)), 
            config.max ?? 100
        ];
        const ranges: Range[] = [];
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
        return new Slider({ ranges: ranges, active: config.active });
    }
    private _configurateSlider(config: IModel) {
        if (config.min || config.min === 0) {
            this._slider.setMin(config.min);
        }
        if (config.max || config.max === 0) {
            this._slider.setMax(config.max);
        }
        if (config.value || config.value === 0) {
            this._slider.setValue(config.value);
        }
        if (config.step) {
            this._slider.setStep(config.step);
        }
        if (config.isDouble) {
            this._slider.setActive(1);
        }
        if (config.minInterval || config.minInterval === 0) {
            this._slider.setMinInterval(config.minInterval);
        }
        if (config.maxInterval || config.maxInterval === 0) {
            this._slider.setMaxInterval(config.maxInterval);
        }
        if (config.actuals) {
            this._slider.setActuals(config.actuals);
        }
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
    private _setConfig(options: IMyJquerySlider) {
        const config = Object.assign({}, this._config, options);
        this._config = {
            min: this._slider.getMin(),
            max: this._slider.getMax(),
            value: this._slider.getValue(),
            step: this._slider.getStep(),    
            orientation: config.orientation ? config.orientation : 'horizontal',
            isDouble: this._slider.isDouble(),
            minInterval: this._slider.getMinInterval(),
            maxInterval: this._slider.getMaxInterval(),
            limits: this._slider.getLimits(),
            active: this._slider.getActive(),
            withLabel: config.withLabel ? config.withLabel : false,
            scale: config.scale,
            list: Array.from(this._list.getItems()),
            actuals: this._slider.getActuals(),
            lengthPx: config.lengthPx,
            withIndent: config.withIndent || config.withIndent === false ? config.withIndent : true,
        }
    }
    private _refreshConfig() {
        this._setConfig(this._config);
    }
    public getConfig() {
        return this._config;
    }
    private _triggerChangeActive(index: number) {
        this._refreshConfig();
        const value = this.getValue();
        this._eventEmitter.emit('changeActive', [value, index]);
        return index;
    }
    private _triggerChangeValue(value: number) {
        this._refreshConfig();
        const perValues = this.getPerValues();
        this._eventEmitter.emit('changeValue', [value, perValues]);
        return value;
    }

    // checkName() {
    //     const name :string | false = this.list.getName(this.slider.getCurrentValue());
    //     if(!name) return;
    //     return this.triggerName(name);
    // }
    // getClosestName() {
    //     let name :string | false = this.list.getName(this.slider.getCurrentValue());
    //     if(name) return name;
    //     else {
    //         let smallestDistance = this.slider.getAbsoluteRange();
    //         let closest = null;
    //          this.list.items.forEach((value, key) => {
    //             const current = this.slider.getCurrentValue();
    //             const distance = key > current ? key - current : current - key;
    //             if (distance < smallestDistance) {
    //                 smallestDistance = distance;
    //                 closest = key;
    //             }
    //         });
    //         name = closest !== null ? this.list.items.get(closest) : name;
    //         return name;
    //     }
    // }
}
export { Model }