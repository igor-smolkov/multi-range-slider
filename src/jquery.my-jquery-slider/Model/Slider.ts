import EventEmitter from '../EventEmitter';
import Range from './Range';
import Interval from './Interval'

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
    innerEventEmitter :EventEmitter;
    current :Range | Interval;
    range :Range;
    interval :Interval;
    isInterval :boolean;
    constructor(config :ISldier, outerEventEmitter :EventEmitter) {
        this.outerEventEmitter = outerEventEmitter;
        this.innerEventEmitter = new EventEmitter();
        this.isInterval = config ? config.isInterval : false;
        this.current = this.isInterval ? 
            this.createInterval(config) : this.createRange(config);
    }
    createRange(config :ISldier) {
        this.subscribeToRange();
        this.range = new Range(config, this.innerEventEmitter);
        return this.range;
    }
    createInterval(config :ISldier) {
        this.subscribeToInterval();
        this.interval = new Interval(config, this.innerEventEmitter);
        return this.interval;
    }
    subscribeToRange() {
        this.innerEventEmitter.subscribe('range-init', (config :ISldier)=>this.handleInit(config));
        this.innerEventEmitter.subscribe('range-change', (config :ISldier)=>this.handleChange(config));
    }
    subscribeToInterval() {
        this.innerEventEmitter.subscribe('interval-init', (config :ISldier)=>this.handleInit(config));
        this.innerEventEmitter.subscribe('interval-change', (config :ISldier)=>this.handleChange(config));
    }

    triggerInit(config :ISldier) {
        this.outerEventEmitter.emit('slider-init', config);
    }
    triggerChange(value :number | object) {
        this.outerEventEmitter.emit('slider-change', value);
    }
    handleInit(config :ISldier) {
        this.triggerInit(config);
    }
    handleChange(value :number | object) {
        this.triggerChange(value);
    }

    setConfig(config :ISldier) {
        this.current.setConfig(config);
    }
    getConfig() {
        return this.current.getConfig();
    }

    setValue(value :number) {
        if(!this.range) return;
        this.range.setValue(value);
    }
    getValue() {
        if(!this.range) return;
        return this.range.getValue();
    }
    stepForward() {
        if(!this.range) return;
        this.range.stepForward();
    }
    stepBack() {
        if(!this.range) return;
        this.range.stepBack();
    }

    setMaxInterval(value :number) {
        if(!this.interval) return;
        this.interval.setMaxInterval(value);
    }
    getMaxInterval() {
        if(!this.interval) return;
        return this.interval.getMaxInterval();
    }
    setMinInterval(value :number) {
        if(!this.interval) return;
        this.interval.setMinInterval(value);
    }
    getMinInterval() {
        if(!this.interval) return;
        return this.interval.getMinInterval();
    }
    setInterval(min :number, max: number) {
        if(!this.interval) return;
        this.interval.setInterval(min, max);
    }
    getInterval() {
        if(!this.interval) return;
        return this.interval.getInterval();
    }
    maxIntervalStepForward() {
        if(!this.interval) return;
        this.interval.maxIntervalStepForward();
    }
    maxIntervalStepBack() {
        if(!this.interval) return;
        this.interval.maxIntervalStepBack();
    }
    minIntervalStepForward() {
        if(!this.interval) return;
        this.interval.minIntervalStepForward();
    }
    minIntervalStepBack() {
        if(!this.interval) return;
        this.interval.minIntervalStepBack();
    }
}

export default Slider;