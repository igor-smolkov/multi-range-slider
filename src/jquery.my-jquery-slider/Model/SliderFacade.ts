import EventEmitter from '../EventEmitter'
import Slider from './Slider-d'

interface ISlider {
    //основные
    values ?:Array<number>;
    step ?:number;
    //дополнительные
    min ?:number;
    max ?:number;
    current ?:number;
    currentIndex ?:number;
    minInterval ?:number;
    maxInterval ?:number;
    //совместимость
    isInterval ?: boolean;
    maxValue ?:number;
    minValue ?:number;
    curValue ?:number;
}

class SliderFacade {
    outerEventEmitter :EventEmitter;
    slider :Slider;
    constructor(config :ISlider, outerEventEmitter :EventEmitter) {
        this.outerEventEmitter = outerEventEmitter;
        this.init(config);
    }
    init(config :ISlider) {
        const values :Array<number> = config.values ? config.values : [];
        if (config.max) {
            values.push(config.max)
        }
        if (config.min) {
            values.unshift(config.min)
        }

        if (!this.slider) {
            this.slider = new Slider(values);
        } else {
            this.slider.setRanges(values);
        }

        if (config.currentIndex) {
            this.setCurrentIndex(config.currentIndex);
        }
        if (config.current) {
            this.setCurrentValue(config.current);
        }
        if (config.step) {
            this.setStep(config.step);
        }
        
        this.outerEventEmitter.emit('slider-init', this.getValues());
    }
    setCurrentIndex(index :number) {
        this.slider.setCurrentIndex(index);
        this.outerEventEmitter.emit('slider-change-pointer', this.getCurrentIndex());
    }
    setCurrentValue(value :number) {
        this.slider.setCurrentValue(value);
        this.outerEventEmitter.emit('slider-change-value', this.slider.getCurrentValue());
    }
    setStep(step :number) {
        this.slider.setStep(step);
        this.outerEventEmitter.emit('slider-change-step', this.slider.getStep());
    }
    
    getValues() {
        return this.slider.getValues();
    }
    getCurrentIndex() {
        this.slider.getCurrentIndex();
    }
    forward() {
        this.setCurrentValue(this.slider.getCurrentValue()+this.slider.getStep());
    }
    getCurrentValue() {
        return this.slider.getCurrentValue();
    }
}

export default SliderFacade;