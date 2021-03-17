import Range from './Range-d'

class Slider {
    ranges :Array<Range>;
    currentIndex :number;
    step :number;
    constructor(values = [0, 50, 100]) {
        this.setRanges(values);
        this.setCurrentIndex();
        this.setStep();
    }
    setRanges(values :Array<number>) {
        this.ranges = [];
        for(let i = 0; i < values.length; i++) {
            const min = (0 <= i-1) ? values[i-1] : values[i];
            const max = (i+1 < values.length) ? values[i+1] : values[i];
            const value = values[i];
            this.ranges.push(new Range({min: min, max: max, value: value}));
        }
    }
    getRanges() {
        return this.ranges;
    }
    setCurrentIndex(index :number = this.ranges.length-2) {
        if (index <= 0) {
            this.currentIndex = 1;
        } else {
            this.currentIndex = index;
        }
    }
    getCurrentIndex() {
        return this.currentIndex;
    }
    setStep(step :number = 1) {
        this.step = step;
    }
    getStep() {
        return this.step;
    }
    //extra
    setCurrentValue(value :number) {
        this.getRanges()[this.getCurrentIndex()].setValue(value);
    }
    getCurrentValue() {
        return this.getRanges()[this.getCurrentIndex()].getValue();
    }
    getValues() {
        const values :Array<number> = [];
        this.getRanges().forEach(range => {
            values.push(range.getValue());
        })
        return values;
    }
}

export default Slider;