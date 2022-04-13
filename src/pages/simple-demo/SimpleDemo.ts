import $ from 'jquery';

import SimpleConfigPanel from '../../components/simple-config-panel/SimpleConfigPanel';
import { SliderEvent, MultiRangeSliderConfig } from '../../jquery.multi-range-slider/MultiRangeSliderConfig';
import './simple-demo.scss';

class SimpleDemo {
  private simpleConfigPanel: SimpleConfigPanel;

  private $slider: JQuery<HTMLElement>;

  private isSliderFeedback = false;

  constructor(item: HTMLElement, config: MultiRangeSliderConfig) {
    this.$slider = $(item).find('.js-slider');
    this.simpleConfigPanel = new SimpleConfigPanel(
      $(item).find('.js-simple-config-panel'),
    );
    this.bindEventListeners();
    this.render(config);
  }

  public render(config: MultiRangeSliderConfig): void {
    this.$slider.multiRangeSlider(config);
  }

  private bindEventListeners() {
    this.simpleConfigPanel.subscribe(
      this.handlePanelChange.bind(this),
    );
    this.$slider.on(
      SliderEvent.init,
      this.handleSliderChange.bind(this),
    );
    this.$slider.on(
      SliderEvent.update,
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
