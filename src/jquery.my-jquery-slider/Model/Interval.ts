import EventEmitter from '../EventEmitter';

interface IInterval {
    maxValue ?:number;
    minValue ?:number;
    maxInterval ?:number;
    minInterval ?:number;
    step ?:number;
}

class Interval {
    outerEventEmitter :EventEmitter;
    defaults :IInterval = {
        maxValue: 100,
        minValue: 0,
        maxInterval: 75,
        minInterval: 25,
        step: 1,
    };
    config :IInterval;

    constructor(config :IInterval, outerEventEmitter :EventEmitter) {
        this.outerEventEmitter = outerEventEmitter;
        this.setConfig(config);
    }

    triggerInit(config :IInterval) {
        this.outerEventEmitter.emit('interval-init', config);
    }
    triggerChange(value :number | object) {
        this.outerEventEmitter.emit('interval-change', value);
    }

    setConfig(config :IInterval) {
        this.config = Object.assign({}, this.defaults, config);
        this.triggerInit(this.getConfig());
    }
    getConfig() {
        return this.config;
    }

    setMaxInterval(value :number) {
        this.config.maxInterval = value;
        this.triggerChange(this.getMaxInterval());
    }
    getMaxInterval() {
        return this.config.maxInterval;
    }
    setMinInterval(value :number) {
        this.config.minInterval = value;
        this.triggerChange(this.getMinInterval());
    }
    getMinInterval() {
        return this.config.minInterval;
    }
    setInterval(min :number, max :number) {
        this.config.maxInterval = max;
        this.config.minInterval = min;
        this.triggerChange(this.getInterval());
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
        this.triggerChange(this.getMaxInterval());
    }
    maxIntervalStepBack() {
        this.config.maxInterval -= this.config.step;
        this.triggerChange(this.getMaxInterval());
    }
    minIntervalStepForward() {
        this.config.minInterval += this.config.step;
        this.triggerChange(this.getMinInterval());
    }
    minIntervalStepBack() {
        this.config.minInterval -= this.config.step;
        this.triggerChange(this.getMinInterval());
    }
}

export default Interval;