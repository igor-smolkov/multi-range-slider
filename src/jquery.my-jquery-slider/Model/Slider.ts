import Range from './Range'

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
    setCurrentIndex(index :number = this.ranges.length-2) {
        if (index <= 0) {
            this.currentIndex = 1;
        } else {
            this.currentIndex = index;
        }
    }
    setStep(step :number = 1) {
        this.step = step;
    }
    getRanges() {
        return this.ranges;
    }
    getCurrentIndex() {
        return this.currentIndex;
    }
    getStep() {
        return this.step;
    }
    //extra
    setCurrentValue(value :number) {
        this.getRanges()[this.getCurrentIndex()].setValue(value);
        //?
        if (this.getRanges()[this.getCurrentIndex()-1]) {
            this.getRanges()[this.getCurrentIndex()-1].setMax(value);
        }
        if (this.getRanges()[this.getCurrentIndex()+1]) {
            this.getRanges()[this.getCurrentIndex()+1].setMin(value);
        }
    }
    setMinInterval(value :number) {
        this.getRanges()[1].setValue(value);
    }
    setMaxInterval(value :number) {
        return this.getRanges()[this.getRanges().length-2].setValue(value);
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
    getMin() {
        return this.getRanges()[0].getValue();
    }
    getMax() {
        return this.getRanges()[this.getRanges().length-1].getValue();
    }
    getMinInterval() {
        return this.getRanges()[1].getValue();
    }
    getMaxInterval() {
        return this.getRanges()[this.getRanges().length-2].getValue();
    }
}

export default Slider;