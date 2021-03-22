import Range from './Range'
import ISlider from './ISlider'

class Slider {
    defaults :ISlider = {
        minLimit: 0,
        maxLimit: 100,
        ranges: [],
        currentIndex: 1,
        step: 1,
    }
    minLimit :number;
    maxLimit :number;
    ranges :Array<Range>;
    currentIndex :number;
    step :number;
    constructor(config :ISlider) {
        this.minLimit = this.isCorrectLimits(config.minLimit, config.maxLimit) ? config.minLimit : this.defaults.minLimit;
        this.maxLimit = this.isCorrectLimits(this.minLimit, config.maxLimit) ? config.maxLimit : this.defaults.maxLimit;
        this.ranges = config.ranges;
        this.currentIndex = this.isCorrectIndex(config.currentIndex) ? config.currentIndex : this.defaults.currentIndex;
        this.step = config.step;
    }
    isCorrectLimits(min :number, max :number) {
        if (min <= max) {
            return true;
        } else {
            return false;
        }
    }
    isCorrectIndex(index :number) {
        if ((0 <= index) && (index < this.ranges.length)) {
            return true;
        } else {
            return false;
        }
    }
    setLimits(minLimit :number, maxLimit :number) {
        this.minLimit = this.isCorrectLimits(minLimit, maxLimit) ? minLimit : this.minLimit;
        this.maxLimit = this.isCorrectLimits(this.minLimit, maxLimit) ? maxLimit : this.maxLimit;
        return this.getLimits();
    }
    getLimits() {
        return [this.getMinLimit(), this.getMaxLimit()];
    }
    setMinLimit(minLimit :number) {
        this.setLimits(minLimit, this.getMaxLimit());
        return this.getMinLimit();
    }
    setMaxLimit(maxLimit :number) {
        this.setLimits(this.getMinLimit(), maxLimit);
        return this.getMaxLimit();
    }
    getMinLimit() {
        return this.minLimit;
    }
    getMaxLimit() {
        return this.maxLimit;
    }
    setRanges(ranges :Array<Range>) {
        this.ranges = ranges;
        return this.getRanges();
    }
    getRanges() {
        return this.ranges;
    }
    setCurrentIndex(index :number) {
        this.currentIndex = this.isCorrectIndex(index) ? index : this.currentIndex;
        return this.getCurrentIndex();
    }
    getCurrentIndex() {
        return this.currentIndex;
    }
    setStep(step :number) {
        this.step = step;
        return this.getStep();
    }
    getStep() {
        return this.step;
    }
    //
    setCurrentIndexByValue(value :number) {
        this.getRanges().forEach((range, index) => {
            if (range.value === value) {
                return this.setCurrentIndex(index);
            }
        })
        return this.getCurrentIndex();
    }
    setValueByIndex(value :number, index :number) {
        if (!this.isCorrectIndex(index)) return 0;
        const newValue = this.getRanges()[index].setValue(value);
        if (!this.isCorrectIndex(index - 1)) {
            this.setMinLimit(newValue);
        } else {
            this.getRanges()[index - 1].setMax(newValue);
        }
        if (!this.isCorrectIndex(index + 1)) {
            this.setMaxLimit(newValue);
        } else {
            this.getRanges()[index + 1].setMin(newValue);
        }
        return newValue;
    }
    getValueByIndex(index :number) {
        if (!this.isCorrectIndex(index)) return 0;
        return this.getRanges()[index].getValue();
    }
    setMaxByIndex(max :number, index :number) {
        if (!this.isCorrectIndex(index)) return 0;
        const newMax = this.getRanges()[index].setMax(max);
        if (!this.isCorrectIndex(index + 2)) {
            this.setMaxLimit(newMax);
        } else {
            this.getRanges()[index + 1].setValue(newMax);
        }
        return newMax;
    }
    getMaxByIndex(index :number) {
        if (!this.isCorrectIndex(index)) return 0;
        return this.getRanges()[index].getMax();
    }
    setMinByIndex(min :number, index :number) {
        if (!this.isCorrectIndex(index)) return 0;
        const newMin = this.getRanges()[index].setMin(min);
        if (!this.isCorrectIndex(index - 2)) {
            this.setMinLimit(newMin);
        } else {
            this.getRanges()[index - 1].setValue(newMin);
        }
        return newMin;
    }
    getMinByIndex(index :number) {
        if (!this.isCorrectIndex(index)) return 0;
        return this.getRanges()[index].getMin();
    }
}

export default Slider;