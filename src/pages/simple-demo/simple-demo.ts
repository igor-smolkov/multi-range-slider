import $ from 'jquery';
import 'normalize.css';

import SimpleConfigPanel from '../../components/simple-config-panel/simple-config-panel';
import myJQuerySliderFactory from '../../jquery.my-jquery-slider/jquery.my-jquery-slider';
import TMyJQuerySlider from '../../jquery.my-jquery-slider/TMyJQuerySlider';
import './simple-demo.scss';

const parameters: TMyJQuerySlider[] = [
  {
    max: 50, value: 30, scale: 'numeric', withNotch: false,
  },
  {
    max: 50, value: 30, withLabel: true, scale: 'numeric', withNotch: false,
  },
  {
    min: -50, max: 50, value: 0, withLabel: true, scale: 'numeric', withNotch: false,
  },
  {
    max: 50, minInterval: 20, maxInterval: 30, withLabel: true, scale: 'numeric', withNotch: false,
  },
];

class SimpleDemo {
  private _simpleConfigPanel: SimpleConfigPanel;

  private _$slider: JQuery<HTMLElement>;

  private _isSliderFeedback: boolean;

  constructor(item: HTMLElement, config: TMyJQuerySlider) {
    this._init(item);
    this._bindEventListeners();
    this.render(config);
  }

  public render(config: TMyJQuerySlider) {
    this._$slider.myJQuerySlider(config);
  }

  private _init(item: HTMLElement) {
    this._$slider = $(item).find('.js-slider');
    this._simpleConfigPanel = new SimpleConfigPanel($(item).find('.js-simple-config-panel'));
  }

  private _bindEventListeners() {
    this._simpleConfigPanel.subscribe(this._handlePanelChange.bind(this));
    this._$slider.on('my-jquery-slider-init', this._handleSliderChange.bind(this));
    this._$slider.on('my-jquery-slider-update', this._handleSliderChange.bind(this));
  }

  private _handlePanelChange() {
    if (this._isSliderFeedback) return;
    const options = this._simpleConfigPanel.getOptions();
    this.render(options);
  }

  private _handleSliderChange() {
    this._isSliderFeedback = true;
    this._simpleConfigPanel.feedbackFill($(this._$slider).data());
    this._isSliderFeedback = false;
  }
}

function start() {
  myJQuerySliderFactory($);

  const simpleDemos = [];
  $('.js-item').each((index, item) => {
    simpleDemos.push(new SimpleDemo(item, parameters[index]));
  });
}

window.addEventListener('load', start);
