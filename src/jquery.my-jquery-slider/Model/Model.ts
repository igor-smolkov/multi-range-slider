import { EventEmitter } from '../EventEmitter'
import { Range } from './Range'
import { List, IList, TOrderedItems } from './List'
import { Slider, ISlider } from './Slider'
import { TMyJQuerySlider } from '../TMyJQuerySlider'

interface IModel {
    getLimits(): number[];
    getList(): TOrderedItems;
    getMax(): number;
    setMax(max: number): number;
    getMin(): number;
    setMin(min: number): number;
    getValue(): number;
    setValue(value: number): number;
    setPerValue(perValue: number): number;
    getActive(): number;
    setActive(active: number): number;
    setActiveCloseOfValue(value: number): number;
    getClosestName(): string;
    getStep(): number;
    getActuals(): number[];
    getConfig(): TMyJQuerySlider;
    update(options?: TMyJQuerySlider): void;
    isDouble(): boolean;
    getMinInterval(): number;
    getMaxInterval(): number;
    getPerValues(): number[];
    on(event: string, callback: Function): void;
}

class Model implements IModel {
    private _eventEmitter: EventEmitter;
    private _slider: ISlider;
    private _list: IList;
    private _config: TMyJQuerySlider;

    constructor(options: TMyJQuerySlider = {}) {
        const config = Object.assign({}, options);
        this._eventEmitter = new EventEmitter();
        this._init(config);
        this._eventEmitter.emit('ready');
    }

    public on(event: string, callback: Function) {
        this._eventEmitter.subscribe(event, callback);
    }
    public update(options: TMyJQuerySlider = {}) {
        if (options.isDouble || options.limits || (options.minInterval && options.maxInterval)) {
            const oldConfig = Object.assign({}, this.getConfig());
            const newConfig = Object.assign({}, options);
            newConfig.minInterval = newConfig.minInterval ?? (oldConfig.minInterval > newConfig.min ? oldConfig.minInterval : newConfig.min);
            newConfig.maxInterval = newConfig.maxInterval ?? (oldConfig.maxInterval < newConfig.max ? oldConfig.maxInterval : newConfig.max);
            this._slider = this._makeSlider(newConfig);
        }
        this._configurateSlider(options);
        if (options.list) {
            this._list = new List({ 
                items: options.list, 
                startKey: this._slider.getMin(), 
                step: this._slider.getStep()
            });
            this._correctLimitsForList();
        }
        this._setConfig(options);
        this._eventEmitter.emit('ready');
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
        return this._triggerChangeActive(
            this._slider.setActiveCloseOfValue(value)
        );
    }
    public getList() {
        return this._list.getItems();
    }
    public getActuals() {
        return this._slider.getActuals();
    }
    public getPerValues() {
        return this._slider.getPerValues();
    }

    private _init(options: TMyJQuerySlider) {
        this._slider = this._makeSlider(options);
        this._configurateSlider(options);

        this._list = new List({ 
            items: options.list, 
            startKey: this._slider.getMin(), 
            step: this._slider.getStep()
        });
        this._correctLimitsForList();

        this._setConfig(options);
    }
    private _makeSlider(config: TMyJQuerySlider) {
        if (this._isSimpleSlider(config)) return new Slider();
        const limits = config.limits ? config.limits : [
            config.min ?? 0, 
            config.minInterval ?? (config.value ? (!config.active ? config.value : 25) : (config.min ?? 25)),
            config.maxInterval ?? (config.value ? (config.active === 1 ? config.value : 75) : (config.max ?? 75)), 
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
    private _configurateSlider(config: TMyJQuerySlider) {
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
    private _isSimpleSlider(config: TMyJQuerySlider) {
        return !(config.isDouble || config.maxInterval || config.minInterval || config.limits)
    }
    private _correctLimitsForList() {
        const [maxKey, minKey] = [this._list.getMaxKey(), this._list.getMinKey()]
        if (minKey < this._slider.getMin() && minKey !== null) {
            this._slider.setMin(minKey);
        }
        if ((maxKey > this._slider.getMax() || this._list.isFlat()) && maxKey !== null) {
            this._slider.setMax(maxKey);
        }
    }
    private _setConfig(options: TMyJQuerySlider) {
        const defaults: TMyJQuerySlider = {
            orientation: 'horizontal',
            withLabel: false,
            withIndent: true,
        }
        const state: TMyJQuerySlider = {
            min: this._slider.getMin(),
            max: this._slider.getMax(),
            value: this._slider.getValue(),
            step: this._slider.getStep(),
            isDouble: this._slider.isDouble(),
            minInterval: this._slider.getMinInterval(),
            maxInterval: this._slider.getMaxInterval(),
            limits: this._slider.getLimits(),
            active: this._slider.getActive(),
            list: Array.from(this._list.getItems()),
            actuals: this._slider.getActuals(),
        }
        const config: TMyJQuerySlider = {
            ...this._config,
            ...defaults,
            ...options,
            ...state,
        }
        this._config = config;
    }
    private _refreshConfig() {
        this._setConfig(this._config);
    }
    public getConfig() {
        return this._config;
    }
    public getClosestName() {
        let name :string = this._list.getItems().get(this.getValue());
        if (name) return name;
        let smallestDistance = this._slider.getAbsoluteRange();
        let closest = null;
         this._list.getItems().forEach((_, key) => {
            const current = this.getValue();
            const distance = key > current ? key - current : current - key;
            if (distance < smallestDistance) {
                smallestDistance = distance;
                closest = key;
            }
        });
        name = closest !== null ? this._list.getItems().get(closest) : name;
        return name;
    }
    private _triggerChangeActive(index: number) {
        this._refreshConfig();
        const value = this.getValue();
        const name = this.getClosestName();
        this._eventEmitter.emit('changeActive', [value, name, index]);
        return index;
    }
    private _triggerChangeValue(value: number) {
        this._refreshConfig();
        const perValues = this.getPerValues();
        const name = this.getClosestName();
        this._eventEmitter.emit('changeValue', [value, name, perValues]);
        return value;
    }
}
export { Model, IModel }