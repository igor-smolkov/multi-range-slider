import $ from 'jquery';

import SimpleConfigPanel from '../../components/simple-config-panel/SimpleConfigPanel';
import TMyJQuerySlider from '../../jquery.my-jquery-slider/TMyJQuerySlider';
import './simple-demo.scss';

class SimpleDemo {
  private _simpleConfigPanel: SimpleConfigPanel;

  private _$slider: JQuery<HTMLElement>;

  private _isSliderFeedback = false;

  constructor(item: HTMLElement, config: TMyJQuerySlider) {
    this._$slider = $(item).find('.js-slider');
    this._simpleConfigPanel = new SimpleConfigPanel(
      $(item).find('.js-simple-config-panel'),
    );
    this._bindEventListeners();
    this.render(config);
  }

  public render(config: TMyJQuerySlider): void {
    this._$slider.myJQuerySlider(config);
  }

  private _bindEventListeners() {
    this._simpleConfigPanel.subscribe(
      this._handlePanelChange.bind(this),
    );
    this._$slider.on(
      'my-jquery-slider-init',
      this._handleSliderChange.bind(this),
    );
    this._$slider.on(
      'my-jquery-slider-update',
      this._handleSliderChange.bind(this),
    );
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

export default SimpleDemo;
