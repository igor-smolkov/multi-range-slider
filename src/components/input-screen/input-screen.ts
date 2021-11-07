import $ from 'jquery';

import TMyJQuerySlider from '../../jquery.my-jquery-slider/TMyJQuerySlider';

class InputScreen {
  private _$elem: JQuery<HTMLElement>

  constructor() {
    this._$elem = $('.js-input-screen');
  }

  public showOptions(options: TMyJQuerySlider): void {
    this._$elem.find('.js-client-code__options').removeClass('client-code__options_none');
    this._$elem.find('.js-client-code__default').addClass('client-code__default_none');
    this._$elem.find('.js-input').html(JSON.stringify(options, null, 2));
  }

  public showDefaults(): void {
    this._$elem.find('.js-client-code__options').addClass('client-code__options_none');
    this._$elem.find('.js-client-code__default').removeClass('client-code__default_none');
  }

  public setTitle(text: string): void {
    this._$elem.find('.js-form-set__title').text(text);
  }

  public hideToggle(): void {
    this._$elem.toggleClass('input-screen_none');
  }
}

export default InputScreen;
