import { Range, IRange } from './Range'

type TSlider = {
    ranges: IRange[];
    active?: number;
    step?: number;
    actuals?: number[];
}

interface ISlider {
    getMin(): number;
    setMin(limit: number): number;
    getMax(): number;
    setMax(limit: number): number;
    getValue(): number;
    setValue(value: number): number;
    getActive(): number;
    getStep(): number;
    getActuals(): number[];
    getActive(): number;
    setActive(active: number): number;
    isDouble(): boolean;
}

class Slider implements ISlider {
    private _ranges: IRange[];
    private _active: number;
    private _step: number;
    private _actuals: number[];

    constructor(options: TSlider = {
        ranges: [new Range()],
        active: 0,
        step: 1,
        actuals: null,
    }) {
        const config = Object.assign({}, options);
        this._ranges = this._correctRanges(config.ranges);
        this._active = this._isCorrectIndex(config.active) ? config.active : 0;
        this._step = this._setStep(config.step);
        this._actuals = this.setActuals(config.actuals);
    }

    public setMin(limit: number) {
        if (!this._ranges.find(range => limit <= range.getMax())) return this._ranges[0].getMin();
        this._ranges[0].setMin(limit);
        let cutIndex = 0;
        this._ranges.forEach((range, index) => {
            if (limit > range.getMin()) {
                range.setMin(limit)
            }
            if (limit > range.getMax()) {
                cutIndex = index + 1;
            }
        });
        this._ranges.splice(0, cutIndex);
        return this._ranges[0].getMin();
    }
    public getMin() {
        return this._ranges[0].getMin();
    }
    public setMax(limit: number) {
        if (!this._ranges.find(range => limit >= range.getMin())) return this._ranges[0].getMax();
        this._ranges[this._ranges.length-1].setMax(limit);
        let cutIndex = 0;
        const ranges = this._ranges.slice().reverse();
        ranges.forEach((range, index) => {
            if (limit < range.getMax()) {
                range.setMax(limit)
            }
            if (limit < range.getMin()) {
                cutIndex = index + 1;
            }
        });
        ranges.splice(0, cutIndex);
        this._ranges = ranges.slice().reverse();
        return this._ranges[this._ranges.length-1].getMax();
    }
    public getMax() {
        return this._ranges[this._ranges.length-1].getMax();
    }
    public setValue(value: number) {
        return this._setValueByIndex(value, this._active);
    }
    public getValue() {
        return this._ranges[this._active].getCurrent();
    }
    public setPerValue(perValue: number) {
        const newValue = perValue * this.getAbsoluteRange() / 100 + this.getMin();
        return this.setValue(newValue);
    }
    public getPerValue(index: number) {
        return ((this._ranges[index].getCurrent() - this.getMin()) / this.getAbsoluteRange()) * 100;
    }
    public setStep(step: number) {
        this._step = step;
        return this._step;
    }
    public getStep() {
        return this._step;
    }
    public setMinInterval(value: number) {
        return this._setValueByIndex(value, 0);
    }
    public getMinInterval() {
        return this._ranges[0].getCurrent();
    }
    public setMaxInterval(value: number) {
        return this._setValueByIndex(value, this._ranges.length-1);
    }
    public getMaxInterval() {
        return this._ranges[this._ranges.length-1].getCurrent();
    }
    public setActive(active: number) {
        if (!this._isCorrectIndex(active)) return this._active;
        this._active = active;
        return this._active;
    }
    public getActive() {
        return this._active;
    }
    public setActiveCloseOfValue(value: number) {
        const index = this._getIndexCloseOfValue(value);
        return this.setActive(index);
    }
    public isDouble() {
        return this._ranges.length === 2 ? true : false;
    }
    public getLimits() {
        const limits: number[] = [];
        this._ranges.forEach((range, index) => {
            if (index === 0) {
                limits.push(range.getMin());
            } 
            limits.push(range.getCurrent());
            if (index === this._ranges.length-1) {
                limits.push(range.getMax());
            }
        })
        return limits;
    }
    public getPerValues() {
        const perValues: number[] = [];
        this._ranges.forEach((_,index) => {
            perValues.push(this.getPerValue(index));
        })
        return perValues;
    }
    public setActuals(actuals: number[]) {
        if (!this._actuals) this._actuals = this._defineActuals(this._ranges.length);
        if (!actuals) return this._actuals;
        actuals.forEach(actual => {
            if (!this._isCorrectIndex(actual)) return this._actuals;
        })
        this._actuals = actuals;
        return actuals;
    }
    public getActuals() {
        return this._actuals;
    }
    public getAbsoluteRange() {
        return this.getMax()-this.getMin();
    }

    private _correctRanges(ranges: IRange[]) {
        const validRanges: IRange[] = [];
        ranges
            .sort((a, b) => {
                if (a.getMin() < b.getMin()) {
                    return a.getMin() - b.getMin()
                } else {
                    return a.getMax() - b.getMax()
                }
            })
            .forEach((range, index) => {
            if (index === 0) {
                validRanges.push(range);
            } else {
                if(ranges[index-1].getMax() === range.getCurrent()) { 
                    validRanges.push(range);
                } else {
                    if (ranges[index-1].getMax() === range.setCurrent(ranges[index-1].getMax())) {
                        validRanges.push(range);
                    }
                }
            }
        })
        return validRanges;
    }
    private _isCorrectIndex(index: number) {
        if ((0 <= index) && (index < this._ranges.length)) {
            return true;
        } else {
            return false;
        }
    }
    private _setStep(step: number) {
        this._step = step && step !== 0 ? step : 1;
        return this._step;
    }
    private _setValueByIndex(value: number, index: number) {
        if (!this._isCorrectIndex(index)) return 0;
        const correctedValue = this._correctValueByStep(value);
        const newValue = this._ranges[index].setCurrent(correctedValue);
        if (this._isCorrectIndex(index - 1)) {
            this._ranges[index - 1].setMax(newValue);
        }
        if (this._isCorrectIndex(index + 1)) {
            this._ranges[index + 1].setMin(newValue);
        }
        return newValue;
    }
    private _getIndexCloseOfValue(value: number) {
        const index = this._getIndexByValue(value);
        const inRange: IRange = this._getRange(index);
        const prevRange: IRange = this._getRange(index - 1);
        if (!prevRange) return index;
        return (inRange.getCurrent() - value < value - prevRange.getCurrent()) ? index : index - 1;
    }
    private _getIndexByValue(value: number) {
        return this._ranges.findIndex((range, index) => range.getMin() <= value && (value <= range.getCurrent() || index === this._ranges.length-1));
    }
    private _getRange(index: number) {
        if (!this._isCorrectIndex(index)) return;
        return this._ranges[index];
    }
    private _defineActuals(length: number) {
        const actuals = [];
        let isPrime = true;
        for(let i = 2; i < length; i++){
            if (length % i === 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) {
            if (length > 1) {
                for (let i = 1; i < length; i++) {
                    actuals.push(i);
                }
            } else {
                actuals.push(0);
            }
        } else {
            for (let i = length - 1; i > 0; i--) {
                if (length % i === 0) {
                    for (let j = 0; j < length; j++) {
                        if (j % i !== 0) {
                            actuals.push(j)
                        }
                    }
                    break;
                }
            }
        }
        return actuals;
    }
    private _correctValueByStep(value: number) {
        return this._correcterValueTailBy(this._step)(Math.round(value * 1/this._step) * this._step);
    }
    private _correcterValueTailBy(source: number) {
        const mantissa = source.toString().split('.')[1];
        const mantissaLength = mantissa ? mantissa.length : 0;
        return (value: number): number => +(value).toFixed(mantissaLength);
    }
}

export { Slider, ISlider, TSlider };