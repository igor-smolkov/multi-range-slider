import EventEmitter from './EventEmitter';
import SliderFacade from './Model/SliderFacade';
import SliderUI from './View/SliderUI';

class Controller {
    eventEmitter :EventEmitter;
    slider :SliderFacade;
    ui :SliderUI;
    constructor(elem :HTMLElement, options :ImyJquerySlider) {
        this.eventEmitter = new EventEmitter();
        this.slider = this.createSlider(options);
        console.log(this.slider);
        this.ui = this.createUI(elem);
        this.ui.render();
    }
    createSlider(options :ImyJquerySlider) {
        this.subscribeToSlider();
        return new SliderFacade(options, this.eventEmitter);
    }
    subscribeToSlider() {
        this.eventEmitter.subscribe('slider-init', (values :Array<number>)=>this.handleSliderInit(values));
        this.eventEmitter.subscribe('slider-change-pointer', (value :number)=>this.handleSliderChange(value));
        this.eventEmitter.subscribe('slider-change-value', (value :number)=>this.handleSliderChange(value));
        this.eventEmitter.subscribe('slider-change-step', (value :number)=>this.handleSliderChange(value));
    }
    createUI(elem :HTMLElement) {
        this.subscribeToUI();
        const UIConfig :object = {
            root: elem,
            values: this.slider.getValues(),
            currentIndex: this.slider.getCurrentIndex(),
        }
        return new SliderUI(UIConfig, this.eventEmitter);
    }
    subscribeToUI() {
        this.eventEmitter.subscribe('slider-ui-forward', (index :number)=>this.handleUIForward(index));
    }

    handleSliderInit(values :Array<number>) {
        // this.trigger('init');
    }
    handleSliderChange(value :number) {
        this.trigger('change');
    }
    handleUIForward(index :number = -1) {
        if(index === -1) {
            this.slider.forward();
        } else {
            this.slider.setCurrentIndex(index);
            this.slider.forward();
        }
    }

    update(options :ImyJquerySlider) {
        this.slider.init(options);
    }

    trigger(event :string) {
        const $this = $(this.ui.getRoot());
        $this.trigger(`my-jquery-slider-${event}`);
        $this.on(`my-jquery-slider-${event}`, () => {
            $this.val(this.slider.getCurrentValue());
        })
    }
}

export default Controller;