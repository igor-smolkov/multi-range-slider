import EventEmitter from './EventEmitter';
import SimpleSlider from './SimpleSlider';
import IntervalSlider from './IntervalSlider'

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
    slider :SimpleSlider | IntervalSlider;
    simpleSlider :SimpleSlider;
    intervalSlider :IntervalSlider;
    isInterval :boolean;
    constructor(config :ISldier, outerEventEmitter :EventEmitter) {
        this.outerEventEmitter = outerEventEmitter;
        this.innerEventEmitter = new EventEmitter();
        this.isInterval = config ? config.isInterval : false;
        this.slider = this.isInterval ? 
            this.createIntervalSlider(config) : this.createSimpleSlider(config);
    }
    createSimpleSlider(config :ISldier) {
        this.subscribeToSimpleSlider();
        this.simpleSlider = new SimpleSlider(config, this.innerEventEmitter);
        return this.simpleSlider;
    }
    createIntervalSlider(config :ISldier) {
        this.subscribeToIntervalSlider();
        this.intervalSlider = new IntervalSlider(config, this.innerEventEmitter);
        return this.intervalSlider;
    }
    subscribeToSimpleSlider() {
        this.innerEventEmitter.subscribe('simple-slider-init', (config :ISldier)=>this.handleSliderInit(config));
        this.innerEventEmitter.subscribe('simple-slider-input', (config :ISldier)=>this.handleSliderInput(config));
    }
    subscribeToIntervalSlider() {
        this.innerEventEmitter.subscribe('interval-slider-init', (config :ISldier)=>this.handleSliderInit(config));
        this.innerEventEmitter.subscribe('interval-slider-input', (config :ISldier)=>this.handleSliderInput(config));
    }

    triggerInit(config :ISldier) {
        this.outerEventEmitter.emit('slider-init', config);
    }
    triggerInput(value :number | object) {
        this.outerEventEmitter.emit('slider-input', value);
    }
    handleSliderInit(config :ISldier) {
        this.triggerInit(config);
    }
    handleSliderInput(value :number | object) {
        this.triggerInput(value);
    }

    setConfig(config :ISldier) {
        this.slider.setConfig(config);
    }
    getConfig() {
        return this.slider.getConfig();
    }

    setValue(value :number) {
        if(!this.simpleSlider) return;
        this.simpleSlider.setValue(value);
    }
    getValue() {
        if(!this.simpleSlider) return;
        return this.simpleSlider.getValue();
    }
    stepForward() {
        if(!this.simpleSlider) return;
        this.simpleSlider.stepForward();
    }
    stepBack() {
        if(!this.simpleSlider) return;
        this.simpleSlider.stepBack();
    }

    setMaxInterval(value :number) {
        if(!this.intervalSlider) return;
        this.intervalSlider.setMaxInterval(value);
    }
    getMaxInterval() {
        if(!this.intervalSlider) return;
        return this.intervalSlider.getMaxInterval();
    }
    setMinInterval(value :number) {
        if(!this.intervalSlider) return;
        this.intervalSlider.setMinInterval(value);
    }
    getMinInterval() {
        if(!this.intervalSlider) return;
        return this.intervalSlider.getMinInterval();
    }
    setInterval(min :number, max: number) {
        if(!this.intervalSlider) return;
        this.intervalSlider.setInterval(min, max);
    }
    getInterval() {
        if(!this.intervalSlider) return;
        return this.intervalSlider.getInterval();
    }
    maxIntervalStepForward() {
        if(!this.intervalSlider) return;
        this.intervalSlider.maxIntervalStepForward();
    }
    maxIntervalStepBack() {
        if(!this.intervalSlider) return;
        this.intervalSlider.maxIntervalStepBack();
    }
    minIntervalStepForward() {
        if(!this.intervalSlider) return;
        this.intervalSlider.minIntervalStepForward();
    }
    minIntervalStepBack() {
        if(!this.intervalSlider) return;
        this.intervalSlider.minIntervalStepBack();
    }
}

export default Slider;