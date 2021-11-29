import $ from 'jquery';

import TMyJQuerySlider from '../../jquery.my-jquery-slider/TMyJQuerySlider';
import { IToggler } from '../toggler/Toggler';
import configPanelClassNames from './utils/configPanelClassNames';

class ConfigPanel {
  private _$elem: JQuery<HTMLElement> = $('.js-config-panel');

  private _subscribers: Set<() => unknown> = new Set();

  constructor() {
    this._bindEventListeners();
  }

  public subscribe(callback: () => unknown): void {
    this._subscribers.add(callback);
  }

  public unsubscribe(callback: () => unknown): void {
    this._subscribers.delete(callback);
  }

  public getOptions(toggler: IToggler): TMyJQuerySlider {
    const options: TMyJQuerySlider = {};
    if (toggler.checkMin()) options.min = this._getMin();
    if (toggler.checkMax()) options.max = this._getMax();
    if (toggler.checkValue()) options.value = this._getValue();
    if (toggler.checkStep()) options.step = this._getStep();
    if (toggler.checkOrientation()) {
      options.orientation = this._getOrientation();
    }
    if (toggler.checkIsDouble()) {
      options.isDouble = this._checkDouble();
    }
    if (toggler.checkMinInterval()) {
      options.minInterval = this._getMinInterval();
    }
    if (toggler.checkMaxInterval()) {
      options.maxInterval = this._getMaxInterval();
    }
    if (toggler.checkActive()) options.active = this._getActive();
    if (toggler.checkLimits()) options.limits = this._getLimits();
    if (toggler.checkWithLabel()) {
      options.withLabel = this._checkLabel();
    }
    if (toggler.checkLabel()) options.label = this._getLabel();
    if (toggler.checkScale()) options.scale = this._getScale();
    if (toggler.checkSegments()) {
      options.segments = this._getSegments();
    }
    if (toggler.checkWithNotch()) {
      options.withNotch = this._checkNotch();
    }
    if (toggler.checkList()) options.list = this._getList();
    if (toggler.checkActualRanges()) {
      options.actualRanges = this._getActualRanges();
    }
    if (toggler.checkLengthPx()) {
      options.lengthPx = this._getLengthPx();
    }
    if (toggler.checkWithIndent()) {
      options.withIndent = this._checkIndent();
    }
    return options;
  }

  public show(name: string): void {
    this._$elem.find(`[name="${name}"]`).prop('disabled', false);
    this._$elem
      .find(`[name="${name}"]`)
      .closest('.js-config-panel-set')
      .removeClass(configPanelClassNames.setNone);
  }

  public hide(name: string): void {
    this._$elem.find(`[name="${name}"]`).prop('disabled', true);
    this._$elem
      .find(`[name="${name}"]`)
      .closest('.js-config-panel-set')
      .addClass(configPanelClassNames.setNone);
  }

  public enable(): void {
    this._$elem
      .find('.js-form-set')
      .each((_, el) => el.removeAttribute('disabled'));
  }

  public disable(): void {
    this._$elem
      .find('.js-form-set')
      .each((_, el) => el.setAttribute('disabled', 'disabled'));
  }

  public feedbackFill(config: TMyJQuerySlider): void {
    this._setMin(config.min as number);
    this._setMax(config.max as number);
    this._setValue(config.value as number);
    this._setStep(config.step as number);
    this._setOrientation(config.orientation);
    this._setDoubleToggle(config.isDouble as boolean);
    this._setMinInterval(config.minInterval as number);
    this._setMaxInterval(config.maxInterval as number);
    this._setActive(config.active as number);
    this._setLimits(config.limits as number[]);
    this._setLabelToggle(config.withLabel);
    this._setLabel(config.label as 'number' | 'name');
    this._setScale(config.scale);
    this._setSegments(config.segments as number);
    this._setNotchToggle(config.withNotch);
    this._setList(config.list as (string | [number, string])[]);
    this._setActualRanges(config.actualRanges);
    this._setLengthPx(config.lengthPx as number);
    this._setIndentToggle(config.withIndent);
  }

  private _getMin(): number {
    return Number(this._$elem.find('[name="min"]').val());
  }

  private _getMax(): number {
    return Number(this._$elem.find('[name="max"]').val());
  }

  private _getValue(): number {
    return Number(this._$elem.find('[name="value"]').val());
  }

  private _getStep(): number {
    return Number(this._$elem.find('[name="step"]').val());
  }

  private _getOrientation(): 'vertical' | 'horizontal' {
    return this._$elem.find('[name="orientation"]:checked').val() as
      | 'vertical'
      | 'horizontal';
  }

  private _getMinInterval(): number {
    return Number(this._$elem.find('[name="min-interval"]').val());
  }

  private _getMaxInterval(): number {
    return Number(this._$elem.find('[name="max-interval"]').val());
  }

  private _getLimits(): number[] {
    const value = this._$elem.find('[name="limits"]').val() as string;
    return value.trim().split(',').map((el) => +el);
  }

  private _getActive(): number {
    return Number(this._$elem.find('[name="active"]').val());
  }

  private _getLabel(): 'number' | 'name' {
    return this._$elem.find('[name="label"]:checked').val() as
      | 'number'
      | 'name';
  }

  private _getScale(): 'basic' | 'numeric' | 'named' | 'mixed' | null {
    const value = this._$elem.find('[name="scale"]:checked').val() as
      | 'basic'
      | 'numeric'
      | 'named'
      | 'mixed'
      | 'null';
    return value === 'null' ? null : value;
  }

  private _getSegments(): number {
    return Number(this._$elem.find('[name="segments"]').val());
  }

  private _getList(): (string | [number, string])[] {
    const listStr = this._$elem.find('[name="list"]').val() as string;
    const parts = listStr
      .split(/, \[|\],|\[|\]/)
      .map((item) => item.trim());
    const rawList: (string | [number, string])[] = [];
    parts.forEach((part) => {
      const splitPart = part.split(',').map((item) => item.trim());
      if (Number.isNaN(+part[0])) rawList.push(...splitPart);
      else rawList.push([+splitPart[0], splitPart[1]]);
    });
    return rawList.filter((item) => item !== '');
  }

  private _getActualRanges(): number[] | null {
    const str = this._$elem
      .find('[name="actual-ranges"]').val() as string;
    if (str === '') return [];
    if (str === 'null') return null;
    return str
      .trim()
      .split(',')
      .map((el) => +el);
  }

  private _getLengthPx(): number {
    return Number(this._$elem.find('[name="length-px"]').val());
  }

  private _checkDouble(): boolean {
    return this._$elem.find('[name="is-double"]').is(':checked');
  }

  private _checkLabel(): boolean {
    return this._$elem.find('[name="with-label"]').is(':checked');
  }

  private _checkNotch(): boolean {
    return this._$elem.find('[name="with-notch"]').is(':checked');
  }

  private _checkIndent(): boolean {
    return this._$elem.find('[name="with-indent"]').is(':checked');
  }

  private _setMin(value?: number) {
    if (!value && value !== 0) return;
    this._$elem.find('[name="min"]').val(value.toString());
  }

  private _setMax(value?: number) {
    if (!value && value !== 0) return;
    this._$elem.find('[name="max"]').val(value.toString());
  }

  private _setValue(value?: number) {
    if (!value && value !== 0) return;
    this._$elem.find('[name="value"]').val(value.toString());
  }

  private _setStep(value?: number) {
    if (!value && value !== 0) return;
    this._$elem.find('[name="step"]').val(value.toString());
  }

  private _setOrientation(value?: 'vertical' | 'horizontal') {
    if (!value) return;
    this._$elem
      .find(`[name="orientation"][value="${value}"]`)
      .prop('checked', true);
  }

  private _setMinInterval(value?: number) {
    if (!value && value !== 0) return;
    this._$elem.find('[name="min-interval"]').val(value.toString());
  }

  private _setMaxInterval(value?: number) {
    if (!value && value !== 0) return;
    this._$elem.find('[name="max-interval"]').val(value.toString());
  }

  private _setLimits(array?: number[]) {
    if (!array || array.length === 0) return;
    this._$elem.find('[name="limits"]').val(array.join(', '));
  }

  private _setActive(value?: number) {
    if (!value && value !== 0) return;
    this._$elem.find('[name="active"]').val(value.toString());
  }

  private _setLabel(value?: 'number' | 'name') {
    if (!value) return;
    this._$elem
      .find(`[name="label"][value="${value}"]`)
      .prop('checked', true);
  }

  private _setScale(value?: 'basic' | 'numeric' | 'named' | 'mixed' | null) {
    if (!value) return;
    this._$elem
      .find(`[name="scale"][value="${value}"]`)
      .prop('checked', true);
  }

  private _setSegments(value?: number) {
    if (!value && value !== 0) return;
    this._$elem.find('[name="segments"]').val(value.toString());
  }

  private _setList(array?: (string | [number, string])[]) {
    if (!array || array.length === 0) return;
    this._$elem
      .find('[name="list"]')
      .val(array.map((a) => `[${a[0]}, ${a[1]}]`).join(', '));
  }

  private _setActualRanges(array?: number[] | null) {
    if (!array || array.length === 0) return;
    this._$elem.find('[name="actual-ranges"]').val(array.join(', '));
  }

  private _setLengthPx(value?: number) {
    if (!value && value !== 0) return;
    this._$elem.find('[name="length-px"]').val(value.toString());
  }

  private _setDoubleToggle(flag?: boolean) {
    this._$elem.find('[name="is-double"]').prop('checked', flag);
  }

  private _setLabelToggle(flag?: boolean) {
    this._$elem.find('[name="with-label"]').prop('checked', flag);
  }

  private _setNotchToggle(flag?: boolean) {
    this._$elem.find('[name="with-notch"]').prop('checked', flag);
  }

  private _setIndentToggle(flag?: boolean) {
    this._$elem.find('[name="with-indent"]').prop('checked', flag);
  }

  private _notify() {
    this._subscribers.forEach((subscriber) => subscriber());
  }

  private _bindEventListeners() {
    this._$elem.find('input').on('change', this._notify.bind(this));
    this._$elem
      .find('.js-limit-group')
      .find('.button')
      .on('click', this._addLimit.bind(this));
  }

  private _addLimit() {
    const $limits = this._$elem.find('[name="limits"]');
    if ($limits.val()) {
      const lastValue = this._getLimits().pop() as number;
      $limits.val(
        `${$limits.val()}, ${lastValue + 25}`,
      );
    } else $limits.val('25');
    this._notify();
  }
}

export default ConfigPanel;
