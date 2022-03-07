import $ from 'jquery';

import {
  TMyJQuerySlider, SliderOrientation, SliderLabel, SliderScale,
} from '../../jquery.my-jquery-slider/TMyJQuerySlider';
import { IToggler } from '../toggler/Toggler';
import configPanelClassNames from './utils/configPanelClassNames';

class ConfigPanel {
  private $elem: JQuery<HTMLElement> = $('.js-config-panel');

  private subscribers: Set<() => unknown> = new Set();

  constructor() {
    this.bindEventListeners();
  }

  public subscribe(callback: () => unknown): void {
    this.subscribers.add(callback);
  }

  public unsubscribe(callback: () => unknown): void {
    this.subscribers.delete(callback);
  }

  public getOptions(toggler: IToggler): TMyJQuerySlider {
    const options: TMyJQuerySlider = {};
    if (toggler.checkMin()) options.min = this.getMin();
    if (toggler.checkMax()) options.max = this.getMax();
    if (toggler.checkValue()) options.value = this.getValue();
    if (toggler.checkStep()) options.step = this.getStep();
    if (toggler.checkOrientation()) {
      options.orientation = this.getOrientation();
    }
    if (toggler.checkIsDouble()) {
      options.isDouble = this.checkDouble();
    }
    if (toggler.checkMinInterval()) {
      options.minInterval = this.getMinInterval();
    }
    if (toggler.checkMaxInterval()) {
      options.maxInterval = this.getMaxInterval();
    }
    if (toggler.checkActiveRange()) options.activeRange = this.getActiveRange();
    if (toggler.checkLimits()) options.limits = this.getLimits();
    if (toggler.checkWithLabel()) {
      options.withLabel = this.checkLabel();
    }
    if (toggler.checkLabel()) options.label = this.getLabel();
    if (toggler.checkScale()) options.scale = this.getScale();
    if (toggler.checkScaleSegments()) {
      options.scaleSegments = this.getScaleSegments();
    }
    if (toggler.checkWithNotch()) {
      options.withNotch = this.checkNotch();
    }
    if (toggler.checkLabelsList()) options.labelsList = this.getLabelsList();
    if (toggler.checkActualRanges()) {
      options.actualRanges = this.getActualRanges();
    }
    if (toggler.checkLengthPx()) {
      options.lengthPx = this.getLengthPx();
    }
    if (toggler.checkWithIndent()) {
      options.withIndent = this.checkIndent();
    }
    return options;
  }

  public show(name: string): void {
    this.$elem.find(`[name="${name}"]`).prop('disabled', false);
    this.$elem
      .find(`[name="${name}"]`)
      .closest('.js-config-panel-set')
      .removeClass(configPanelClassNames.setNone);
  }

  public hide(name: string): void {
    this.$elem.find(`[name="${name}"]`).prop('disabled', true);
    this.$elem
      .find(`[name="${name}"]`)
      .closest('.js-config-panel-set')
      .addClass(configPanelClassNames.setNone);
  }

  public enable(): void {
    this.$elem
      .find('.js-form-set')
      .each((_, el) => el.removeAttribute('disabled'));
  }

  public disable(): void {
    this.$elem
      .find('.js-form-set')
      .each((_, el) => el.setAttribute('disabled', 'disabled'));
  }

  public feedbackFill(config: TMyJQuerySlider): void {
    this.setMin(config.min as number);
    this.setMax(config.max as number);
    this.setValue(config.value as number);
    this.setStep(config.step as number);
    this.setOrientation(config.orientation);
    this.setDoubleToggle(config.isDouble as boolean);
    this.setMinInterval(config.minInterval as number);
    this.setMaxInterval(config.maxInterval as number);
    this.setActiveRange(config.activeRange as number);
    this.setLimits(config.limits as number[]);
    this.setLabelToggle(config.withLabel);
    this.setLabel(config.label as SliderLabel);
    this.setScale(config.scale);
    this.setScaleSegments(config.scaleSegments as number);
    this.setNotchToggle(config.withNotch);
    this.setLabelsList(config.labelsList as (string | [number, string])[]);
    this.setActualRanges(config.actualRanges);
    this.setLengthPx(config.lengthPx as number);
    this.setIndentToggle(config.withIndent);
  }

  private getMin(): number {
    return Number(this.$elem.find('[name="min"]').val());
  }

  private getMax(): number {
    return Number(this.$elem.find('[name="max"]').val());
  }

  private getValue(): number {
    return Number(this.$elem.find('[name="value"]').val());
  }

  private getStep(): number {
    return Number(this.$elem.find('[name="step"]').val());
  }

  private getOrientation(): SliderOrientation {
    return this.$elem.find('[name="orientation"]:checked').val() as
      | SliderOrientation;
  }

  private getMinInterval(): number {
    return Number(this.$elem.find('[name="min-interval"]').val());
  }

  private getMaxInterval(): number {
    return Number(this.$elem.find('[name="max-interval"]').val());
  }

  private getLimits(): number[] {
    const value = this.$elem.find('[name="limits"]').val() as string;
    return value.trim().split(',').map((el) => +el);
  }

  private getActiveRange(): number {
    return Number(this.$elem.find('[name="active-range"]').val());
  }

  private getLabel(): SliderLabel {
    return this.$elem.find('[name="label"]:checked').val() as SliderLabel;
  }

  private getScale(): SliderScale | null {
    const value = this.$elem.find('[name="scale"]:checked').val() as
      | SliderScale
      | 'null';
    return value === 'null' ? null : value;
  }

  private getScaleSegments(): number {
    return Number(this.$elem.find('[name="scale-segments"]').val());
  }

  private getLabelsList(): (string | [number, string])[] {
    const labelsListStr = this.$elem.find('[name="labels-list"]').val() as string;
    const parts = labelsListStr
      .split(/, \[|\],|\[|\]/)
      .map((label) => label.trim());
    const rawLabelsList: (string | [number, string])[] = [];
    parts.forEach((part) => {
      const splitPart = part.split(',').map((label) => label.trim());
      if (Number.isNaN(+part[0])) rawLabelsList.push(...splitPart);
      else rawLabelsList.push([+splitPart[0], splitPart[1]]);
    });
    return rawLabelsList.filter((label) => label !== '');
  }

  private getActualRanges(): number[] | null {
    const str = this.$elem
      .find('[name="actual-ranges"]').val() as string;
    if (str === '') return [];
    if (str === 'null') return null;
    return str
      .trim()
      .split(',')
      .map((el) => +el);
  }

  private getLengthPx(): number {
    return Number(this.$elem.find('[name="length-px"]').val());
  }

  private checkDouble(): boolean {
    return this.$elem.find('[name="is-double"]').is(':checked');
  }

  private checkLabel(): boolean {
    return this.$elem.find('[name="with-label"]').is(':checked');
  }

  private checkNotch(): boolean {
    return this.$elem.find('[name="with-notch"]').is(':checked');
  }

  private checkIndent(): boolean {
    return this.$elem.find('[name="with-indent"]').is(':checked');
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

  private setOrientation(value?: SliderOrientation) {
    if (!value) return;
    this.$elem
      .find(`[name="orientation"][value="${value}"]`)
      .prop('checked', true);
  }

  private setMinInterval(value?: number) {
    if (!value && value !== 0) return;
    this.$elem.find('[name="min-interval"]').val(value.toString());
  }

  private setMaxInterval(value?: number) {
    if (!value && value !== 0) return;
    this.$elem.find('[name="max-interval"]').val(value.toString());
  }

  private setLimits(array?: number[]) {
    if (!array || array.length === 0) return;
    this.$elem.find('[name="limits"]').val(array.join(', '));
  }

  private setActiveRange(value?: number) {
    if (!value && value !== 0) return;
    this.$elem.find('[name="active-range"]').val(value.toString());
  }

  private setLabel(value?: SliderLabel) {
    if (!value) return;
    this.$elem
      .find(`[name="label"][value="${value}"]`)
      .prop('checked', true);
  }

  private setScale(value?: SliderScale | null) {
    if (!value) return;
    this.$elem
      .find(`[name="scale"][value="${value}"]`)
      .prop('checked', true);
  }

  private setScaleSegments(value?: number) {
    if (!value && value !== 0) return;
    this.$elem.find('[name="scale-segments"]').val(value.toString());
  }

  private setLabelsList(array?: (string | [number, string])[]) {
    if (!array || array.length === 0) return;
    this.$elem
      .find('[name="labels-list"]')
      .val(array.map((a) => `[${a[0]}, ${a[1]}]`).join(', '));
  }

  private setActualRanges(array?: number[] | null) {
    if (!array || array.length === 0) return;
    this.$elem.find('[name="actual-ranges"]').val(array.join(', '));
  }

  private setLengthPx(value?: number) {
    if (!value && value !== 0) return;
    this.$elem.find('[name="length-px"]').val(value.toString());
  }

  private setDoubleToggle(flag?: boolean) {
    this.$elem.find('[name="is-double"]').prop('checked', flag);
  }

  private setLabelToggle(flag?: boolean) {
    this.$elem.find('[name="with-label"]').prop('checked', flag);
  }

  private setNotchToggle(flag?: boolean) {
    this.$elem.find('[name="with-notch"]').prop('checked', flag);
  }

  private setIndentToggle(flag?: boolean) {
    this.$elem.find('[name="with-indent"]').prop('checked', flag);
  }

  private notify() {
    this.subscribers.forEach((subscriber) => subscriber());
  }

  private bindEventListeners() {
    this.$elem.find('input').on('change', this.notify.bind(this));
    this.$elem
      .find('.js-limit-group')
      .find('.button')
      .on('click', this.addLimit.bind(this));
  }

  private addLimit() {
    const $limits = this.$elem.find('[name="limits"]');
    if ($limits.val()) {
      const lastValue = this.getLimits().pop() as number;
      $limits.val(
        `${$limits.val()}, ${lastValue + 25}`,
      );
    } else $limits.val('25');
    this.notify();
  }
}

export default ConfigPanel;
