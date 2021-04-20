import Model from './Model/Model';
import View from './View/View';

class Presenter {
    model :Model;
    view :View;
    constructor(root :HTMLElement, options :IMyJquerySlider) {
        this.model = new Model(options);
        console.log(this.model);
        this.subscribeToModel();
        this.view = new View({
            perValues: this.model.getPerValues(),
            current: this.model.getCurrentRangeIndex(),
        }, root, this)
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
    }
    handleValues(perValues :Array<number>) {
        console.log('handleValues');
        console.log(perValues);
        this.view.update({perValues: perValues});
        // console.log(this.model.getClosestName());
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

    update(options :IMyJquerySlider) {
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