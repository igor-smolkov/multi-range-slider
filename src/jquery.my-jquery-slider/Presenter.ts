import { Model } from './Model/Model';
import { View } from './View/View';

class Presenter {
    private _root: HTMLElement;
    private _model: Model;
    private _view: View;

    constructor(root: HTMLElement, options: IMyJquerySlider) {
        this._root = root;
        console.log('options', options);
        this._model = new Model(options);
        this._subscribeToModel();
        console.log('new model', this._model);
        this._view = new View(this._makeViewConfig(), this);
        console.log('new view', this._view);
        this._setData();
    }

    public update(options: IMyJquerySlider) {
        this._model.update(options);
        console.log('update model', this._model);
        this._view.render(this._makeViewConfig());
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
    public approveValue() {
        this._model.approveValue();
    }

    private _subscribeToModel() {
        this._model.on('changeActive', ([value, active]: [number, number])=>this._handleChangeActive(value, active));
        this._model.on('changeValue', ([value, perValues]: [number, number[]])=>this._handleChangeValue(value, perValues));
    }
    private _handleChangeActive(value: number, active: number) {
        this._view.modify('active', value, active);
        this._trigger('active');
    }
    private _handleChangeValue(value: number, perValues: number[]) {
        this._view.modify('value', value, perValues);
        this._trigger('value');
    }
    private _makeViewConfig() {
        const config = this._model.getConfig();
        return {
            root: this._root,
            min: config.min,
            max: config.max,
            value: config.value,
            step: config.step,
            orientation: config.orientation,
            perValues: this._model.getPerValues(),
            active: config.active,
            actuals: config.actuals,
            withLabel: config.withLabel,
            scale: config.scale,
            list: this._model.getListMap(),
            lengthPx: config.lengthPx,
            withIndent: config.withIndent,
        }
    }
    private _setData() {
        $(this._root).data(this._model.getConfig());
    }
    private _trigger(event :string) {
        this._setData();
        $(this._root).trigger(`my-jquery-slider-${event}`);
    }
}

export { Presenter }