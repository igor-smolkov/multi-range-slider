import Range from './Range'
import ISlider from './ISlider'

class Slider {
    ranges :Array<Range>;
    current :number;
    constructor(config :ISlider = {
        ranges: [new Range()],
        current: 0,
    }) {
        this.ranges = this.initRanges(config.ranges);
        this.current = this._isCorrectIndex(config.current) ? config.current : 0;
    }
    initRanges(ranges :Array<Range>) {
        const validRanges :Array<Range> = [];
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
    setCurrent(current :number) {
        if (!this._isCorrectIndex(current)) return this.current;
        this.current = current;
        return this.current;
    }
    getCurrent() {
        return this.current;
    }
    getRange(index :number) {
        if (!this._isCorrectIndex(index)) return;
        return this.ranges[index];
    }
    getIndexByValue(value :number) {
        return this.ranges.findIndex((range, index) => range.min <= value && (value <= range.current || index === this.ranges.length-1))
    }
    setValueByIndex(value :number, index :number) {
        if (!this._isCorrectIndex(index)) return 0;
        const newValue = this.ranges[index].setCurrent(value);
        if (this._isCorrectIndex(index - 1)) {
            this.ranges[index - 1].setMax(newValue);
        }
        if (this._isCorrectIndex(index + 1)) {
            this.ranges[index + 1].setMin(newValue);
        }
        return newValue;
    }
    setCurrentValue(value :number) {
        return this.setValueByIndex(value, this.current);
    }
    getCurrentValue() {
        return this.ranges[this.current].getCurrent();
    }
    setMax(limit :number) {
        let isLess = false;
        this.ranges.find((range, index) => {
            if (limit < range.getMax()) {
                range.setMax(limit);
                this.ranges.splice(index+1);
                isLess = true;
            }
        })
        if(!isLess) {
            this.ranges[this.ranges.length-1].setMax(limit);
        }
        return this.ranges[this.ranges.length-1].getMax();
    }
    setMin(limit :number) {
        this.ranges.find((range, index) => {
            if (limit > range.getMin()) {
                range.setMin(limit);
                this.ranges.splice(0, index);
            }
        })
        return this.ranges[0].getMin();
    }
    getMin() {
        return this.ranges[0].getMin();
    }
    getMax() {
        return this.ranges[this.ranges.length-1].getMax();
    }
    getAbsoluteRange() {
        return this.getMax()-this.getMin();
    }
    getMinInterval() {
        return this.ranges[0].getCurrent();
    }
    getMaxInterval() {
        return this.ranges[this.ranges.length-1].getCurrent();
    }
    _isCorrectIndex(index :number) {
        if ((0 <= index) && (index < this.ranges.length)) {
            return true;
        } else {
            return false;
        }
    }
}

export default Slider;