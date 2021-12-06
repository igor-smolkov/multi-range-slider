import $ from 'jquery';

import SimpleConfigPanel from '../../components/simple-config-panel/SimpleConfigPanel';
import TMyJQuerySlider from '../../jquery.my-jquery-slider/TMyJQuerySlider';
import './simple-demo.scss';

class SimpleDemo {
  private simpleConfigPanel: SimpleConfigPanel;

  private $slider: JQuery<HTMLElement>;

  private isSliderFeedback = false;

  constructor(item: HTMLElement, config: TMyJQuerySlider) {
    this.$slider = $(item).find('.js-slider');
    this.simpleConfigPanel = new SimpleConfigPanel(
      $(item).find('.js-simple-config-panel'),
    );
    this.bindEventListeners();
    this.render(config);
  }

  public render(config: TMyJQuerySlider): void {
    this.$slider.myJQuerySlider(config);
  }

  private bindEventListeners() {
    this.simpleConfigPanel.subscribe(
      this.handlePanelChange.bind(this),
    );
    this.$slider.on(
      'my-jquery-slider-init',
      this.handleSliderChange.bind(this),
    );
    this.$slider.on(
      'my-jquery-slider-update',
      this.handleSliderChange.bind(this),
    );
  }

  private handlePanelChange() {
    if (this.isSliderFeedback) return;
    const options = this.simpleConfigPanel.getOptions();
    this.render(options);
  }

  private handleSliderChange() {
    this.isSliderFeedback = true;
    this.simpleConfigPanel.feedbackFill($(this.$slider).data());
    this.isSliderFeedback = false;
  }
}

export default SimpleDemo;
