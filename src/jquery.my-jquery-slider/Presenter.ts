import Model from './Model/Model';
import View from './View/View';

class Presenter {
    model :Model;
    view :View;
    constructor(root :HTMLElement, options :ImyJquerySlider) {
        this.model = new Model(options);
        this.subscribeToModel();
        this.view = new View({
            root: root,
            values: this.model.getValues(),
            currentIndex: this.model.getCurrentIndex(),
        }, this);
    }
    subscribeToModel() {
        this.model.on('current-index', (value :number)=>this.handleCurrentIndex(value));
        this.model.on('value', (value :number)=>this.handleValue(value));
        this.model.on('step', (value :number)=>this.handleStep(value));
    }

    handleCurrentIndex(index :number) {
        console.log('handleCurrentIndex');
        console.log(index);
        this.view.setCurrentIndex(index);
    }
    handleValue(value :number) {
        console.log('handleValue');
        console.log(value);
        this.view.setThumbValue(value);
    }
    handleStep(step :number) {
        console.log('handleStep');
        console.log(step);
    }
    
    forward(index ?:number) {
        if(index || index === 0) {
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

export default Presenter;