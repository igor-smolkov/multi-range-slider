import { Model } from './Model/Model';
import { TMyJQuerySlider } from './TMyJQuerySlider';
import { View } from './View/View';

interface IPresenter {
    update(options?: TMyJQuerySlider): void;
    setActive(active: number): void;
    setActiveCloseOfValue(value: number): void;
    setValue(value: number): void;
    setPerValue(perValue: number): void;
}

class Presenter implements IPresenter {
    private _root: HTMLElement;
    private _model: Model;
    private _view: View;

    constructor(root: HTMLElement, options: TMyJQuerySlider) {
        this._root = root;
        this._model = new Model(options);
        this._subscribeToModel();
        this._view = new View(this._makeViewConfig(), this);
        this._setData();
    }

    public update(options?: TMyJQuerySlider) {
        const config: TMyJQuerySlider = {...options};
        this._model.update(config);
        this._view = new View(this._makeViewConfig(), this);
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

    private _subscribeToModel() {
        this._model.on('changeActive', ([value, name, active]: [number, string, number])=>this._handleChangeActive(value, name, active));
        this._model.on('changeValue', ([value, name, perValues]: [number, string, number[]])=>this._handleChangeValue(value, name, perValues));
    }
    private _handleChangeActive(value: number, name: string, active: number) {
        // this._view.modify('active', value, name, active);
        // this._view = new View(this._makeViewConfig(), this);
        console.log('value', value, 'name', name, 'active', active);
        this._trigger('active');
    }
    private _handleChangeValue(value: number, name: string, perValues: number[]) {
        // this._view.modify('value', value, name, perValues);
        // this._view = new View(this._makeViewConfig(), this);
        console.log('value', value, 'name', name, 'perValues', perValues);
        this._trigger('value');
    }
    private _makeViewConfig() {
        const config = {...this._model.getConfig()};
        return {
            root: this._root,
            min: config.min,
            max: config.max,
            value: config.value,
            name: this._model.getClosestName(),
            step: config.step,
            orientation: config.orientation,
            perValues: this._model.getPerValues(),
            active: config.active,
            actuals: config.actuals,
            withLabel: config.withLabel,
            label: config.label,
            scale: config.scale,
            list: this._model.getList(),
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

export { Presenter, IPresenter }