import './input-screen.scss';

import '../form-set/form-set';
import TMyJQuerySlider from '../../jquery.my-jquery-slider/TMyJQuerySlider';

class InputScreen {
  private _$elem: JQuery<HTMLElement>

  constructor() {
    this._$elem = $('.js-input-screen');
  }

  public show(withOptions: boolean, options: TMyJQuerySlider): void {
    if (withOptions) this.showOptions(options);
    else this.showDefaults();
  }

  public showOptions(options: TMyJQuerySlider): void {
    this._$elem.find('.js-client-code__options').removeClass('client-code__options_none');
    this._$elem.find('.js-client-code__default').addClass('client-code__default_none');
    this._$elem.find('.js-input').html(JSON.stringify(options, null, 2));
  }

  public showDefaults() {
    this._$elem.find('.js-client-code__options').addClass('client-code__options_none');
    this._$elem.find('.js-client-code__default').removeClass('client-code__default_none');
  }
}

export default InputScreen;
