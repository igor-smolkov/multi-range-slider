import Model from './Model/Model';
import View from './View/View';
import IView from './View/IView'

class Presenter {
    model :Model;
    view :View;
    constructor(root :HTMLElement, options :ImyJquerySlider) {
        this.model = new Model(options);
        console.log(this.model);
        this.subscribeToModel();
        this.view = new View({
            root: root,
            pairsValuePerValue: this.model.getPairsValuePerValue(),
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
        console.log(this.model.calcPerValue(value));
        this.view.setThumbValue(value, this.model.calcPerValue(value));
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
    backward(index ?:number) {
        if(index || index === 0) {
            this.model.setCurrentIndex(index);
            this.model.backwardCurrentValue();
        } else {
            this.model.backwardCurrentValue();            
        }
    }
    current(index :number) {
        this.model.setCurrentIndex(index);
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