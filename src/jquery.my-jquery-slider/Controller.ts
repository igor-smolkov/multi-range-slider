import EventEmitter from './EventEmitter';
import Slider from './Slider';
import View from './View';

export default class Controller {
    eventEmitter :EventEmitter;
    slider :Slider;
    view :View;
    constructor(elem :HTMLElement, options :ImyJquerySlider) {
        this.eventEmitter = new EventEmitter();
        this.eventEmitter.subscribe('slider-init', (config :ImyJquerySlider)=>this.onSliderInit(config));
        this.eventEmitter.subscribe('slider-input', (value :number)=>this.onSliderInput(value));
        this.eventEmitter.subscribe('view-back', this.onViewBack.bind(this));
        this.eventEmitter.subscribe('view-forward', this.onViewForward.bind(this));

        this.view = new View(elem, this.eventEmitter);
        this.slider = new Slider(options, this.eventEmitter);
    }
    onSliderInit(config :ImyJquerySlider) {
        this.view.message(config.curValue);
        this.view.log(config);
    }
    onSliderInput(value :number) {
        this.view.message(value);
    }
    onViewBack() {
        this.slider.stepBack();
    }
    onViewForward() {
        this.slider.stepForward();
    }
}