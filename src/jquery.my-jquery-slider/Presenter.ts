import { IModel, Model } from './Model/Model';
import { IViewRender } from './View/IView';
import { TViewConfig, View } from './View/View';
import TMyJQuerySlider from './TMyJQuerySlider';

interface IPresenter {
  update(options?: TMyJQuerySlider): void;
}

class Presenter implements IPresenter {
  public static eventsPrefix = 'my-jquery-slider';

  private _$root: JQuery<HTMLElement>;

  private _model: IModel;

  private _view: IViewRender;

  constructor(
    $root: JQuery<HTMLElement>,
    options: TMyJQuerySlider = {},
  ) {
    this._$root = $root;

    this._model = new Model({ ...options });
    this._listenModel();

    this._view = new View($root[0]);
    this._listenView();

    this._present(true);
  }

  // делегирование работы модели
  public update(options: TMyJQuerySlider = {}): void {
    const config: TMyJQuerySlider = { ...options };
    this._model.update(config);
  }

  private _setActive(active?: number): void {
    this._model.setActive(active as number);
  }

  private _setActiveCloseOfValue(value?: number): void {
    this._model.setActiveCloseOfValue(value as number);
  }

  private _setValue(value?: number): void {
    this._model.setValue(value as number);
  }

  private _setPerValue(perValue?: number): void {
    this._model.setPerValue(perValue as number);
  }

  private _stepForward(): void {
    this._model.stepForward();
  }

  private _stepBackward(): void {
    this._model.stepBackward();
  }

  // презентация
  private _present(isInit = false): void {
    const config: TMyJQuerySlider = this._model.getConfig();
    this._returnConfig(config);
    if (isInit) this._notifyAbout('init');
    else this._notifyAbout('update');
    this._view.render(this._prepareViewConfigFrom(config));
  }

  // работа с клиентом
  private _returnConfig(config: TMyJQuerySlider) {
    this._$root.data(config);
  }

  private _notifyAbout(event: string) {
    this._$root.trigger(`${Presenter.eventsPrefix}-${event}`);
  }

  private _listenModel() {
    this._model.on('change', this._present.bind(this));
  }

  private _listenView() {
    this._view.on('change', this.update.bind(this));
    this._view.on('change-active', this._setActive.bind(this));
    this._view.on(
      'change-active-close',
      this._setActiveCloseOfValue.bind(this),
    );
    this._view.on('change-value', this._setValue.bind(this));
    this._view.on('change-per-value', this._setPerValue.bind(this));
    this._view.on('forward', this._stepForward.bind(this));
    this._view.on('backward', this._stepBackward.bind(this));
  }

  private _prepareViewConfigFrom(
    config: TMyJQuerySlider,
  ): TViewConfig {
    return {
      min: config.min as number,
      max: config.max as number,
      values: this._model.getValues(),
      names: this._model.getNames(),
      step: config.step as number,
      orientation: config.orientation as 'vertical' | 'horizontal',
      perValues: this._model.getPerValues(),
      active: config.active as number,
      actualRanges: config.actualRanges as number[],
      withLabel: config.withLabel as boolean,
      label: config.label as 'number' | 'name',
      scale: config.scale as 'basic' | 'numeric' | 'named' | 'mixed' | null,
      segments: config.segments as number,
      withNotch: config.withNotch as boolean,
      list: this._model.getList(),
      lengthPx: config.lengthPx as number,
      withIndent: config.withIndent as boolean,
    };
  }
}

export { Presenter, IPresenter };
