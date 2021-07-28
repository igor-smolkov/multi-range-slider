import { Corrector } from "../Corrector";
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
    setPerValue(perValue: number): number;
    getStep(): number;
    setStep(step: number): number;
    getMinInterval(): number;
    setMinInterval(value: number): number;
    getMaxInterval(): number;
    setMaxInterval(value: number): number;
    getActuals(): number[];
    setActuals(actuals: number[]): number[];
    getActive(): number;
    setActive(active: number): number;
    setActiveCloseOfValue(value: number): number;
    getAbsoluteRange(): number;
    getPerValues(): number[];
    getLimits(): number[];
    isDouble(): boolean;
}

class Slider implements ISlider {
    private _ranges: IRange[];
    private _active: number;
    private _step: number;
    private _actuals: number[];

    constructor(options: TSlider = { ranges: [new Range()] }) {
        const config = {...options};
        this._ranges = this._correctRanges(config.ranges);
        this._active = this._isCorrectIndex(config.active) ? config.active : 0;
        this._step = this.setStep(config.step);
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
    public setStep(step: number) {
        this._step = step && step > 0 ? step : 1;
        return this.getStep();
    }
    public getStep() {
        return this._step;
    }
    public setMinInterval(value: number) {
        if (value <= this._ranges[0].getMax()) return this._setValueByIndex(value, 0);
        this._ranges.forEach((range, index) => {
            if (value > this.getMax()) {
                range.setMax(this.getMax());
            }
            if (value > range.getMax() && value < this.getMax()) {
                range.setMax(value);
            }
            if (value > range.getCurrent()) {
                this._setValueByIndex(value, index);
            }
        })
        return this.getMinInterval();
    }
    public getMinInterval() {
        return this._ranges[0].getCurrent();
    }
    public setMaxInterval(value: number) {
        if (value >= this._ranges[this._ranges.length-1].getMin()) return this._setValueByIndex(value, this._ranges.length-1);
        const ranges = this._ranges.slice().reverse();
        ranges.forEach((range, index) => {
            if (value < this.getMin()) {
                range.setMin(this.getMin());
            }
            if (value < range.getMin() && value > this.getMin()) {
                range.setMin(value);
            }
            if (value < range.getCurrent()) {
                range.setCurrent(this._setValueByIndex(value, this._ranges.length-1-index));
            }
        })
        this._ranges = ranges.slice().reverse();
        return this.getMaxInterval();
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
            perValues.push(this._getPerValueByIndex(index));
        })
        return perValues;
    }
    public setActuals(actuals: number[]) {
        if (!this._actuals) this._actuals = this._defineActuals(this._ranges.length);
        if (!actuals) return this._actuals;
        const newActuals: number[] = [];
        actuals.forEach(actual => {
            if (this._isCorrectIndex(actual)) {
                newActuals.push(actual);
            }
        })
        this._actuals = newActuals.length ? newActuals : this._actuals;
        return this.getActuals();
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
                if (a.getMin() - b.getMin()) {
                    return a.getMin() - b.getMin()
                } else {
                    return a.getMax() - b.getMax()
                }
            })
            .forEach((range, index) => {
                if (index + 1 !== ranges.length) {
                    if(range.getCurrent() === ranges[index+1].getMin() && range.getMax() === ranges[index+1].getCurrent()) {
                        validRanges.push(range);
                    } else {
                        if(range.setCurrent(ranges[index+1].getMin()) === ranges[index+1].getMin() && range.getMax() === ranges[index+1].setCurrent(range.getMax())) {
                            validRanges.push(range);
                        }
                    }
                } else {
                    validRanges.push(range);
                }
            })
        return validRanges;
    }
    private _isCorrectIndex(index: number) {
        if ((0 <= index) && (index < this._ranges.length) && Number.isInteger(index)) {
            return true;
        } else {
            return false;
        }
    }
    private _setValueByIndex(value: number, index: number) {
        const correctedValue = Corrector.correcterValueTailBy(this._step)(value);
        const newValue = this._ranges[index].setCurrent(correctedValue);
        if (this._isCorrectIndex(index - 1)) {
            this._ranges[index - 1].setMax(newValue);
        }
        if (this._isCorrectIndex(index + 1)) {
            this._ranges[index + 1].setMin(newValue);
        }
        return newValue;
    }
    private _getPerValueByIndex(index: number) {
        return ((this._ranges[index].getCurrent() - this.getMin()) / this.getAbsoluteRange()) * 100;
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
}

export { Slider, ISlider, TSlider };