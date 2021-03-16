import EventEmitter from '../EventEmitter';
import Ranges from './Ranges';

interface ISldier {
    isInterval ?: boolean;

    maxValue ?:number;
    minValue ?:number;
    step ?:number;

    curValue ?:number;

    maxInterval ?:number;
    minInterval ?:number;
}

class Slider {
    outerEventEmitter :EventEmitter;
    defaults :ISldier = {
        maxValue: 100,
        minValue: 0,
        curValue: 50,
        step: 1,
    };
    config :ISldier;
    ranges :Ranges;
    constructor(config :ISldier, outerEventEmitter :EventEmitter) {
        this.outerEventEmitter = outerEventEmitter;
        this.config = Object.assign({}, this.defaults, config);
        this.ranges = new Ranges([this.config.minValue, this.config.curValue, this.config.maxValue]);
        this.outerEventEmitter.emit('slider-init', this.config);
    }
    forward() {
        this.ranges.setCurrentValue(this.ranges.getCurrentValue() + this.config.step);
        this.outerEventEmitter.emit('slider-change', this.ranges.getCurrentValue());
    }
    back() {
        this.ranges.setCurrentValue(this.ranges.getCurrentValue() - this.config.step);
        this.outerEventEmitter.emit('slider-change', this.ranges.getCurrentValue());
    }
    setConfig(config :ISldier) {
        this.config = Object.assign({}, this.config, config);
        this.ranges.setRanges([this.config.minValue, this.config.curValue, this.config.maxValue]);
        this.outerEventEmitter.emit('slider-update', this.config);
    }
    setValue(value :number) {
        this.ranges.setCurrentValue(value);
        this.outerEventEmitter.emit('slider-change', this.ranges.getCurrentValue());
    }
    getValue() {
        return this.ranges.getCurrentValue();
    }
}

export default Slider;