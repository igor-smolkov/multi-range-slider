import { IModel, Model } from './Model/Model';
import { IViewRender } from './View/IView';
import { TViewConfig, View } from './View/View';
import TMyJQuerySlider from './TMyJQuerySlider';

interface IPresenter {
  update(options?: TMyJQuerySlider): void;
}

class Presenter implements IPresenter {
  public static eventsPrefix = 'my-jquery-slider';

  private $root: JQuery<HTMLElement>;

  private model: IModel;

  private view: IViewRender;

  constructor(
    $root: JQuery<HTMLElement>,
    options: TMyJQuerySlider = {},
  ) {
    this.$root = $root;

    this.model = new Model({ ...options });
    this.listenModel();

    this.view = new View($root[0]);
    this.listenView();

    this.present(true);
  }

  // делегирование работы модели
  public update(options: TMyJQuerySlider = {}): void {
    const config: TMyJQuerySlider = { ...options };
    this.model.update(config);
  }

  private setActive(active?: number): void {
    this.model.setActive(active as number);
  }

  private setActiveCloseOfValue(value?: number): void {
    this.model.setActiveCloseOfValue(value as number);
  }

  private setValue(value?: number): void {
    this.model.setValue(value as number);
  }

  private setPerValue(perValue?: number): void {
    this.model.setPerValue(perValue as number);
  }

  private stepForward(): void {
    this.model.stepForward();
  }

  private stepBackward(): void {
    this.model.stepBackward();
  }

  // презентация
  private present(isInit = false): void {
    const config: TMyJQuerySlider = this.model.getConfig();
    this.returnConfig(config);
    if (isInit) this.notifyAbout('init');
    else this.notifyAbout('update');
    this.view.render(this.prepareViewConfigFrom(config));
  }

  // работа с клиентом
  private returnConfig(config: TMyJQuerySlider) {
    this.$root.data(config);
  }

  private notifyAbout(event: string) {
    this.$root.trigger(`${Presenter.eventsPrefix}-${event}`);
  }

  private listenModel() {
    this.model.on('change', this.present.bind(this));
  }

  private listenView() {
    this.view.on('change', this.update.bind(this));
    this.view.on('change-active', this.setActive.bind(this));
    this.view.on(
      'change-active-close',
      this.setActiveCloseOfValue.bind(this),
    );
    this.view.on('change-value', this.setValue.bind(this));
    this.view.on('change-per-value', this.setPerValue.bind(this));
    this.view.on('forward', this.stepForward.bind(this));
    this.view.on('backward', this.stepBackward.bind(this));
  }

  private prepareViewConfigFrom(
    config: TMyJQuerySlider,
  ): TViewConfig {
    return {
      min: config.min as number,
      max: config.max as number,
      values: this.model.getValues(),
      names: this.model.getNames(),
      step: config.step as number,
      orientation: config.orientation as 'vertical' | 'horizontal',
      perValues: this.model.getPerValues(),
      active: config.active as number,
      actualRanges: config.actualRanges as number[],
      withLabel: config.withLabel as boolean,
      label: config.label as 'number' | 'name',
      scale: config.scale as 'basic' | 'numeric' | 'named' | 'mixed' | null,
      segments: config.segments as number,
      withNotch: config.withNotch as boolean,
      list: this.model.getList(),
      lengthPx: config.lengthPx as number,
      withIndent: config.withIndent as boolean,
    };
  }
}

export { Presenter, IPresenter };
