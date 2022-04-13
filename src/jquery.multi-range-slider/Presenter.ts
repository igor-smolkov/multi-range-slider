import {
  IModel, Model, ModelEvent, Changes as ModelChanges, ValuePac,
} from './Model/Model';
import { IViewRender } from './View/IView';
import { Changes as ViewChanges, View, ViewEvent } from './View/View';
import { MultiRangeSliderConfig, SliderEvent } from './MultiRangeSliderConfig';

interface IPresenter {
  update(options?: MultiRangeSliderConfig): void;
}

class Presenter implements IPresenter {
  private $root: JQuery<HTMLElement>;

  private model: IModel;

  private view: IViewRender;

  constructor(
    $root: JQuery<HTMLElement>,
    options?: MultiRangeSliderConfig,
  ) {
    this.$root = $root;

    this.model = new Model();
    this.view = new View($root[0]);

    this.listenModel();
    this.listenView();

    this.model.init({ ...options });
  }

  // делегирование работы модели
  public update(options?: MultiRangeSliderConfig): void {
    const config: MultiRangeSliderConfig = { ...options };
    this.model.update(config);
  }

  private setValue(valuePac: ValuePac): void {
    this.model.setValue(valuePac);
  }

  private stepForward(): void {
    this.model.stepForward();
  }

  private stepBackward(): void {
    this.model.stepBackward();
  }

  // презентация
  private present(changes: ModelChanges): void {
    const { config } = changes;
    this.returnConfig(config);
    this.view.render({ ...config, ...changes });
  }

  // работа с клиентом
  private returnConfig(config: MultiRangeSliderConfig) {
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
    this.view.on(ViewEvent.forward, this.stepForward.bind(this));
    this.view.on(ViewEvent.backward, this.stepBackward.bind(this));
    this.view.on(ViewEvent.select, this.handleViewSelect.bind(this));
  }

  private handleViewSelect(changes?: ViewChanges) {
    const { id, value, perValue } = { ...changes };
    this.setValue({ activeRange: id, value, perValue });
  }
}

export { Presenter, IPresenter };
