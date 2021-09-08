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

  private _$sliders: JQuery<HTMLElement>;

  private _curSliderIndex: number;

  private _configPanel: ConfigPanel;

  private _toggler: Toggler;

  private _demoSettings: DemoSettings;

  private _inputScreen: InputScreen;

  private _outputScreen: OutputScreen;

  private _eventIndicators: EventIndicators;

  constructor() {
    this._$page = $('.js-page');
    this._configPanel = new ConfigPanel();
    this._toggler = new Toggler();
    this._demoSettings = new DemoSettings();
    this._inputScreen = new InputScreen();
    this._outputScreen = new OutputScreen();
    this._eventIndicators = new EventIndicators();
    this._init();
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
      const options = this._configPanel.getOptions(this._toggler);
      this._inputScreen.showOptions(options);
      $(this._$sliders[this._curSliderIndex]).myJQuerySlider(options);
    } else {
      this._toggler.disable();
      this._configPanel.disable();
      this._inputScreen.showDefaults();
      $(this._$sliders[this._curSliderIndex]).myJQuerySlider();
    }
  }

  private _reCreateSlider(index: number) {
    $(this._$sliders[index]).remove();
    const $newSlider = $('<div class="js-slider"></div>');
    $($('.js-slider-container')[index]).append($newSlider);
    this._bindSliderListeners($newSlider);
    this._$sliders[index] = $newSlider.get().shift();
  }

  private _init() {
    this._curSliderIndex = 0;
    this._$sliders = $('.js-slider');
    $(this._$sliders[0]).myJQuerySlider();
    $(this._$sliders[1]).myJQuerySlider({
      list: ['до', 'ре', 'ми', 'фа', 'соль', 'ля', 'си'], scale: 'named', withLabel: true, label: 'name',
    });
    $(this._$sliders[2]).myJQuerySlider({ isDouble: true, scale: 'numeric' });
    $(this._$sliders[3]).myJQuerySlider({
      limits: [10, 20, 30, 40, 50, 60, 70, 80], withLabel: true,
    });
  }

  private _setCurSliderIndex(index: number) {
    const sliderContainers = $('.js-slider-container');
    $(sliderContainers[this._curSliderIndex]).removeClass('page__slider_selected');
    this._curSliderIndex = index;
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
  }

  private _handleSliderChange() {
    this._outputScreen.show($(this._$sliders[this._curSliderIndex]).data());
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
    this._configPanel.subscribe(this.render.bind(this));
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
