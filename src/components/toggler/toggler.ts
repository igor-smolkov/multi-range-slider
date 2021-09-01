import './toggler.scss';

import '../form-set/form-set';
import '../toggle/toggle';

interface IToggler {
  checkMin(): boolean
  checkMax(): boolean
  checkValue(): boolean
  checkStep(): boolean
  checkOrientation(): boolean
  checkIsDouble(): boolean
  checkMinInterval(): boolean
  checkMaxInterval(): boolean
  checkActive(): boolean
  checkLimits(): boolean
  checkWithLabel(): boolean
  checkLabel(): boolean
  checkScale(): boolean
  checkSegments(): boolean
  checkWithNotch(): boolean
  checkActualRanges(): boolean
  checkLengthPx(): boolean
  checkWithIndent(): boolean
}

class Toggler {
  private _$elem: JQuery<HTMLElement>

  private _subscribers: Set<(event: string, name: string)=>unknown>

  constructor() {
    this._subscribers = new Set();
    this._$elem = $('.js-toggler');
    this._$elem.find('input').on('change', this._notify.bind(this));
  }

  public subscribe(callback: (event: string, name: string)=>unknown): void {
    this._subscribers.add(callback);
  }

  public unsubscribe(callback: (event: string, name: string)=>unknown): void {
    this._subscribers.delete(callback);
  }

  public enable(): void {
    this._$elem.find('.form-set').prop('disabled', false);
  }

  public disable(): void {
    this._$elem.find('.form-set').prop('disabled', true);
  }

  public checkMin(): boolean {
    return this._$elem.find('[name="min"]').is(':checked');
  }

  public checkMax(): boolean {
    return this._$elem.find('[name="max"]').is(':checked');
  }

  public checkValue(): boolean {
    return this._$elem.find('[name="value"]').is(':checked');
  }

  public checkStep(): boolean {
    return this._$elem.find('[name="step"]').is(':checked');
  }

  public checkOrientation(): boolean {
    return this._$elem.find('[name="orientation"]').is(':checked');
  }

  public checkIsDouble(): boolean {
    return this._$elem.find('[name="is-double"]').is(':checked');
  }

  public checkMinInterval(): boolean {
    return this._$elem.find('[name="min-interval"]').is(':checked');
  }

  public checkMaxInterval(): boolean {
    return this._$elem.find('[name="max-interval"]').is(':checked');
  }

  public checkActive(): boolean {
    return this._$elem.find('[name="active"]').is(':checked');
  }

  public checkLimits(): boolean {
    return this._$elem.find('[name="limits"]').is(':checked');
  }

  public checkWithLabel(): boolean {
    return this._$elem.find('[name="with-label"]').is(':checked');
  }

  public checkLabel(): boolean {
    return this._$elem.find('[name="label"]').is(':checked');
  }

  public checkScale(): boolean {
    return this._$elem.find('[name="scale"]').is(':checked');
  }

  public checkSegments(): boolean {
    return this._$elem.find('[name="segments"]').is(':checked');
  }

  public checkWithNotch(): boolean {
    return this._$elem.find('[name="with-notch"]').is(':checked');
  }

  public checkActualRanges(): boolean {
    return this._$elem.find('[name="actual-ranges"]').is(':checked');
  }

  public checkLengthPx(): boolean {
    return this._$elem.find('[name="length-px"]').is(':checked');
  }

  public checkWithIndent(): boolean {
    return this._$elem.find('[name="with-indent"]').is(':checked');
  }

  private _notify(e: Event) {
    const el = e.target as HTMLInputElement;
    this._subscribers.forEach((subscriber) => subscriber(
      el.checked ? 'enable' : 'disable',
      el.getAttribute('name'),
    ));
  }
}

export { Toggler, IToggler };
