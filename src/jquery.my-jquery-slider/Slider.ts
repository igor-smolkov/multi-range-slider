import EventEmitter from './EventEmitter';

interface ISldier {
    maxValue ?:number;
    minValue ?:number;
    curValue ?:number;
    step ?:number;
}

export default class  Slider {
    eventEmitter :EventEmitter;
    defaults :ISldier = {
        maxValue: 100,
        minValue: 0,
        curValue: 50,
        step: 1,
    };
    config :ISldier;
    constructor(config :ISldier, eventEmitter :EventEmitter) {
        this.eventEmitter = eventEmitter;
        this.setConfig(config);
    }
    setConfig(config :ISldier) {
        this.config = Object.assign({}, this.defaults, config);
        this.eventEmitter.emit('slider-init', this.config);
    }
    getConfig() {
        return this.config;
    }
    setValue(value :number) {
        this.config.curValue = value;
        this.eventEmitter.emit('slider-input', this.config.curValue);
    }
    getValue() {
        return this.config.curValue;
    }
    stepForward() {
        this.config.curValue += this.config.step;
        this.eventEmitter.emit('slider-input', this.config.curValue);
    }
    stepBack() {
        this.config.curValue -= this.config.step;
        this.eventEmitter.emit('slider-input', this.config.curValue);
    }
}