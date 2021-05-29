import {Model} from './Model/Model';
import {View} from './View/View';

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
    public setValue(value: number) {
        this._model.setValue(value);
    }
    public setPerValue(perValue: number) {
        this._model.setPerValue(perValue);
    }
    public setActive(active: number) {
        this._model.setActive(active);
    }
    public setActiveCloseOfValue(value: number) {
        this._model.setActiveCloseOfValue(value);
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
            actuals: options.actuals ? options.actuals : undefined,
        };
    }
    private _subscribeToModel() {
        this._model.on('changeActive', (active: number)=>this._handleChangeActive(active));
        this._model.on('changeValue', ([value, perValues]: [number, number[]])=>this._handleChangeValue(value, perValues));
    }
    private _handleChangeActive(active: number) {
        this._view.update({ active: active })
        this._trigger('active');
    }
    private _handleChangeValue(value: number, perValues: number[]) {
        this._view.update({ 
            value: value, 
            perValues: perValues,
        })
        this._trigger('value');
    }
    private _makeViewConfig(root: HTMLElement, options: IMyJquerySlider) {
        return !options ? undefined : {
            root: root,
            min: this._model.getMin(),
            max: this._model.getMax(),
            value: this._model.getValue(),
            step: this._model.getStep(),
            orientation: options.orientation ? options.orientation : undefined,
            perValues: this._model.getPerValues(),
            active: this._model.getActive(),
            actuals: this._model.getActuals(),
            withLabel: options.withLabel ? options.withLabel : undefined,
            scale: options.scale ? options.scale : undefined,
            list: this._model.getListMap(),
            lengthPx: options.lengthPx ? options.lengthPx : undefined,
            withIndent: options.withIndent ? options.withIndent : undefined,
        }
    }
    private _setData() {
        const $this = $(this._view.getRoot());
        $this.data({
            min: this._model.getMin(),
            max: this._model.getMax(),
            value: this._model.getValue(),
            step: this._model.getStep(),    
            orientation: this._view.getOrientation(),
            isDouble: this._model.isDouble(),
            minInterval: this._model.getMinInterval(),
            maxInterval: this._model.getMaxInterval(),
            limits: this._model.getLimits(),
            active: this._model.getActive(),
            withLabel: this._view.checkLabel(),
            scale: this._view.getScaleType(),
            list: this._model.getListMap(),
            actuals: this._model.getActuals(),
            lengthPx: this._view.getLengthPx(this._view.getOrientation() === 'vertical' ? true : false),
            withIndent: this._view.checkIndent(this._view.getOrientation() === 'vertical' ? true : false),
        })
    }
    private _trigger(event :string) {
        this._setData();
        const $this = $(this._view.getRoot());
        $this.trigger(`my-jquery-slider-${event}`);
    }
}

export {Presenter}