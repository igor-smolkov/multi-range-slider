import {
  IModel, Model, ModelEvent, Changes as ModelChanges,
} from './Model/Model';
import { IViewRender } from './View/IView';
import {
  Changes as ViewChanges, TViewConfig, View, ViewEvent,
} from './View/View';
import {
  TMyJQuerySlider, SliderEvent, SliderOrientation, SliderLabel, SliderScale,
} from './TMyJQuerySlider';

interface IPresenter {
  update(options?: TMyJQuerySlider): void;
}

class Presenter implements IPresenter {
  private $root: JQuery<HTMLElement>;

  private model: IModel;

  private view: IViewRender;

  constructor(
    $root: JQuery<HTMLElement>,
    options: TMyJQuerySlider = {},
  ) {
    this.$root = $root;

    this.model = new Model();
    this.view = new View($root[0]);

    this.listenModel();
    this.listenView();

    this.model.init({ ...options });
  }

  // делегирование работы модели
  public update(options: TMyJQuerySlider = {}): void {
    const config: TMyJQuerySlider = { ...options };
    this.model.update(config);
  }

  private setValue(changes?: ViewChanges): void {
    const { id, value, perValue } = { ...changes };
    if (id !== undefined) this.model.setActiveRange(id);
    else if (value !== undefined) this.model.setActiveRangeCloseOfValue(value);
    if (value !== undefined) this.model.setValue(value);
    if (perValue !== undefined) this.model.setPerValue(perValue);
  }

  private stepForward(): void {
    this.model.stepForward();
  }

  private stepBackward(): void {
    this.model.stepBackward();
  }

  // презентация
  private present(changes: ModelChanges): void {
    this.returnConfig(changes.config);
    this.view.render(Presenter.prepareViewConfigFrom(changes));
  }

  // работа с клиентом
  private returnConfig(config: TMyJQuerySlider) {
    this.$root.data(config);
  }

  private notifyAbout(event: string) {
    this.$root.trigger(event);
  }

  private listenModel() {
    this.model.on(ModelEvent.init, this.handleModelInit.bind(this));
    this.model.on(ModelEvent.update, this.handleModelUpdate.bind(this));
  }

  private handleModelInit(changes?: ModelChanges) {
    if (changes === undefined) return;
    this.present(changes);
    this.notifyAbout(SliderEvent.init);
  }

  private handleModelUpdate(changes?: ModelChanges) {
    if (changes === undefined) return;
    this.present(changes);
    this.notifyAbout(SliderEvent.update);
  }

  private listenView() {
    this.view.on(ViewEvent.change, this.update.bind(this));
    this.view.on(ViewEvent.select, this.setValue.bind(this));
    this.view.on(ViewEvent.forward, this.stepForward.bind(this));
    this.view.on(ViewEvent.backward, this.stepBackward.bind(this));
  }

  private static prepareViewConfigFrom(
    {
      config, values, names, perValues, labelsList,
    }: ModelChanges,
  ): TViewConfig {
    return {
      values,
      names,
      perValues,
      labelsList,
      min: config.min as number,
      max: config.max as number,
      step: config.step as number,
      orientation: config.orientation as SliderOrientation,
      activeRange: config.activeRange as number,
      actualRanges: config.actualRanges as number[],
      withLabel: config.withLabel as boolean,
      label: config.label as SliderLabel,
      scale: config.scale as SliderScale | null,
      scaleSegments: config.scaleSegments as number,
      withNotch: config.withNotch as boolean,
      lengthPx: config.lengthPx as number,
      withIndent: config.withIndent as boolean,
    };
  }
}

export { Presenter, IPresenter };
