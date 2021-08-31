import './config-panel.scss';

import '../form-set/form-set';
import '../text-field/text-field';
import '../radio-group/radio-group';
import '../toggle/toggle';

import TMyJQuerySlider from '../../jquery.my-jquery-slider/TMyJQuerySlider';

class ConfigPanel {
  private _$elem: JQuery<HTMLElement>

  private _subscribers: Set<()=>unknown>

  constructor() {
    this._subscribers = new Set();
    this._$elem = $('.js-config-panel');
    this._$elem.find('input').on('change', this._notify.bind(this));
  }

  public subscribe(callback: ()=>unknown): void {
    this._subscribers.add(callback);
  }

  public unsubscribe(callback: ()=>unknown): void {
    this._subscribers.delete(callback);
  }

  public getOptions(): TMyJQuerySlider {
    const options: TMyJQuerySlider = {};
    if (this._checkMinToggle()) options.min = this._getMin();
    if (this._checkMaxToggle()) options.max = this._getMax();
    if (this._checkValueToggle()) options.value = this._getValue();
    if (this._checkStepToggle()) options.step = this._getStep();
    if (this._checkOrientationToggle()) options.orientation = this._getOrientation();
    if (this._checkIsDoubleToggle()) options.isDouble = this._checkDouble();
    if (this._checkMinIntervalToggle()) options.minInterval = this._getMinInterval();
    if (this._checkMaxIntervalToggle()) options.maxInterval = this._getMaxInterval();
    if (this._checkActiveToggle()) options.active = this._getActive();
    if (this._checkLimitsToggle()) options.limits = this._getLimits();
    if (this._checkWithLabelToggle()) options.withLabel = this._checkLabel();
    if (this._checkLabelToggle()) options.label = this._getLabel();
    if (this._checkScaleToggle()) options.scale = this._getScale();
    if (this._checkSegmentsToggle()) options.segments = this._getSegments();
    if (this._checkWithNotchToggle()) options.withNotch = this._checkNotch();
    if (this._checkActualRangesToggle()) options.actualRanges = this._getActualRanges();
    if (this._checkLengthPxToggle()) options.lengthPx = this._getLengthPx();
    if (this._checkWithIndentToggle()) options.withIndent = this._checkIndent();
    return options;
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

  private _getScale(): 'basic' | 'numeric' | 'named' {
    return this._$elem.find('[name="scale"]:checked').val() as 'basic' | 'numeric' | 'named';
  }

  private _getSegments(): number {
    return +this._$elem.find('[name="segments"]').val();
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

  private _checkMinToggle(): boolean {
    return this._$elem.find('[name="min-check"]').is(':checked');
  }

  private _checkMaxToggle(): boolean {
    return this._$elem.find('[name="max-check"]').is(':checked');
  }

  private _checkValueToggle(): boolean {
    return this._$elem.find('[name="value-check"]').is(':checked');
  }

  private _checkStepToggle(): boolean {
    return this._$elem.find('[name="step-check"]').is(':checked');
  }

  private _checkOrientationToggle(): boolean {
    return this._$elem.find('[name="orientation-check"]').is(':checked');
  }

  private _checkIsDoubleToggle(): boolean {
    return this._$elem.find('[name="is-double-check"]').is(':checked');
  }

  private _checkMinIntervalToggle(): boolean {
    return this._$elem.find('[name="min-interval-check"]').is(':checked');
  }

  private _checkMaxIntervalToggle(): boolean {
    return this._$elem.find('[name="max-interval-check"]').is(':checked');
  }

  private _checkActiveToggle(): boolean {
    return this._$elem.find('[name="active-check"]').is(':checked');
  }

  private _checkLimitsToggle(): boolean {
    return this._$elem.find('[name="limits-check"]').is(':checked');
  }

  private _checkWithLabelToggle(): boolean {
    return this._$elem.find('[name="with-label-check"]').is(':checked');
  }

  private _checkLabelToggle(): boolean {
    return this._$elem.find('[name="label-check"]').is(':checked');
  }

  private _checkScaleToggle(): boolean {
    return this._$elem.find('[name="scale-check"]').is(':checked');
  }

  private _checkSegmentsToggle(): boolean {
    return this._$elem.find('[name="segments-check"]').is(':checked');
  }

  private _checkWithNotchToggle(): boolean {
    return this._$elem.find('[name="with-notch-check"]').is(':checked');
  }

  private _checkActualRangesToggle(): boolean {
    return this._$elem.find('[name="actual-ranges-check"]').is(':checked');
  }

  private _checkLengthPxToggle(): boolean {
    return this._$elem.find('[name="length-px-check"]').is(':checked');
  }

  private _checkWithIndentToggle(): boolean {
    return this._$elem.find('[name="with-indent-check"]').is(':checked');
  }

  private _notify() {
    this._subscribers.forEach((subscriber) => subscriber());
  }
}

export default ConfigPanel;
