import EventEmitter from './EventEmitter';

interface IIntervalSlider {
    maxValue ?:number;
    minValue ?:number;
    maxInterval ?:number;
    minInterval ?:number;
    step ?:number;
}

class IntervalSlider {
    outerEventEmitter :EventEmitter;
    defaults :IIntervalSlider = {
        maxValue: 100,
        minValue: 0,
        maxInterval: 75,
        minInterval: 25,
        step: 1,
    };
    config :IIntervalSlider;

    constructor(config :IIntervalSlider, outerEventEmitter :EventEmitter) {
        this.outerEventEmitter = outerEventEmitter;
        this.setConfig(config);
    }

    triggerInit(config :IIntervalSlider) {
        this.outerEventEmitter.emit('interval-slider-init', config);
    }
    triggerInput(value :number | object) {
        this.outerEventEmitter.emit('interval-slider-input', value);
    }

    setConfig(config :IIntervalSlider) {
        this.config = Object.assign({}, this.defaults, config);
        this.triggerInit(this.getConfig());
    }
    getConfig() {
        return this.config;
    }

    setMaxInterval(value :number) {
        this.config.maxInterval = value;
        this.triggerInput(this.getMaxInterval());
    }
    getMaxInterval() {
        return this.config.maxInterval;
    }
    setMinInterval(value :number) {
        this.config.minInterval = value;
        this.triggerInput(this.getMinInterval());
    }
    getMinInterval() {
        return this.config.minInterval;
    }
    setInterval(min :number, max :number) {
        this.config.maxInterval = max;
        this.config.minInterval = min;
        this.triggerInput(this.getInterval());
    }
    getInterval() {
        return { 
            min: this.config.minInterval,
            max: this.config.maxInterval,
            val: this.config.maxInterval - this.config.minInterval,
        };
    }

    maxIntervalStepForward() {
        this.config.maxInterval += this.config.step;
        this.triggerInput(this.getMaxInterval());
    }
    maxIntervalStepBack() {
        this.config.maxInterval -= this.config.step;
        this.triggerInput(this.getMaxInterval());
    }
    minIntervalStepForward() {
        this.config.minInterval += this.config.step;
        this.triggerInput(this.getMinInterval());
    }
    minIntervalStepBack() {
        this.config.minInterval -= this.config.step;
        this.triggerInput(this.getMinInterval());
    }
}

export default IntervalSlider;