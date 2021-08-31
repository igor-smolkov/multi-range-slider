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
    return {
      min: this._getMin(),
      max: this._getMax(),
      value: this._getValue(),
      step: this._getStep(),
      orientation: this._getOrientation(),
      scale: 'numeric',
    };
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

  private _notify() {
    this._subscribers.forEach((subscriber) => subscriber());
  }
}

export default ConfigPanel;
