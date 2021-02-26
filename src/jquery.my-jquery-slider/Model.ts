import EventEmitter from './EventEmitter';

export default class Model {
    defaults :ImyJquerySlider = {
        minValue: 0,
        maxValue: 100,
        curValue: 50,
        isInterval: false,
        minInterval: 25,
        maxInterval: 75,
        step: 1,
        orientation: 'horizontal'
    }
    config :ImyJquerySlider;
    eventEmitter :EventEmitter;
    constructor(options :ImyJquerySlider, eventEmitter :EventEmitter) {
        this.eventEmitter = eventEmitter;
        this.config = this.configCorrect($.extend({}, this.defaults, options));
        this.eventEmitter.emit('init', this.config);
    }
    configCorrect(config :ImyJquerySlider) {
        config.maxValue = config.maxValue < config.minValue ? 
            config.maxValue + config.minValue : config.maxValue;
        if (config.isInterval) {
            config.maxInterval = config.maxInterval > config.maxValue ?
                config.maxValue : config.maxInterval;
            config.minInterval = config.minInterval < config.minValue ?
                config.minValue : config.minInterval;
            if (config.maxInterval < config.minInterval) {
                const swap :number = config.maxInterval;
                config.maxInterval = config.minInterval;
                config.minInterval = swap;
            }
            config.curValue = config.maxInterval - config.minInterval
        } else {
            config.curValue = (config.curValue < config.minValue)||(config.curValue > config.maxValue) ? 
                (config.minValue + config.maxValue)/2 : config.curValue;
            config.maxInterval = config.minInterval = config.curValue;
        }
        config.step = config.step > (config.maxValue - config.minValue) ? 
            config.maxValue - config.minValue : config.step;
        config.curValue = +config.curValue.toFixed(this.calcValuesAfterDotLen(config.step));
        config.orientation = (config.orientation !== 'horizontal')&&(config.orientation !== 'vertical') ? 
            'horizontal' : config.orientation;
        return config;
    }
    calcValuesAfterDotLen(step :number) {
        return step.toString().includes('.') ? step.toString().split('.').pop().length : 0;
    }
}