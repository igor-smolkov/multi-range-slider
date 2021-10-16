import $ from 'jquery';

import ConfigPanel from '../../components/config-panel/config-panel';
import myJQuerySliderFactory from '../../jquery.my-jquery-slider/jquery.my-jquery-slider';
import TMyJQuerySlider from '../../jquery.my-jquery-slider/TMyJQuerySlider';
import './simple-demo.scss';

const parameters: TMyJQuerySlider[] = [
  { min: 10, max: 20, value: 18 },
  { scale: 'numeric' },
  { withLabel: true },
  { scale: 'basic' },
];

class SimpleDemo {
  private static _names = ['value', 'min', 'max', 'step', 'min-interval', 'max-interval', 'orientation', 'is-double', 'scale', 'actual-ranges', 'with-label'];

  private _configPanel: ConfigPanel;

  private _$slider: JQuery<HTMLElement>;

  private _isSliderFeedback: boolean;

  constructor(item: HTMLElement, config: TMyJQuerySlider) {
    this._$slider = $(item).find('.js-slider');
    this._configPanel = new ConfigPanel($(item).find('.js-config-panel'));
    this._configPanel.showByNames(SimpleDemo._names);
    this._configPanel.subscribe(this._handleConfigPanelChange.bind(this));
    this._$slider.myJQuerySlider(config);
    this._$slider.on('my-jquery-slider-update', this._handleSliderChange.bind(this));
    this._correctOptions();
  }

  public render() {
    this._$slider.myJQuerySlider(this._correctOptions());
  }

  private _correctOptions(): TMyJQuerySlider {
    const options = this._configPanel.getOptionsByNames(SimpleDemo._names);
    if (options.isDouble) {
      this._configPanel.hide('value');
      this._configPanel.show('min-interval');
      this._configPanel.show('max-interval');
      delete options.value;
    } else {
      this._configPanel.show('value');
      this._configPanel.hide('min-interval');
      this._configPanel.hide('max-interval');
      delete options.minInterval;
      delete options.maxInterval;
    }
    delete options.isDouble;
    return options;
  }

  private _handleConfigPanelChange() {
    if (this._isSliderFeedback) return;
    this.render();
  }

  private _handleSliderChange() {
    this._isSliderFeedback = true;
    this._configPanel.feedbackFill($(this._$slider).data());
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
