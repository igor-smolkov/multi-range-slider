import $ from 'jquery';

import { MultiRangeSliderConfig, SliderOrientation, SliderScale } from '../../jquery.multi-range-slider/MultiRangeSliderConfig';
import simpleConfigPanelClassNames from './utils/simpleConfigPanelClassNames';

class SimpleConfigPanel {
  private $elem: JQuery<HTMLElement>;

  private subscribers: Set<() => unknown> = new Set();

  private isDouble = false;

  constructor($el: JQuery<HTMLElement>) {
    this.$elem = $el;
    this.init();
  }

  public subscribe(callback: () => unknown): void {
    this.subscribers.add(callback);
  }

  public unsubscribe(callback: () => unknown): void {
    this.subscribers.delete(callback);
  }

  public getOptions(): MultiRangeSliderConfig {
    const options: MultiRangeSliderConfig = {
      min: this.getMin(),
      max: this.getMax(),
      step: this.getStep(),
    };
    if (this.checkDouble()) {
      options.minInterval = this.getMinInterval();
      options.maxInterval = this.getMaxInterval();
    } else {
      options.isDouble = false;
      options.value = this.getValue();
    }
    if (this.checkVertical()) options.orientation = SliderOrientation.vertical;
    else options.orientation = SliderOrientation.horizontal;
    if (this.checkScale()) options.scale = SliderScale.numeric;
    else options.scale = null;
    if (this.checkBar()) options.actualRanges = null;
    else options.actualRanges = [];
    if (this.checkLabel()) options.withLabel = true;
    else options.withLabel = false;
    return options;
  }

  public feedbackFill(config: MultiRangeSliderConfig): void {
    this.setMin(config.min as number);
    this.setMax(config.max as number);
    this.setValue(config.value as number);
    this.setStep(config.step as number);
    this.setMinInterval(config.minInterval as number);
    this.setMaxInterval(config.maxInterval as number);
    this.setDoubleToggle(config.isDouble as boolean);
    this.setLabelToggle(config.withLabel);
  }

  private init() {
    this.$elem
      .find('input')
      .on('change', this.handleChange.bind(this));
  }

  private handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.isDouble = this.checkDouble();
    if (input.name === 'is-double') this.toggleDouble();
    this.notify();
  }

  private toggleDouble() {
    this.$elem
      .find('.js-value-set')
      .toggleClass(simpleConfigPanelClassNames.setNone);
    this.$elem.find('.js-interval-set').each((_, el) => {
      $(el).toggleClass(simpleConfigPanelClassNames.setNone);
    });
  }

  private notify() {
    this.subscribers.forEach((subscriber) => subscriber());
  }

  private getMin(): number {
    return Number(this.$elem.find('[name="min"]').val());
  }

  private getMax(): number {
    return Number(this.$elem.find('[name="max"]').val());
  }

  private getStep(): number {
    return Number(this.$elem.find('[name="step"]').val());
  }

  private getValue(): number {
    return Number(this.$elem.find('[name="value"]').val());
  }

  private getMinInterval(): number {
    return Number(this.$elem.find('[name="min-interval"]').val());
  }

  private getMaxInterval(): number {
    return Number(this.$elem.find('[name="max-interval"]').val());
  }

  private checkDouble(): boolean {
    return this.$elem.find('[name="is-double"]').is(':checked');
  }

  private checkVertical(): boolean {
    return this.$elem.find('[name="is-vertical"]').is(':checked');
  }

  private checkScale(): boolean {
    return this.$elem.find('[name="with-scale"]').is(':checked');
  }

  private checkBar(): boolean {
    return this.$elem.find('[name="with-color"]').is(':checked');
  }

  private checkLabel(): boolean {
    return this.$elem.find('[name="with-label"]').is(':checked');
  }

  private setMin(value?: number) {
    if (!value && value !== 0) return;
    this.$elem.find('[name="min"]').val(value.toString());
  }

  private setMax(value?: number) {
    if (!value && value !== 0) return;
    this.$elem.find('[name="max"]').val(value.toString());
  }

  private setValue(value?: number) {
    if (!value && value !== 0) return;
    this.$elem.find('[name="value"]').val(value.toString());
  }

  private setStep(value?: number) {
    if (!value && value !== 0) return;
    this.$elem.find('[name="step"]').val(value.toString());
  }

  private setMinInterval(value?: number) {
    if (!value && value !== 0) return;
    this.$elem.find('[name="min-interval"]').val(value.toString());
  }

  private setMaxInterval(value?: number) {
    if (!value && value !== 0) return;
    this.$elem.find('[name="max-interval"]').val(value.toString());
  }

  private setDoubleToggle(flag?: boolean) {
    if (flag !== this.isDouble) {
      this.isDouble = !!flag;
      this.toggleDouble();
    }
    this.$elem.find('[name="is-double"]').prop('checked', flag);
  }

  private setLabelToggle(flag?: boolean) {
    this.$elem.find('[name="with-label"]').prop('checked', flag);
  }
}

export default SimpleConfigPanel;
