import EventEmitter from '../EventEmitter'
import IModel from './IModel'
import Slider from './Slider'
import Range from './Range'

class Model {
    defaults :IModel = {
        values: [0, 50, 100],
        currentIndex: 1,
        step: 1,
    }
    eventEmitter :EventEmitter;
    ranges :Array<Range>;
    slider :Slider;
    constructor(config :IModel) {
        this.eventEmitter = new EventEmitter();
        this.ranges = this.createRanges(config ?? this.defaults);
        this.slider = this.createSlider(config ?? this.defaults);
    }
    createRanges(config :IModel) {
        const ranges :Array<Range> = [];
        let values = config.current ? [config.current] : [];
        if (config.values) {
            values = config.values;
        } else {
            if (config.minInterval) {
                values.unshift(config.minInterval);
            }
            if (config.maxInterval) {
                values.push(config.maxInterval);
            }
        }
        if (config.min) {
            values.unshift(config.min);
        }
        if (config.max) {
            values.push(config.max);
        }
        if (values.length === 0) {
            values = this.defaults.values;
        }
        if (values.length === 1) {
            ranges.push( new Range({ 
                min: this.defaults.values[0],
                max: values[0],
            }) );
        }
        if (values.length === 2) {
            ranges.push( new Range({ 
                min: values[0],
                max: values[1],
            }) );
        }
        for (let i = 1; i < values.length-1; i++) {
            ranges.push( new Range({
                min: values[i - 1],
                max: values[i + 1],
                value: values[i],
            }) )
        }
        return ranges;
    }
    createSlider(config :IModel) {
        return new Slider({
            minLimit: this.ranges[0].getMin(),
            maxLimit: this.ranges[this.ranges.length-1].getMax(),
            ranges: this.ranges,
            currentIndex: config.currentIndex ? config.currentIndex : this.defaults.currentIndex,
            step: config.step ? config.step : this.defaults.step,
        });
    }

    on(event :string, callback :Function) {
        this.eventEmitter.subscribe(event, callback);
    }
    triggerCurrentIndex(index :number) {
        this.eventEmitter.emit('current-index', index);
        return index;
    }
    triggerStep(step :number) {
        this.eventEmitter.emit('step', step);
        return step;
    }
    triggerValue(value :number) {
        this.eventEmitter.emit('value', value);
        return value;
    }

    setCurrentIndex(index :number) {
        return this.triggerCurrentIndex(
            this.slider.setCurrentIndex(index)
        );
    }
    setStep(step :number) {
        return this.triggerStep(
            this.slider.setStep(step)
        );
    }
    setCurrentIndexByValue(value :number) {
        return this.triggerCurrentIndex(
            this.slider.setCurrentIndexByValue(value)
        );
    }
    setValueByIndex(value :number, index :number) {
        return this.triggerValue(
            this.slider.setValueByIndex(value, index)
        );
    }
    setMaxByIndex(max :number, index :number) {
        return this.triggerValue(
            this.slider.setMaxByIndex(max, index)
        );
    }
    setMinByIndex(min :number, index :number) {
        return this.triggerValue(
            this.slider.setMinByIndex(min, index)
        );
    }

    getCurrentIndex() {
        return this.slider.getCurrentIndex();
    }
    getStep() {
        return this.slider.getStep();
    }
    getValueByIndex(index :number) {
        return this.slider.getValueByIndex(index);
    }
    getMaxByIndex(index :number) {
        return this.slider.getMaxByIndex(index);
    }
    getMinByIndex(index :number) {
        return this.slider.getMinByIndex(index);
    }
    
    setCurrentValue(value :number) {
        return this.setValueByIndex(value, this.getCurrentIndex());
    }
    setCurrentMax(max :number) {
        return this.setMaxByIndex(max, this.getCurrentIndex());
    }
    setCurrentMin(min :number) {
        return this.setMinByIndex(min, this.getCurrentIndex());
    }
    getCurrentValue() {
        return this.getValueByIndex(this.getCurrentIndex());
    }
    getCurrentMax() {
        return this.getMaxByIndex(this.getCurrentIndex());
    }
    getCurrentMin() {
        return this.getMinByIndex(this.getCurrentIndex());
    }

    forwardValueByIndex(index :number) {
        return this.setValueByIndex(this.getValueByIndex(index) + this.getStep(), index);
    }
    backwardValueByIndex(index :number) {
        return this.setValueByIndex(this.getValueByIndex(index) - this.getStep(), index);
    }
    forwardMaxByIndex(index :number) {
        return this.setMaxByIndex(this.getMaxByIndex(index) + this.getStep(), index);
    }
    backwardMaxByIndex(index :number) {
        return this.setMaxByIndex(this.getMaxByIndex(index) - this.getStep(), index);
    }
    forwardMinByIndex(index :number) {
        return this.setMinByIndex(this.getMinByIndex(index) + this.getStep(), index);
    }
    backwardMinByIndex(index :number) {
        return this.setMinByIndex(this.getMinByIndex(index) - this.getStep(), index);
    }
    forwardCurrentValue() {
        return this.setCurrentValue(this.getCurrentValue() + this.getStep());
    }
    backwardCurrentValue() {
        return this.setCurrentValue(this.getCurrentValue() - this.getStep());
    }
    forwardCurrentMax() {
        return this.setCurrentMax(this.getCurrentMax() + this.getStep());
    }
    backwardCurrentMax() {
        return this.setCurrentMax(this.getCurrentMax() - this.getStep());
    }
    forwardCurrentMin() {
        return this.setCurrentMin(this.getCurrentMin() + this.getStep());
    }
    backwardCurrentMin() {
        return this.setCurrentMin(this.getCurrentMin() - this.getStep());
    }

    //

    getValues() {
        const values :Array<number> = [];
        this.slider.getRanges().forEach(range => {
            values.push(range.getValue());
        });
        return values;
    }

    getLimits() {
        return this.slider.getLimits();
    }
}

export default Model;