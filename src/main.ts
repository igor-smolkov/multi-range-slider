import $ from 'jquery';

// import './assets/*.scss';
import EventIndicators from './components/event-indicators/event-indicators';
import OutputScreen from './components/output-screen/output-screen';
import InputScreen from './components/input-screen/input-screen';
import DemoSettings from './components/demo-settings/demo-settings';
import { Toggler } from './components/toggler/toggler';
import ConfigPanel from './components/config-panel/config-panel';
import myJQuerySliderFactory from './jquery.my-jquery-slider/jquery.my-jquery-slider';
import TMyJQuerySlider from './jquery.my-jquery-slider/TMyJQuerySlider';
import './style.scss';
// import './components/**/*.scss';

class Main {
  private _demoOptions: TMyJQuerySlider[] = [
    null,
    {
      list: ['до', 'ре', 'ми', 'фа', 'соль', 'ля', 'си'], scale: 'named', withLabel: true, label: 'name',
    },
    { isDouble: true, scale: 'numeric' },
    { limits: [10, 20, 30, 40, 50, 60, 70, 80], withLabel: true },
  ];

  private _$page: JQuery<HTMLElement>;

  private _$sliders: JQuery<HTMLElement>;

  private _curSliderIndex: number;

  private _isSliderFeedback: boolean;

  private _configPanel: ConfigPanel;

  private _toggler: Toggler;

  private _demoSettings: DemoSettings;

  private _inputScreen: InputScreen;

  private _outputScreen: OutputScreen;

  private _eventIndicators: EventIndicators;

  constructor() {
    this._init();
    this._configure();
    this._listen();
  }

  public render() {
    this._setCurSliderIndex(this._demoSettings.checkCurrent());
    if (this._demoSettings.checkDemoMode() === 'init') {
      this._reCreateSlider(this._curSliderIndex);
      this._inputScreen.setTitle('Инициализация');
    } else {
      this._inputScreen.setTitle('Обновление');
    }
    if (this._demoSettings.checkOptions()) {
      this._toggler.enable();
      this._configPanel.enable();
      this._demoOptions[this._curSliderIndex] = this._configPanel.getOptions(this._toggler);
      this._inputScreen.showOptions(this._demoOptions[this._curSliderIndex]);
      this._demoOptions.forEach(
        (options, index) => $(this._$sliders[index]).myJQuerySlider(options),
      );
    } else {
      this._toggler.disable();
      this._configPanel.disable();
      this._inputScreen.showDefaults();
      this._demoOptions.forEach((options, index) => {
        if (options) $(this._$sliders[index]).myJQuerySlider(options);
        else $(this._$sliders[index]).myJQuerySlider();
      });
    }
  }

  private _init() {
    this._$page = $('.js-page');
    this._configPanel = new ConfigPanel();
    this._toggler = new Toggler();
    this._demoSettings = new DemoSettings();
    this._inputScreen = new InputScreen();
    this._outputScreen = new OutputScreen();
    this._eventIndicators = new EventIndicators();
  }

  private _configure() {
    this._isSliderFeedback = false;
    this._curSliderIndex = 0;
    this._$sliders = $('.js-slider');
    $(this._$sliders[0]).myJQuerySlider();
    $(this._$sliders[1]).myJQuerySlider(this._demoOptions[1]);
    $(this._$sliders[2]).myJQuerySlider(this._demoOptions[2]);
    $(this._$sliders[3]).myJQuerySlider(this._demoOptions[3]);
  }

  private _reCreateSlider(index: number) {
    $(this._$sliders[index]).remove();
    const $newSlider = $('<div class="js-slider"></div>');
    $($('.js-slider-container')[index]).append($newSlider);
    this._bindSliderListeners($newSlider);
    this._$sliders[index] = $newSlider.get().shift();
  }

  private _setCurSliderIndex(index: number) {
    const sliderContainers = $('.js-slider-container');
    $(sliderContainers[this._curSliderIndex]).removeClass('page__slider_selected');
    this._curSliderIndex = index;
    if (!this._demoSettings.checkMoreSliders()) return;
    $(sliderContainers[this._curSliderIndex]).addClass('page__slider_selected');
  }

  private _handleToggler(event: string, name: string) {
    if (event === 'enable') this._configPanel.show(name);
    else if (event === 'disable') this._configPanel.hide(name);
    this.render();
  }

  private _handleDemoOrientation() {
    if (this._demoSettings.checkDemoOrientation() === 'col') this._$page.addClass('page_vertical');
    else this._$page.removeClass('page_vertical');
    this.render();
  }

  private _handleMoreSliders() {
    const isMoreSliders = this._demoSettings.checkMoreSliders();
    if (!isMoreSliders) this._setCurSliderIndex(0);
    $('.js-slider-container').each((i, el) => {
      if (i === 0) return;
      if (!isMoreSliders) $(el).addClass('page__slider_none');
      else $(el).removeClass('page__slider_none');
    });
    this.render();
  }

  private _handleConfigPanelChange() {
    if (this._isSliderFeedback) return;
    this.render();
  }

  private _handleSliderChange() {
    this._outputScreen.show($(this._$sliders[this._curSliderIndex]).data());
    if (!this._demoSettings.checkDoubleSync()) return;
    this._isSliderFeedback = true;
    this._configPanel.feedbackFill($(this._$sliders[this._curSliderIndex]).data());
    this._isSliderFeedback = false;
  }

  private _handleSliderInit() {
    this._eventIndicators.blinkInit();
    this._handleSliderChange();
  }

  private _handleSliderUpdate() {
    this._eventIndicators.blinkUpdate();
    this._handleSliderChange();
  }

  private _bindSliderListeners($bindableSlider: JQuery<HTMLElement>) {
    $bindableSlider.on('my-jquery-slider-init', this._handleSliderInit.bind(this));
    $bindableSlider.on('my-jquery-slider-update', this._handleSliderUpdate.bind(this));
  }

  private _listen() {
    this._toggler.subscribe(this._handleToggler.bind(this));
    this._demoSettings.onDemoOrientation(this._handleDemoOrientation.bind(this));
    this._demoSettings.onMoreSliders(this._handleMoreSliders.bind(this));
    this._demoSettings.onOptions(this.render.bind(this));
    this._demoSettings.onDemoMode(this.render.bind(this));
    this._demoSettings.onCurrent(this.render.bind(this));
    this._configPanel.subscribe(this._handleConfigPanelChange.bind(this));
    this._bindSliderListeners($(this._$sliders[0]));
    this._bindSliderListeners($(this._$sliders[1]));
    this._bindSliderListeners($(this._$sliders[2]));
    this._bindSliderListeners($(this._$sliders[3]));
  }
}

function start() {
  myJQuerySliderFactory($);
  const demoPage = new Main();
  demoPage.render();
}

window.addEventListener('load', start);
