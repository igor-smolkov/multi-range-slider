import { Range } from './Range'
import { List, IList, TOrderedItems } from './List'
import { Slider, ISlider } from './Slider'
import { TMyJQuerySlider } from '../TMyJQuerySlider'

interface IModel {
    subscribe(callback: Function): void;
    unsubscribe(callback: Function): void;
    update(options?: TMyJQuerySlider): void;
    getConfig(): TMyJQuerySlider;
    getPerValues(): number[];
    getList(): TOrderedItems;
    getClosestName(): string;
    setValue(value: number): void;
    setPerValue(perValue: number): void;
    setActive(active: number): void;
    setActiveCloseOfValue(value: number): void;
}

class Model implements IModel {
    private _slider: ISlider;
    private _list: IList;
    private _config: TMyJQuerySlider;
    private _subscribers: Set<Function>;

    constructor(options: TMyJQuerySlider = {}) {
        this._subscribers = new Set();
        this._init({...options});
    }

    public subscribe(callback: Function) {
        if(!this._subscribers.has(callback)) {
            this._subscribers.add(callback)
        }
    }
    public unsubscribe(callback: Function) {
        this._subscribers.delete(callback);
    }
    public update(options: TMyJQuerySlider = {}) {
        if (options.isDouble || options.limits || (options.minInterval && options.maxInterval)) {
            const oldConfig = {...this.getConfig()};
            const newConfig = {...options};
            newConfig.minInterval = newConfig.minInterval ?? (oldConfig.minInterval > newConfig.min ? oldConfig.minInterval : newConfig.min);
            newConfig.maxInterval = newConfig.maxInterval ?? (oldConfig.maxInterval < newConfig.max ? oldConfig.maxInterval : newConfig.max);
            this._slider = this._makeSlider(newConfig);
        }
        this._configurateSlider({...options});
        if (options.list) {
            this._list = new List({ 
                items: options.list, 
                startKey: this._slider.getMin(), 
                step: this._slider.getStep()
            });
            this._correctLimitsForList();
        }
        //?
        this._setConfig(options);
        this._notify();
    }
    public getConfig(): TMyJQuerySlider {
        return {...this._config};
    }
    public getPerValues(): number[] {
        return [...this._slider.getPerValues()];
    }
    public getList(): TOrderedItems {
        return this._list.getItems();
    }
    public getClosestName(): string {
        let name :string = this._list.getItems().get(this._slider.getValue());
        if (name) return name;
        let smallestDistance = this._slider.getAbsoluteRange();
        let closest = null;
         this._list.getItems().forEach((_, key) => {
            const current = this._slider.getValue();
            const distance = key > current ? key - current : current - key;
            if (distance < smallestDistance) {
                smallestDistance = distance;
                closest = key;
            }
        });
        name = closest !== null ? this._list.getItems().get(closest) : name;
        return name;
    }
    public setValue(value :number) {
        this._slider.setValue(value);
        this._refreshConfig();
        this._notify();
    }
    public setPerValue(perValue: number) {
        this._slider.setPerValue(perValue);
        this._refreshConfig();
        this._notify();
    }
    public setActive(index: number) {
        this._slider.setActive(index);
        this._refreshConfig();
        this._notify();
    }
    public setActiveCloseOfValue(value: number) {
        this._slider.setActiveCloseOfValue(value);
        this._refreshConfig();
        this._notify();
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
        this._notify();
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
    private _notify() {
        this._subscribers.forEach(subscriber => subscriber());
    }
}
export { Model, IModel }