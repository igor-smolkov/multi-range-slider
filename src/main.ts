import $ from 'jquery';

import './style.scss';

import EventIndicators from './components/event-indicators/event-indicators';
import OutputScreen from './components/output-screen/output-screen';
import InputScreen from './components/input-screen/input-screen';
import DemoSettings from './components/demo-settings/demo-settings';
import { Toggler } from './components/toggler/toggler';
import ConfigPanel from './components/config-panel/config-panel';

import myJQuerySliderFactory from './jquery.my-jquery-slider/jquery.my-jquery-slider';

class Main {
  private _$page: JQuery<HTMLElement>;

  private _$slider: JQuery<HTMLElement>;

  private _configPanel: ConfigPanel;

  private _toggler: Toggler;

  private _demoSettings: DemoSettings;

  private _inputScreen: InputScreen;

  private _outputScreen: OutputScreen;

  private _eventIndicators: EventIndicators;

  constructor() {
    this._$page = $('.js-page');
    this._$slider = $('.js-slider');
    this._configPanel = new ConfigPanel();
    this._toggler = new Toggler();
    this._demoSettings = new DemoSettings();
    this._inputScreen = new InputScreen();
    this._outputScreen = new OutputScreen();
    this._eventIndicators = new EventIndicators();
    this._listen();
  }

  public render() {
    if (this._demoSettings.checkDemoMode() === 'init') {
      this._$slider = this._reCreateSlider(this._$slider);
      this._inputScreen.setTitle('Инициализация');
    } else {
      this._inputScreen.setTitle('Обновление');
    }
    if (this._demoSettings.checkOptions()) {
      this._toggler.enable();
      this._configPanel.enable();
      const options = this._configPanel.getOptions(this._toggler);
      this._inputScreen.showOptions(options);
      this._$slider.myJQuerySlider(options);
    } else {
      this._toggler.disable();
      this._configPanel.disable();
      this._inputScreen.showDefaults();
      this._$slider.myJQuerySlider();
    }
  }

  private _reCreateSlider($oldSlider: JQuery<HTMLElement>): JQuery<HTMLElement> {
    $oldSlider.remove();
    const $newSlider = $('<div class=".js-slider"></div>');
    $('.js-page__slider').append($newSlider);
    this._bindSliderListeners($newSlider);
    return $newSlider;
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

  private _handleSliderChange() {
    this._outputScreen.show(this._$slider.data());
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
    this._demoSettings.onOptions(this.render.bind(this));
    this._demoSettings.onDemoMode(this.render.bind(this));
    this._configPanel.subscribe(this.render.bind(this));
    this._bindSliderListeners(this._$slider);
  }
}

function start() {
  myJQuerySliderFactory($);
  const demoPage = new Main();
  demoPage.render();
}

window.addEventListener('load', start);
