import Range from './Range-s'
import List from './List'
import ISlider from './ISlider-s'

class Slider {
    ranges :Array<Range>;
    current :number;
    constructor(config :ISlider) {
        this.ranges = this.initRanges(config.ranges);
        this.current = config.current ? config.current : 0;
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
    getMin() {
        return this.ranges[0].getMin();
    }
    getMax() {
        return this.ranges[this.ranges.length-1].getMax();
    }
    getRange() {
        return this.getMax()-this.getMin();
    }
    getMinInterval() {
        return this.ranges[0].getCurrent();
    }
    getMaxInterval() {
        return this.ranges[this.ranges.length-1].getCurrent();
    }
    setCurrentValue(value :number) {
        const newValue = this.ranges[this.current].setCurrent(value);
        if (this._isCorrectIndex(this.current - 1)) {
            this.ranges[this.current - 1].setMax(newValue);
        }
        if (this._isCorrectIndex(this.current + 1)) {
            this.ranges[this.current + 1].setMin(newValue);
        }
        return newValue;
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