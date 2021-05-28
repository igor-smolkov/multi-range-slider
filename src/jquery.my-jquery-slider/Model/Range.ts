import {IRange} from './IRange'

class Range {
    private _max: number;
    private _min: number;
    private _current: number;

    constructor(config: IRange = {
        max: 100,
        min: 0,
        current: 50,
    }) {
        this._min = this._isCorrectRange(config.min, config.max) ? config.min : config.max;
        this._max = config.max;
        this._current = this.setCurrent(config.current);
    }

    public setMin(min: number) {
        this._setRange(min, this.getMax());
        return this.getMin();
    }
    public getMin() {
        return this._min;
    }
    public setMax(max: number) {
        this._setRange(this.getMin(), max);
        return this.getMax();
    }
    public getMax() {
        return this._max;
    }
    public setCurrent(current: number) {
        if ( (this.getMin() <= current) && (current <= this.getMax()) ) {
            this._current = current;
        } else if (current <= this.getMin()) {
            this._current = this.getMin();
        } else {
            this._current = this.getMax();
        }
        return this.getCurrent();
    }
    public getCurrent() {
        return this._current;
    }

    private _isCorrectRange(min: number, max: number) {
        return min <= max ? true : false;
    }
    private _setRange(min :number, max :number) {
        this._min = this._isCorrectRange(min, max) ? min : this._min;
        this._max = this._isCorrectRange(this._min, max) ? max : this._max;
        this.setCurrent(this.getCurrent());
        return this.getCurrent();
    }
}

export {Range}