import IModel from './Model/IModel';
import Model from './Model/Model';
import IView from './View/IView';
import View from './View/View';

class Presenter {
    private _model: Model;
    private _view: View;
    constructor(root: HTMLElement, options: IMyJquerySlider) {
        const modelConfig = this._makeModelConfig(options);
        this._model = new Model(modelConfig);
        this._subscribeToModel();
        console.log('new model', this._model);
        const viewConfig = this._makeViewConfig(root, options);
        this._view = new View(viewConfig, this);
        console.log('new view', this._view);
        this._setData();
    }
    public update(root: HTMLElement, options: IMyJquerySlider) {
        const modelConfig = this._makeModelConfig(options);
        this._model.update(modelConfig);
        console.log('update model', this._model);
        const viewConfig = this._makeViewConfig(root, options);
        this._view.update(viewConfig);
        console.log('update view', this._model);
        this._setData();
    }
    private _makeModelConfig(options: IMyJquerySlider) {
        return !options ? undefined : {
            min: options.min ? options.min : undefined,
            max: options.max ? options.max : undefined,
            value: options.value ? options.value : undefined,
            step: options.step ? options.step : undefined,
            isDouble: options.isDouble ? options.isDouble : undefined,
            minInterval: options.minInterval ? options.minInterval : undefined,
            maxInterval: options.maxInterval ? options.maxInterval : undefined,
            limits: options.limits ? options.limits : undefined,
            active: options.active ? options.active : undefined,
            list: options.list ? options.list : undefined,
        };
    }
    private _subscribeToModel() {
        this._model.on('select', (value :number)=>this.handleSelect(value));
        this._model.on('values', (perValues :Array<number>)=>this.handleValues(perValues));
        this._model.on('step', (value :number)=>this.handleStep(value));
        this._model.on('name', (name :string)=>this.handleName(name));
    }
    private _makeViewConfig(root: HTMLElement, options: IMyJquerySlider) {
        return !options ? undefined : {
            root: root,
            min: this._model.getMin(),
            max: this._model.getMax(),
            value: this._model.getCurrentValue(),
            step: this._model.getStep(),
            orientation: options.orientation ? options.orientation : undefined,
            perValues: this._model.getPerValues(),
            active: this._model.getCurrentRangeIndex(),
            withLabel: options.withLabel ? options.withLabel : undefined,
            scale: options.scale ? options.scale : undefined,
            list: this._model.getList(),
        }
    }
    private _setData() {
        const $this = $(this._view.getRoot());
        $this.data({
            min: this._model.getMin(),
            max: this._model.getMax(),
            value: this._model.getCurrentValue(),
            step: this._model.getStep(),    
            orientation: this._view.getOrientation(),
            isDouble: this._model.isDouble(),
            minInterval: this._model.getMinInterval(),
            maxInterval: this._model.getMaxInterval(),
            limits: this._model.getLimits(),
            active: this._model.getCurrentRangeIndex(),
            withLabel: this._view.checkLabel(),
            scale: this._view.getScaleType(),
            list: this._model.getList(),
            lengthPx: this._view.getLengthPx(),
            withIndent: this._view.checkIndent(),
        })
    }

    handleSelect(index :number) {
        console.log('handleSelect');
        console.log(index);
        this.view.update({current: index});
    }
    handleValues(perValues :Array<number>) {
        console.log('handleValues');
        console.log(perValues);
        this.view.update({perValues: perValues, value: this.model.getCurrentValue()});
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

    _trigger(event :string) {
        this._setData();
        const $this = $(this.view.getRoot());
        $this.trigger(`my-jquery-slider-${event}`);
    }
}

export {Presenter}