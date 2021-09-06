import $ from 'jquery';
import './config-panel.scss';

import '../form-set/form-set';
import '../text-field/text-field';
import '../radio-group/radio-group';
import '../toggle/toggle';
import '../button/button';

import TMyJQuerySlider from '../../jquery.my-jquery-slider/TMyJQuerySlider';
import { IToggler } from '../toggler/toggler';

class ConfigPanel {
  private _$elem: JQuery<HTMLElement>

  private _subscribers: Set<()=>unknown>

  constructor() {
    this._subscribers = new Set();
    this._$elem = $('.js-config-panel');
    this._bindEventListeners();
  }

  public subscribe(callback: ()=>unknown): void {
    this._subscribers.add(callback);
  }

  public unsubscribe(callback: ()=>unknown): void {
    this._subscribers.delete(callback);
  }

  public getOptions(toggler: IToggler): TMyJQuerySlider {
    const options: TMyJQuerySlider = {};
    if (toggler.checkMin()) options.min = this._getMin();
    if (toggler.checkMax()) options.max = this._getMax();
    if (toggler.checkValue()) options.value = this._getValue();
    if (toggler.checkStep()) options.step = this._getStep();
    if (toggler.checkOrientation()) options.orientation = this._getOrientation();
    if (toggler.checkIsDouble()) options.isDouble = this._checkDouble();
    if (toggler.checkMinInterval()) options.minInterval = this._getMinInterval();
    if (toggler.checkMaxInterval()) options.maxInterval = this._getMaxInterval();
    if (toggler.checkActive()) options.active = this._getActive();
    if (toggler.checkLimits()) options.limits = this._getLimits();
    if (toggler.checkWithLabel()) options.withLabel = this._checkLabel();
    if (toggler.checkLabel()) options.label = this._getLabel();
    if (toggler.checkScale()) options.scale = this._getScale();
    if (toggler.checkSegments()) options.segments = this._getSegments();
    if (toggler.checkWithNotch()) options.withNotch = this._checkNotch();
    if (toggler.checkList()) options.list = this._getList();
    if (toggler.checkActualRanges()) options.actualRanges = this._getActualRanges();
    if (toggler.checkLengthPx()) options.lengthPx = this._getLengthPx();
    if (toggler.checkWithIndent()) options.withIndent = this._checkIndent();
    return options;
  }

  public show(name: string): void {
    this._$elem.find(`[name="${name}"]`).prop('disabled', false);
    this._$elem.find(`[name="${name}"]`).closest('.config-panel__set').removeClass('config-panel__set_none');
  }

  public hide(name: string): void {
    this._$elem.find(`[name="${name}"]`).prop('disabled', true);
    this._$elem.find(`[name="${name}"]`).closest('.config-panel__set').addClass('config-panel__set_none');
  }

  public enable(): void {
    this._$elem.find('.form-set').each((_, el) => el.removeAttribute('disabled'));
  }

  public disable(): void {
    this._$elem.find('.form-set').each((_, el) => el.setAttribute('disabled', 'disabled'));
  }

  private _getMin(): number {
    return +this._$elem.find('[name="min"]').val();
  }

  private _getMax(): number {
    return +this._$elem.find('[name="max"]').val();
  }

  private _getValue(): number {
    return +this._$elem.find('[name="value"]').val();
  }

  private _getStep(): number {
    return +this._$elem.find('[name="step"]').val();
  }

  private _getOrientation(): 'vertical' | 'horizontal' {
    return this._$elem.find('[name="orientation"]:checked').val() as 'vertical' | 'horizontal';
  }

  private _getMinInterval(): number {
    return +this._$elem.find('[name="min-interval"]').val();
  }

  private _getMaxInterval(): number {
    return +this._$elem.find('[name="max-interval"]').val();
  }

  private _getLimits(): number[] {
    return this._$elem.find('[name="limits"]').val().toString().trim()
      .split(',')
      .map((el) => +el);
  }

  private _getActive(): number {
    return +this._$elem.find('[name="active"]').val();
  }

  private _getLabel(): 'number' | 'name' {
    return this._$elem.find('[name="label"]:checked').val() as 'number' | 'name';
  }

  private _getScale(): 'basic' | 'numeric' | 'named' | 'mixed' {
    return this._$elem.find('[name="scale"]:checked').val() as 'basic' | 'numeric' | 'named' | 'mixed';
  }

  private _getSegments(): number {
    return +this._$elem.find('[name="segments"]').val();
  }

  private _getList(): (string | [number, string])[] {
    const listStr = this._$elem.find('[name="list"]').val() as string;
    const parts = listStr.split(/, \[|\],|\[|\]/).map((item) => item.trim());
    const rawList: (string | [number, string])[] = [];
    parts.forEach((part) => {
      const splitPart = part.split(',').map((item) => item.trim());
      if (Number.isNaN(+part[0])) rawList.push(...splitPart);
      else rawList.push([+splitPart[0], splitPart[1]]);
    });
    return rawList.filter((item) => item !== '');
  }

  private _getActualRanges(): number[] {
    return this._$elem.find('[name="actual-ranges"]').val().toString().trim()
      .split(',')
      .map((el) => +el);
  }

  private _getLengthPx(): number {
    return +this._$elem.find('[name="length-px"]').val();
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

  private _notify() {
    this._subscribers.forEach((subscriber) => subscriber());
  }

  private _bindEventListeners() {
    this._$elem.find('input').on('change', this._notify.bind(this));
    this._$elem.find('.limit-group').find('.button').on('click', this._addLimit.bind(this));
  }

  private _addLimit() {
    const $limits = this._$elem.find('[name="limits"]');
    if ($limits.val()) $limits.val(`${$limits.val()}, ${this._getLimits().pop() + 25}`);
    else $limits.val('25');
    this._notify();
  }
}

export default ConfigPanel;
