import Model from './Model/Model-s';
import View from './View/View-s';
import IView from './View/IView'

class Presenter {
    model :Model;
    view :View;
    constructor(root :HTMLElement, options :ImyJquerySlider) {
        this.model = new Model(options);
        console.log(this.model);
        this.subscribeToModel();
        this.view = new View({
            widths: this.model.getPerValues(),
            current: this.model.getCurrentRangeIndex(),
        }, root, this)
        console.log(this.model.getPerValues());
        // this.view = new View({
        //     root: root,
        //     pairsValuePerValue: this.model.getPairsValuePerValue(),
        //     currentIndex: this.model.getCurrentIndex(),
        // }, this);
    }
    subscribeToModel() {
        this.model.on('select', (value :number)=>this.handleSelect(value));
        this.model.on('values', (perValues :Array<number>)=>this.handleValues(perValues));
        this.model.on('step', (value :number)=>this.handleStep(value));
        this.model.on('name', (name :string)=>this.handleName(name));
    }

    handleSelect(index :number) {
        console.log('handleSelect');
        console.log(index);
        this.view.update({current: index});
        // this.view.update({currentIndex: index});
    }
    handleValues(perValues :Array<number>) {
        console.log('handleValues');
        console.log(perValues);
        this.view.update({widths: perValues});
        // this.view.renderBars(this.model.getPerValues());
        // console.log(this.model.getClosestName());
        // console.log(value);
        // console.log(this.model.calcPerValue(value));
        // this.view.update({pairsValuePerValue: this.model.getPairsValuePerValue()});
    }
    handleStep(step :number) {
        console.log('handleStep');
        console.log(step);
    }
    handleName(name :string) {
        console.log('handleName');
        console.log(name);
    }

    setCurrent(perValue :number) {
        this.model.setCurrent(perValue);
    }
    select(index :number) {
        this.model.selectRange(index);
    }
    
    // forward(index ?:number) {
    //     if(index || index === 0) {
    //         this.model.setCurrentIndex(index);
    //         this.model.forwardCurrentValue();
    //     } else {
    //         this.model.forwardCurrentValue();            
    //     }
    // }
    // backward(index ?:number) {
    //     if(index || index === 0) {
    //         this.model.setCurrentIndex(index);
    //         this.model.backwardCurrentValue();
    //     } else {
    //         this.model.backwardCurrentValue();            
    //     }
    // }
    // current(index :number) {
    //     this.model.setCurrentIndex(index);
    // }
    // setPerValue(perValue :number) {
    //     this.model.setCurrentPerValue(perValue);
    // }

    update(options :ImyJquerySlider) {
        //
    }

    // trigger(event :string) {
    //     const $this = $(this.view.getRoot());
    //     $this.trigger(`my-jquery-slider-${event}`);
    //     $this.on(`my-jquery-slider-${event}`, () => {
    //         $this.val(this.model.getCurrentValue());
    //     })
    // }
}

export default Presenter;