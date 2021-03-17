class Range {
    min :number;
    max :number;
    value :number = 0;
    constructor({min = 0, max = 100, value = 50}) {
        this.setLimits(min, max);
        this.setValue(value);
    }
    //main
    setLimits(min :number, max :number) {
        if (min <= max) {
            this.min = min;
            this.max = max;
        } else {
            this.min = max;
            this.max = min;
        }
        this.setValue(this.getValue());
    }
    setValue(value :number) {
        if ( (this.getMin() <= value) && (value <= this.getMax()) ) {
            this.value = value;
        } else if (this.getMin() <= value) {
            this.value = this.getMin();
        } else {
            this.value = this.getMax();
        }
    }
    getMin() {
        return this.min;
    }
    getMax() {
        return this.max;
    }
    getValue() {
        return this.value
    }
    //extra
    setMin(min :number) {
        this.setLimits(min, this.getMax());
    }
    setMax(max :number) {
        this.setLimits(this.getMin(), max);
    }
    getLimits() {
        return [this.getMin(), this.getMax()];
    }
    getRange() {
        return [this.getMin(), this.getValue(), this.getMax()];
    }
}

export default Range;