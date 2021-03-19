import IRange from './IRange'

class Range {
    defaults :IRange = {
        min: 0,
        max: 100,
    }
    min :number;
    max :number;
    value :number;
    constructor(config :IRange) {
        this.min = this.isCorrectRange(config.min, config.max) ? config.min : this.defaults.min;
        this.max = this.isCorrectRange(this.min, config.max) ? config.max : this.defaults.max;
        this.value = this.setValue(config.value);
    }
    isCorrectRange(min :number, max :number) {
        if (min <= max) {
            return true;
        } else {
            return false;
        }
    }
    setRange(min :number, max :number) {
        this.min = this.isCorrectRange(min, max) ? min : this.min;
        this.max = this.isCorrectRange(this.min, max) ? max : this.max;
        this.setValue(this.getValue());
        return this.getRange();
    }
    getRange() {
        return [this.getMin(), this.getMax()];
    }
    setMin(min :number) {
        this.setRange(min, this.getMax());
        return this.getMin();
    }
    setMax(max :number) {
        this.setRange(this.getMin(), max);
        return this.getMax();
    }
    getMin() {
        return this.min;
    }
    getMax() {
        return this.max;
    }
    setValue(value :number) {
        if ( (this.getMin() <= value) && (value <= this.getMax()) ) {
            this.value = value;
        } else if (this.getMin() <= value) {
            this.value = this.getMin();
        } else {
            this.value = this.getMax();
        }
        return this.getValue();
    }
    getValue() {
        return this.value
    }
}

export default Range;