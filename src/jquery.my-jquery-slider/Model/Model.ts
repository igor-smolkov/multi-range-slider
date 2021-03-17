import EventEmitter from '../EventEmitter'
import IModel from './IModel'
import Slider from './Slider'

class Model {
    outerEventEmitter :EventEmitter;
    slider :Slider;
    constructor(config :IModel, outerEventEmitter :EventEmitter) {
        this.outerEventEmitter = outerEventEmitter;
        this.slider = new Slider();
        if (config) this.configurate(config);
        this.outerEventEmitter.emit('model-inited', this.getConfig());
    }
    configurate(config :IModel) {
        if (config.values) {
            const values = config.values;
            if (config.min) values.unshift(config.min);
            if (config.max) values.push(config.max);
            this.slider.setRanges(values);
            this.slider.setCurrentIndex();
        }
        if (config.step) this.slider.setStep(config.step);
        if (config.current) this.slider.setCurrentValue(config.current);
        if (config.currentIndex) this.slider.setCurrentIndex(config.currentIndex);
        if (config.minInterval) this.slider.setMinInterval(config.minInterval);
        if (config.maxInterval) this.slider.setMaxInterval(config.maxInterval);
        this.outerEventEmitter.emit('model-configurated', this.getConfig());
    }
    getConfig() {
        const config :IModel = {
            values: this.slider.getValues(),
            step: this.slider.getStep(),
            min: this.slider.getMin(),
            max: this.slider.getMax(),
            current: this.slider.getCurrentValue(),
            currentIndex: this.slider.getCurrentIndex(),
            minInterval: this.slider.getMinInterval(),
            maxInterval: this.slider.getMaxInterval(),
        };
        return config;
    }

    setCurrentIndex(index :number) {
        this.slider.setCurrentIndex(index);
        this.outerEventEmitter.emit('model-change-pointer', this.slider.getCurrentIndex());
    }
    setCurrentValue(value :number) {
        this.slider.setCurrentValue(value);
        this.outerEventEmitter.emit('model-change-value', this.slider.getCurrentValue());
    }
    setStep(step :number) {
        this.slider.setStep(step);
        this.outerEventEmitter.emit('model-change-step', this.slider.getStep());
    }
    
    getValues() {
        return this.slider.getValues();
    }
    getCurrentIndex() {
        this.slider.getCurrentIndex();
    }
    getCurrentValue() {
        return this.slider.getCurrentValue();
    }
    forward() {
        this.setCurrentValue(this.slider.getCurrentValue()+this.slider.getStep());
    }
}

export default Model;