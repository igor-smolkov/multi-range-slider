import EventEmitter from '../EventEmitter';

interface IRange {
    maxValue ?:number;
    minValue ?:number;
    curValue ?:number;
    step ?:number;
}

class Range {
    outerEventEmitter :EventEmitter;
    defaults :IRange = {
        maxValue: 100,
        minValue: 0,
        curValue: 50,
        step: 1,
    };
    config :IRange;
    constructor(config :IRange, outerEventEmitter :EventEmitter) {
        this.outerEventEmitter = outerEventEmitter;
        this.setConfig(config);
    }
    
    triggerInit(config :IRange) {
        this.outerEventEmitter.emit('range-init', config);
    }
    triggerChange(value :number) {
        this.outerEventEmitter.emit('range-change', value);
    }

    setConfig(config :IRange) {
        this.config = Object.assign({}, this.defaults, config);
        this.triggerInit(this.getConfig());
    }
    getConfig() {
        return this.config;
    }
    setValue(value :number) {
        this.config.curValue = value;
        this.triggerChange(this.getValue());
    }
    getValue() {
        return this.config.curValue;
    }
    stepForward() {
        this.config.curValue += this.config.step;
        this.triggerChange(this.getValue());
    }
    stepBack() {
        this.config.curValue -= this.config.step;
        this.triggerChange(this.getValue());
    }
}

export default Range;