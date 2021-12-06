import $ from 'jquery';

import EventIndicators from '../../components/event-indicators/EventIndicators';
import OutputScreen from '../../components/output-screen/OutputScreen';
import InputScreen from '../../components/input-screen/InputScreen';
import DemoSettings from '../../components/demo-settings/DemoSettings';
import { Toggler } from '../../components/toggler/Toggler';
import ConfigPanel from '../../components/config-panel/ConfigPanel';
import TMyJQuerySlider from '../../jquery.my-jquery-slider/TMyJQuerySlider';
import mainDemoClassNames from './utils/mainDemoClassNames';
import './main-demo.scss';

class MainDemo {
  private demoOptions: Array<TMyJQuerySlider | null> = [
    null,
    {
      list: ['до', 'ре', 'ми', 'фа', 'соль', 'ля', 'си'],
      scale: 'named',
      withLabel: true,
      label: 'name',
    },
    { isDouble: true, scale: 'numeric' },
    { limits: [10, 20, 30, 40, 50, 60, 70, 80], withLabel: true },
  ];

  private $page: JQuery<HTMLElement> = $('.js-main-demo');

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
    if (this.demoSettings.checkDemoMode() === 'init') {
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
        $(this.$sliders[index]).myJQuerySlider(options)
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

  private renderDefaults(options: TMyJQuerySlider | null, index: number) {
    if (options) {
      const isNeedToShowOptions = this.curSliderIndex === index
        && this.demoSettings.checkDemoMode() === 'init';
      if (isNeedToShowOptions) this.inputScreen.showOptions(options);
      $(this.$sliders[index]).myJQuerySlider(options);
    } else $(this.$sliders[index]).myJQuerySlider();
  }

  private configure() {
    $(this.$sliders[0]).myJQuerySlider();
    $(this.$sliders[1]).myJQuerySlider(this.demoOptions[1]);
    $(this.$sliders[2]).myJQuerySlider(this.demoOptions[2]);
    $(this.$sliders[3]).myJQuerySlider(this.demoOptions[3]);
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
      mainDemoClassNames.sliderSelected,
    );
    this.curSliderIndex = index;
    if (!this.demoSettings.checkMoreSliders()) return;
    $(sliderContainers[this.curSliderIndex]).addClass(
      mainDemoClassNames.sliderSelected,
    );
  }

  private handleToggler(event: string, name: string) {
    if (event === 'enable') this.configPanel.show(name);
    else if (event === 'disable') this.configPanel.hide(name);
    this.render();
  }

  private handleDemoOrientation() {
    if (this.demoSettings.checkDemoOrientation() === 'col') {
      this.$page.addClass(mainDemoClassNames.vertical);
      this.$optionsPanel.addClass(
        mainDemoClassNames.optionsPanelVertical,
      );
    } else {
      this.$page.removeClass(mainDemoClassNames.vertical);
      this.$optionsPanel.removeClass(
        mainDemoClassNames.optionsPanelVertical,
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
        $(el).addClass(mainDemoClassNames.sliderNone);
      } else $(el).removeClass(mainDemoClassNames.sliderNone);
    });
    this.render();
  }

  private handleInputPanel() {
    this.$optionsPanel
      .find('.js-options-panel-item')[2]
      .classList.toggle(mainDemoClassNames.optionsPanelItemNone);
    this.inputScreen.hideToggle();
  }

  private handleOutputPanel() {
    this.$optionsPanel
      .find('.js-options-panel-item')[3]
      .classList.toggle(mainDemoClassNames.optionsPanelItemNone);
    this.outputScreen.hideToggle();
  }

  private handleEventPanel() {
    this.$optionsPanel
      .find('.js-options-panel-item')[4]
      .classList.toggle(mainDemoClassNames.optionsPanelItemNone);
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
      'my-jquery-slider-init',
      this.handleSliderInit.bind(this),
    );
    $bindableSlider.on(
      'my-jquery-slider-update',
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

export default MainDemo;
