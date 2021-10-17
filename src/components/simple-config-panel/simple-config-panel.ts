import $ from 'jquery';
import TMyJQuerySlider from '../../jquery.my-jquery-slider/TMyJQuerySlider';

class SimpleConfigPanel {
  private _$elem: JQuery<HTMLElement>

  private _subscribers: Set<()=>unknown>

  private _isDouble: boolean;

  constructor($el: JQuery<HTMLElement>) {
    this._$elem = $el;
    this._init();
  }

  public subscribe(callback: ()=>unknown): void {
    this._subscribers.add(callback);
  }

  public unsubscribe(callback: ()=>unknown): void {
    this._subscribers.delete(callback);
  }

  public getOptions(): TMyJQuerySlider {
    const options: TMyJQuerySlider = {
      min: this._getMin(),
      max: this._getMax(),
      step: this._getStep(),
    };
    if (this._checkDouble()) {
      options.minInterval = this._getMinInterval();
      options.maxInterval = this._getMaxInterval();
    } else {
      options.isDouble = false;
      options.value = this._getValue();
    }
    if (this._checkVertical()) options.orientation = 'vertical';
    else options.orientation = 'horizontal';
    if (this._checkScale()) options.scale = 'numeric';
    else options.scale = 'basic';
    if (this._checkBar()) options.actualRanges = null;
    else options.actualRanges = null;
    if (this._checkLabel()) options.withLabel = true;
    else options.withLabel = false;
    return options;
  }

  public feedbackFill(config: TMyJQuerySlider): void {
    this._setMin(config.min);
    this._setMax(config.max);
    this._setValue(config.value);
    this._setStep(config.step);
    this._setMinInterval(config.minInterval);
    this._setMaxInterval(config.maxInterval);
    this._setDoubleToggle(config.isDouble);
    this._setLabelToggle(config.withLabel);
  }

  private _init() {
    this._subscribers = new Set();
    this._isDouble = false;
    this._$elem.find('input').on('change', this._handleChange.bind(this));
  }

  private _handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this._isDouble = this._checkDouble();
    if (input.name === 'is-double') this._toggleDouble();
    this._notify();
  }

  private _toggleDouble() {
    this._$elem.find('.js-value-set').toggleClass('simple-config-panel__set_none');
    this._$elem.find('.js-interval-set').each((_, el) => {
      $(el).toggleClass('simple-config-panel__set_none');
    });
  }

  private _notify() {
    this._subscribers.forEach((subscriber) => subscriber());
  }

  private _getMin(): number {
    return +this._$elem.find('[name="min"]').val();
  }

  private _getMax(): number {
    return +this._$elem.find('[name="max"]').val();
  }

  private _getStep(): number {
    return +this._$elem.find('[name="step"]').val();
  }

  private _getValue(): number {
    return +this._$elem.find('[name="value"]').val();
  }

  private _getMinInterval(): number {
    return +this._$elem.find('[name="min-interval"]').val();
  }

  private _getMaxInterval(): number {
    return +this._$elem.find('[name="max-interval"]').val();
  }

  private _checkDouble(): boolean {
    return this._$elem.find('[name="is-double"]').is(':checked');
  }

  private _checkVertical(): boolean {
    return this._$elem.find('[name="is-vertical"]').is(':checked');
  }

  private _checkScale(): boolean {
    return this._$elem.find('[name="with-scale"]').is(':checked');
  }

  private _checkBar(): boolean {
    return this._$elem.find('[name="with-color"]').is(':checked');
  }

  private _checkLabel(): boolean {
    return this._$elem.find('[name="with-label"]').is(':checked');
  }

  private _setMin(value: number) {
    if (!value && value !== 0) return;
    this._$elem.find('[name="min"]').val(value.toString());
  }

  private _setMax(value: number) {
    if (!value && value !== 0) return;
    this._$elem.find('[name="max"]').val(value.toString());
  }

  private _setValue(value: number) {
    if (!value && value !== 0) return;
    this._$elem.find('[name="value"]').val(value.toString());
  }

  private _setStep(value: number) {
    if (!value && value !== 0) return;
    this._$elem.find('[name="step"]').val(value.toString());
  }

  private _setMinInterval(value: number) {
    if (!value && value !== 0) return;
    this._$elem.find('[name="min-interval"]').val(value.toString());
  }

  private _setMaxInterval(value: number) {
    if (!value && value !== 0) return;
    this._$elem.find('[name="max-interval"]').val(value.toString());
  }

  private _setDoubleToggle(flag: boolean) {
    if (flag !== this._isDouble) {
      this._isDouble = flag;
      this._toggleDouble();
    }
    this._$elem.find('[name="is-double"]').prop('checked', flag);
  }

  private _setLabelToggle(flag: boolean) {
    this._$elem.find('[name="with-label"]').prop('checked', flag);
  }
}

export default SimpleConfigPanel;
