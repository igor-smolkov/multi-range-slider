class Ranges {
    ranges :Array<number> = [0, 100];
    currentIndex :number = 1;
    constructor(value ?:number | Array<number>) {
        this.setRanges(value);
        this.setCurrentIndex();
    }
    setRanges(value :number | Array<number> = this.ranges) {
        if (typeof(value) === 'number') {
            this.setMax(value);
        } else {
            this.ranges = value;
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

    setValueByIndex(value :number, index :number) {
        if(!this.isCorrectData(value, index)) return;
        this.ranges[index] = value;
    }
    getValueByIndex(index :number) {
        if(!this.isCorrectIndex(index)) return undefined;
        return this.ranges[index];
    }
    setRangeByIndex(range: Array<number>, index :number) {
        if(!this.isCorrectIndex(index) || (index-1 < 0)) return;
        this.setValueByIndex(range[0], index-1);
        this.setValueByIndex(range[1], index);
    }
    getRangeByIndex(index :number) {
        if(!this.isCorrectIndex(index)) return;
        if (index - 1 < 0) return [this.getValueByIndex(index), this.getValueByIndex(index)];
        return [this.getValueByIndex(index - 1), this.getValueByIndex(index)];
    }
    getRangeValueByIndex(index :number) {
        const [max, min] = this.getRangeByIndex(index);
        return max - min;
    }

    setCurrentValue(value :number) {
        this.setValueByIndex(value, this.currentIndex);
    }
    getCurrentValue() {
        return this.getValueByIndex(this.currentIndex);
    }
    setCurrentRange(range: Array<number>) {
        this.setRangeByIndex(range, this.currentIndex);
    }
    getCurrentRange() {
        return this.getRangeByIndex(this.currentIndex);
    }
    getCurrentRangeValue() {
        return this.getRangeValueByIndex(this.currentIndex);
    }

    setMax(value :number) {
        this.setValueByIndex(value, this.ranges.length-1);
    }
    getMax() {
        return this.getValueByIndex(this.ranges.length-1);
    }
    setMin(value :number) {
        this.setValueByIndex(value, 0);
    }
    getMin() {
        return this.getValueByIndex(0);
    }
    setMaxByIndex(value :number, index :number) {
        this.setValueByIndex(value, index);
    }
    getMaxByIndex(index :number) {
        return this.getValueByIndex(index);
    }
    setMinByIndex(value :number, index :number) {
        this.setValueByIndex(value, index-1);
    }
    getMinByIndex(index :number) {
        return this.getValueByIndex(index-1);
    }
    setCurrentMax(value :number) {
        this.setCurrentValue(value)
    }
    getCurrentMax() {
        return this.getCurrentValue();
    }
    setCurrentMin(value :number) {
        this.setValueByIndex(value, this.currentIndex-1);
    }
    getCurrentMin() {
        return this.getValueByIndex(this.currentIndex-1);
    }

    isCorrectIndex(index :number) {
        if((index >= this.ranges.length) || (index < 0)) return false;
        return true;
    }
    isCorrectData(value :number, index :number) {
        if(!this.isCorrectIndex(index)) return false;
        if(this.isCorrectIndex(index + 1)) {
            if(this.getValueByIndex(index + 1) < value) return false;
        }
        if(this.isCorrectIndex(index - 1)) {
            if(this.getValueByIndex(index - 1) > value) return false;
        }
        return true;
    }
}

export default Ranges;