import Model from './Model/Model';
import View from './View/View';

class Presenter {
    model :Model;
    view :View;
    constructor(root :HTMLElement, options :IMyJquerySlider) {
        this.model = new Model(options);
        console.log(this.model);
        this.subscribeToModel();
        this.view = this._configurateView(root, options);
        this._setData();
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
        this._trigger('value');
    }
    handleStep(step :number) {
        console.log('handleStep');
        console.log(step);
    }
    handleName(name :string) {
        console.log('handleName');
        console.log(name);
    }

    setValue(value :number) {
        this.model.setValue(value);
        this._trigger('change');
    }
    setCurrent(perValue :number) {
        this.model.setCurrent(perValue);
        this._trigger('change');
    }
    select(index :number) {
        this.model.selectRange(index);
    }
    selectCloseOfValue(value :number) {
        this.model.selectCloseOfValue(value);
    }

    _setData() {
        const $this = $(this.view.getRoot());
        $this.data({
            current: this.model.getCurrentValue(),
            min: this.model.getMin(),
            max: this.model.getMax(),
        })
    }

    update(root :HTMLElement, options :IMyJquerySlider) {
        if (!options) return;
        if ('current' in options) {
            this.model.setValue(options.current);
        }
        if ('min' in options) {
            this.model.setMin(options.min);
            //убрать
            options.scale = 'numeric';
            this.view = this._configurateView(root, options)
        }
        if ('max' in options) {
            this.model.setMax(options.max);
            //убрать
            options.scale = 'numeric';
            this.view = this._configurateView(root, options)
        }
        if ('scale' in options) {
            console.log('options.scale', options.scale)
            this.view = this._configurateView(root, options)
        }
    }

    _trigger(event :string) {
        this._setData();
        const $this = $(this.view.getRoot());
        $this.trigger(`my-jquery-slider-${event}`);
    }
    _configurateView(root: HTMLElement, options :IMyJquerySlider) {
        return new View({
            perValues: this.model.getPerValues(),
            current: this.model.getCurrentRangeIndex(),
            min: this.model.getMin(),
            max: this.model.getMax(),
            step: this.model.getStep(),
            list: this.model.getList(),
            scale: options ? options.scale : false,
            vertical: options ? options.vertical : false,
            lengthPx: options ? options.lengthPx : undefined,
            indent: options ? options.indent : true,
        }, root, this)
    }
}

export default Presenter;