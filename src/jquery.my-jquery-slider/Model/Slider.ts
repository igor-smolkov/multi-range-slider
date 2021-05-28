import {Range} from './Range'
import {ISlider} from './ISlider'

class Slider {
    private _ranges: Range[];
    private _active: number;
    private _step: number;

    constructor(config: ISlider = {
        ranges: [new Range()],
        active: 0,
        step: 1,
    }) {
        this._ranges = this._correctRanges(config.ranges);
        this._active = this._isCorrectIndex(config.active) ? config.active : 0;
        this._step = config.step;
    }

    public setMin(limit: number) {
        this._ranges.find((range, index) => {
            if (limit > range.getMin()) {
                range.setMin(limit);
                this._ranges.splice(0, index);
            }
        })
        return this._ranges[0].getMin();
    }
    public getMin() {
        return this._ranges[0].getMin();
    }
    public setMax(limit: number) {
        let isLess = false;
        this._ranges.find((range, index) => {
            if (limit < range.getMax()) {
                range.setMax(limit);
                this._ranges.splice(index+1);
                isLess = true;
            }
        })
        if(!isLess) {
            this._ranges[this._ranges.length-1].setMax(limit);
        }
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
        this._ranges.forEach(range => {
            perValues.push(
                ((range.getCurrent() - this.getMin()) / this._getAbsoluteRange()) * 100
            );
        })
        return perValues;
    }

    private _correctRanges(ranges: Range[]) {
        const validRanges: Range[] = [];
        ranges.forEach((range, index) => {
            if (index === 0) {
                validRanges.push(range);
            } else {
                if(ranges[index-1].getMax() === range.getCurrent()) { 
                    validRanges.push(range);
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
    private _setValueByIndex(value: number, index: number) {
        if (!this._isCorrectIndex(index)) return 0;
        const newValue = this._ranges[index].setCurrent(value);
        if (this._isCorrectIndex(index - 1)) {
            this._ranges[index - 1].setMax(newValue);
        }
        if (this._isCorrectIndex(index + 1)) {
            this._ranges[index + 1].setMin(newValue);
        }
        return newValue;
    }
    private _getAbsoluteRange() {
        return this.getMax()-this.getMin();
    }
    private _getIndexCloseOfValue(value: number) {
        const index = this._getIndexByValue(value);
        const inRange: Range = this._getRange(index);
        const prevRange: Range = this._getRange(index - 1);
        if (!prevRange) return index;
        return (inRange.getCurrent() - value < value - prevRange.getCurrent()) ? index : index - 1;
    }
    private _getIndexByValue(value: number) {
        return this._ranges.findIndex((range, index) => range.getMin() <= value && (value <= range.getCurrent() || index === this._ranges.length-1));
    }
    private _getRange(index :number) {
        if (!this._isCorrectIndex(index)) return;
        return this._ranges[index];
    }
    
}

export {Slider};