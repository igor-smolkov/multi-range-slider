import IRange from './IRange'

class Range {
    defaults :IRange = {
        max: 100,
        min: 0,
        current: 50
    }
    max :number;
    min :number;
    current :number;
    constructor(config :IRange) {
        this.min = this.isCorrectRange(config.min, config.max) ? config.min : this.defaults.min;
        this.max = this.isCorrectRange(this.min, config.max) ? config.max : this.defaults.max;
        this.current = this.setCurrent(config.current);
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
        this.setCurrent(this.getCurrent());
        return this.getCurrent();
    }
    getRange() {
        return this.getMax()-this.getMin();
    }
    setCurrent(current :number) {
        if ( (this.getMin() <= current) && (current <= this.getMax()) ) {
            this.current = current;
        } else if (current <= this.getMin()) {
            this.current = this.getMin();
        } else {
            this.current = this.getMax();
        }
        return this.getCurrent();
    }
    getCurrent() {
        return this.current;
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
}

export default Range;