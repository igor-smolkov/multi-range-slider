import $ from 'jquery';

import EventIndicators from '../../components/event-indicators/EventIndicators';
import OutputScreen from '../../components/output-screen/OutputScreen';
import InputScreen from '../../components/input-screen/InputScreen';
import { DemoMode, DemoOrientation, DemoSettings } from '../../components/demo-settings/DemoSettings';
import { Toggler, TogglerEvent } from '../../components/toggler/Toggler';
import ConfigPanel from '../../components/config-panel/ConfigPanel';
import {
  MultiRangeSliderConfig, SliderScale, SliderLabel, SliderEvent,
} from '../../jquery.multi-range-slider/MultiRangeSliderConfig';
import extendedDemoClassNames from './utils/extendedDemoClassNames';
import './extended-demo.scss';

class ExtendedDemo {
  private demoOptions: Array<MultiRangeSliderConfig | null> = [
    null,
    {
      labelsList: ['до', 'ре', 'ми', 'фа', 'соль', 'ля', 'си'],
      scale: SliderScale.named,
      withLabel: true,
      label: SliderLabel.name,
    },
    { isDouble: true, scale: SliderScale.numeric },
    { limits: [10, 20, 30, 40, 50, 60, 70, 80], withLabel: true },
  ];

  private $page: JQuery<HTMLElement> = $('.js-extended-demo');

  private $optionsPanel: JQuery<HTMLElement> = $('.js-options-panel');

  private $sliders: JQuery<HTMLElement> = $('.js-slider');

  private curSliderIndex = 0;

  private isSliderFeedback = false;

  private configPanel: ConfigPanel = new ConfigPanel();

  private toggler: Toggler = new Toggler();

  private demoSettings: DemoSettings = new DemoSettings();

  private inputScreen: InputScreen = new InputScreen();

  private outputScreen: OutputScreen = new OutputScreen();

  private eventIndicators: EventIndicators = new EventIndicators();

  constructor() {
    this.configure();
    this.listen();
  }

  public render(): void {
    this.setCurSliderIndex(this.demoSettings.checkCurrent());
    if (this.demoSettings.checkDemoMode() === DemoMode.init) {
      this.reCreateSlider(this.curSliderIndex);
      this.inputScreen.setTitle('Инициализация');
    } else {
      this.inputScreen.setTitle('Обновление');
    }
    if (this.demoSettings.checkOptions()) {
      this.toggler.enable();
      this.configPanel.enable();
      const panelOptions = this.configPanel.getOptions(this.toggler);
      this.demoOptions[this.curSliderIndex] = panelOptions;
      this.inputScreen.showOptions(
        this.demoOptions[this.curSliderIndex],
      );
      this.demoOptions.forEach((options, index) => (
        $(this.$sliders[index]).multiRangeSlider(options)
      ));
    } else {
      this.toggler.disable();
      this.configPanel.disable();
      this.inputScreen.showDefaults();
      this.demoOptions.forEach((options, index) => (
        this.renderDefaults(options, index)
      ));
    }
  }

  private renderDefaults(options: MultiRangeSliderConfig | null, index: number) {
    if (options) {
      const isNeedToShowOptions = this.curSliderIndex === index
        && this.demoSettings.checkDemoMode() === DemoMode.init;
      if (isNeedToShowOptions) this.inputScreen.showOptions(options);
      $(this.$sliders[index]).multiRangeSlider(options);
    } else $(this.$sliders[index]).multiRangeSlider();
  }

  private configure() {
    $(this.$sliders[0]).multiRangeSlider();
    $(this.$sliders[1]).multiRangeSlider(this.demoOptions[1]);
    $(this.$sliders[2]).multiRangeSlider(this.demoOptions[2]);
    $(this.$sliders[3]).multiRangeSlider(this.demoOptions[3]);
  }

  private reCreateSlider(index: number) {
    $(this.$sliders[index]).remove();
    const $newSlider = $('<div class="js-slider"></div>');
    $($('.js-slider-container')[index]).append($newSlider);
    this.bindSliderListeners($newSlider);
    this.$sliders[index] = $newSlider.get().shift() as HTMLElement;
  }

  private setCurSliderIndex(index: number) {
    const sliderContainers = $('.js-slider-container');
    $(sliderContainers[this.curSliderIndex]).removeClass(
      extendedDemoClassNames.sliderSelected,
    );
    this.curSliderIndex = index;
    if (!this.demoSettings.checkMoreSliders()) return;
    $(sliderContainers[this.curSliderIndex]).addClass(
      extendedDemoClassNames.sliderSelected,
    );
  }

  private handleToggler(event: TogglerEvent, name: string) {
    if (event === TogglerEvent.enable) this.configPanel.show(name);
    else if (event === TogglerEvent.disable) this.configPanel.hide(name);
    this.render();
  }

  private handleDemoOrientation() {
    if (this.demoSettings.checkDemoOrientation() === DemoOrientation.col) {
      this.$page.addClass(extendedDemoClassNames.vertical);
      this.$optionsPanel.addClass(
        extendedDemoClassNames.optionsPanelVertical,
      );
    } else {
      this.$page.removeClass(extendedDemoClassNames.vertical);
      this.$optionsPanel.removeClass(
        extendedDemoClassNames.optionsPanelVertical,
      );
    }
    this.render();
  }

  private handleMoreSliders() {
    const isMoreSliders = this.demoSettings.checkMoreSliders();
    if (!isMoreSliders) this.setCurSliderIndex(0);
    $('.js-slider-container').each((i, el) => {
      if (i === 0) return;
      if (!isMoreSliders) {
        $(el).addClass(extendedDemoClassNames.sliderNone);
      } else $(el).removeClass(extendedDemoClassNames.sliderNone);
    });
    this.render();
  }

  private handleInputPanel() {
    this.$optionsPanel
      .find('.js-options-panel-item')[2]
      .classList.toggle(extendedDemoClassNames.optionsPanelItemNone);
    this.inputScreen.hideToggle();
  }

  private handleOutputPanel() {
    this.$optionsPanel
      .find('.js-options-panel-item')[3]
      .classList.toggle(extendedDemoClassNames.optionsPanelItemNone);
    this.outputScreen.hideToggle();
  }

  private handleEventPanel() {
    this.$optionsPanel
      .find('.js-options-panel-item')[4]
      .classList.toggle(extendedDemoClassNames.optionsPanelItemNone);
    this.eventIndicators.hideToggle();
  }

  private handleConfigPanelChange() {
    if (this.isSliderFeedback) return;
    this.render();
  }

  private handleSliderChange() {
    this.outputScreen.show(
      $(this.$sliders[this.curSliderIndex]).data(),
    );
    if (!this.demoSettings.checkDoubleSync()) return;
    this.isSliderFeedback = true;
    this.configPanel.feedbackFill(
      $(this.$sliders[this.curSliderIndex]).data(),
    );
    this.isSliderFeedback = false;
  }

  private handleSliderInit() {
    this.eventIndicators.blinkInit();
    this.handleSliderChange();
  }

  private handleSliderUpdate() {
    this.eventIndicators.blinkUpdate();
    this.handleSliderChange();
  }

  private bindSliderListeners($bindableSlider: JQuery<HTMLElement>) {
    $bindableSlider.on(
      SliderEvent.init,
      this.handleSliderInit.bind(this),
    );
    $bindableSlider.on(
      SliderEvent.update,
      this.handleSliderUpdate.bind(this),
    );
  }

  private listen() {
    this.toggler.subscribe(this.handleToggler.bind(this));
    this.demoSettings.onDemoOrientation(
      this.handleDemoOrientation.bind(this),
    );
    this.demoSettings.onMoreSliders(
      this.handleMoreSliders.bind(this),
    );
    this.demoSettings.onInputPanel(
      this.handleInputPanel.bind(this),
    );
    this.demoSettings.onOutputPanel(
      this.handleOutputPanel.bind(this),
    );
    this.demoSettings.onEventPanel(
      this.handleEventPanel.bind(this),
    );
    this.demoSettings.onOptions(this.render.bind(this));
    this.demoSettings.onDemoMode(this.render.bind(this));
    this.demoSettings.onCurrent(this.render.bind(this));
    this.configPanel.subscribe(
      this.handleConfigPanelChange.bind(this),
    );
    this.bindSliderListeners($(this.$sliders[0]));
    this.bindSliderListeners($(this.$sliders[1]));
    this.bindSliderListeners($(this.$sliders[2]));
    this.bindSliderListeners($(this.$sliders[3]));
  }
}

export default ExtendedDemo;
