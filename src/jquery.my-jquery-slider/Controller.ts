import EventEmitter from './EventEmitter';
import Slider from './Model/Slider-new';
import View from './View/View';

class Controller {
    eventEmitter :EventEmitter;
    slider :Slider;
    view :View;
    constructor(elem :HTMLElement, options :ImyJquerySlider) {
        this.eventEmitter = new EventEmitter();
        this.view = this.createView(elem);
        this.slider = this.createSlider(options);
    }
    createView(elem :HTMLElement) {
        this.subscribeToView();
        return new View(elem, this.eventEmitter);
    }
    createSlider(options :ImyJquerySlider) {
        this.subscribeToSlider();
        return new Slider(options, this.eventEmitter);
    }
    subscribeToView() {
        this.eventEmitter.subscribe('view-init', this.handleViewInit.bind(this));
        this.eventEmitter.subscribe('view-change', (value :number)=>this.handleViewChange(value));
    }
    subscribeToSlider() {
        this.eventEmitter.subscribe('slider-init', (config :ImyJquerySlider)=>this.handleSliderInit(config));
        this.eventEmitter.subscribe('slider-update', (config :ImyJquerySlider)=>this.handleSliderUpdate(config));
        this.eventEmitter.subscribe('slider-change', (value :number)=>this.handleSliderChange(value));
    }

    handleViewInit() {
        this.view.render();
    }
    handleViewChange(value :number) {
        this.slider.setValue(value);
    }
    handleSliderInit(config :ImyJquerySlider) {
        this.view.init(config);
        this.trigger('init');
    }
    handleSliderUpdate(config :ImyJquerySlider) {
        this.view.update(config);
        this.trigger('update');
    }
    handleSliderChange(value :number) {
        this.trigger('change');
    }

    update(options :ImyJquerySlider) {
        this.slider.setConfig(options);
    }

    trigger(event :string) {
        const $this = $(this.view.getRoot());
        $this.trigger(`my-jquery-slider-${event}`);
        $this.on(`my-jquery-slider-${event}`, () => {
            $this.val(this.slider.getValue());
        })
    }
}

export default Controller;