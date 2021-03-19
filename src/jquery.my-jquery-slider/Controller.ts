import EventEmitter from './EventEmitter';
import IModel from './Model/IModel';
import Model from './Model/Model';
import IView from './View/IView';
import View from './View/View';

class Controller {
    eventEmitter :EventEmitter;
    model :Model;
    view :View;
    constructor(root :HTMLElement, options :ImyJquerySlider) {
        this.eventEmitter = new EventEmitter();
        this.model = this.createModel(options);
        this.view = this.createView(root);
        this.view.fill({
            values: this.model.getValues(),
            currentIndex: this.model.getCurrentIndex(),
        });
    }
    createModel(options :ImyJquerySlider) {
        this.subscribeToModel();
        return new Model(options, this.eventEmitter);
    } 
    subscribeToModel() {
        this.eventEmitter.subscribe('model-inited', (config :IModel)=>this.handleModelInited(config));
        this.eventEmitter.subscribe('model-change-pointer', (value :number)=>this.handleModelChangePointer(value));
        this.eventEmitter.subscribe('model-change-value', (value :number)=>this.handleModelChangeValue(value));
        this.eventEmitter.subscribe('model-change-step', (value :number)=>this.handleModelChangeStep(value));
    }  
    createView(root :HTMLElement) {
        this.subscribeToView();
        return new View(root, this.eventEmitter);
    }
    subscribeToView() {
        this.eventEmitter.subscribe('view-inited', (root :HTMLElement)=>this.handleViewInited(root));
        this.eventEmitter.subscribe('view-filled', (root :HTMLElement)=>this.handleViewFilled(root));
        this.eventEmitter.subscribe('view-forward', (index :number)=>this.handleViewForward(index));
    }

    handleModelInited(config :IModel) {
        console.log('handleModelInited');
        console.log(config);
    }
    handleModelChangePointer(index :number) {
        console.log('handleModelChangePointer');
        console.log(index);
        this.view.setCurrentIndex(index);
    }
    handleModelChangeValue(value :number) {
        console.log('handleModelChangeValue');
        console.log(value);
        this.view.setThumbValue(value);
    }
    handleModelChangeStep(step :number) {
        console.log('handleModelChangeStep');
        console.log(step);
    }
    handleViewInited(root :HTMLElement) {
        console.log('handleViewInited');
        console.log(root);
    }
    handleViewFilled(root :HTMLElement) {
        console.log('handleViewFilled');
        console.log(root);
        this.view.render();
    }
    handleViewForward(index ?:number) {
        console.log('handleViewForward');
        console.log(index);
        if(index) {
            this.model.setCurrentIndex(index);
            this.model.forwardCurrentValue();
        } else {
            this.model.forwardCurrentValue();            
        }
    }

    update(options :ImyJquerySlider) {
        //
    }

    trigger(event :string) {
        const $this = $(this.view.getRoot());
        $this.trigger(`my-jquery-slider-${event}`);
        $this.on(`my-jquery-slider-${event}`, () => {
            $this.val(this.model.getCurrentValue());
        })
    }
}

export default Controller;