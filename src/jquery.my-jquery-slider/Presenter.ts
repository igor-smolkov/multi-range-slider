import $ from 'jquery';
import { IModel, Model } from './Model/Model';
import TMyJQuerySlider from './TMyJQuerySlider';
import { TViewConfig, View, IViewRender } from './View/View';

interface IPresenter {
  update(options?: TMyJQuerySlider): void;
  setActive(active: number): void;
  setActiveCloseOfValue(value: number): void;
  setValue(value: number): void;
  setPerValue(perValue: number): void;
}

class Presenter implements IPresenter {
  public static eventsPrefix = 'my-jquery-slider';

  private _$root: JQuery<HTMLElement>;

  private _model: IModel;

  private _view: IViewRender;

  constructor(rootElem: HTMLElement, options: TMyJQuerySlider = {}) {
    this._initExternals(rootElem);
    this._initModel({ ...options });
    this._present();
  }

  // делегирование работы модели
  public update(options: TMyJQuerySlider = {}): void {
    const config: TMyJQuerySlider = { ...options };
    this._model.update(config);
  }

  public setActive(active: number): void {
    this._model.setActive(active);
  }

  public setActiveCloseOfValue(value: number): void {
    this._model.setActiveCloseOfValue(value);
  }

  public setValue(value: number): void {
    this._model.setValue(value);
  }

  public setPerValue(perValue: number): void {
    this._model.setPerValue(perValue);
  }

  // презентация
  private _present(): void {
    const config: TMyJQuerySlider = this._model.getConfig();
    this._returnConfig(config);
    if (!this._view) {
      this._initView(this._$root[0]);
      this._notifyAbout('init');
    } else {
      this._notifyAbout('update');
    }
    this._view.render(this._prepareViewConfigFrom(config));
  }

  // работа с клиентом
  private _initExternals(rootElem: HTMLElement) {
    this._$root = $(rootElem);
  }

  private _returnConfig(config: TMyJQuerySlider) {
    this._$root.data(config);
  }

  private _notifyAbout(event :string) {
    this._$root.trigger(`${Presenter.eventsPrefix}-${event}`);
  }

  // инициализация модели
  private _initModel(options: TMyJQuerySlider) {
    this._model = new Model(options);
    this._model.subscribe(this._present.bind(this));
  }

  // подготовка отображения
  private _initView(root: HTMLElement) {
    this._view = new View(this, root);
  }

  private _prepareViewConfigFrom(config: TMyJQuerySlider): TViewConfig {
    return {
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
      segments: config.segments,
      withNotch: config.withNotch,
      list: this._model.getList(),
      lengthPx: config.lengthPx,
      withIndent: config.withIndent,
    };
  }
}

export { Presenter, IPresenter };
