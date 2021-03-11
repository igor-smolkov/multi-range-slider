import EventEmitter from './EventEmitter';

interface ISimpleSldier {
    maxValue ?:number;
    minValue ?:number;
    curValue ?:number;
    step ?:number;
}

class SimpleSlider {
    outerEventEmitter :EventEmitter;
    defaults :ISimpleSldier = {
        maxValue: 100,
        minValue: 0,
        curValue: 50,
        step: 1,
    };
    config :ISimpleSldier;
    constructor(config :ISimpleSldier, outerEventEmitter :EventEmitter) {
        this.outerEventEmitter = outerEventEmitter;
        this.setConfig(config);
    }
    
    triggerInit(config :ISimpleSldier) {
        this.outerEventEmitter.emit('simple-slider-init', config);
    }
    triggerInput(value :number) {
        this.outerEventEmitter.emit('simple-slider-input', value);
    }

    setConfig(config :ISimpleSldier) {
        this.config = Object.assign({}, this.defaults, config);
        this.triggerInit(this.getConfig());
    }
    getConfig() {
        return this.config;
    }
    setValue(value :number) {
        this.config.curValue = value;
        this.triggerInput(this.getValue());
    }
    getValue() {
        return this.config.curValue;
    }
    stepForward() {
        this.config.curValue += this.config.step;
        this.triggerInput(this.getValue());
    }
    stepBack() {
        this.config.curValue -= this.config.step;
        this.triggerInput(this.getValue());
    }
}

export default SimpleSlider;