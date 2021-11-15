import $ from 'jquery';

import TMyJQuerySlider from '../../jquery.my-jquery-slider/TMyJQuerySlider';
import inputScreenClassNames from './utils/inputScreenClassNames';

class InputScreen {
  private _$elem: JQuery<HTMLElement>

  constructor() {
    this._$elem = $('.js-input-screen');
  }

  public showOptions(options: TMyJQuerySlider): void {
    this._$elem.find('.js-client-code__options').removeClass(inputScreenClassNames.clientCodeOptionsNone);
    this._$elem.find('.js-client-code__default').addClass(inputScreenClassNames.clientCodeDefaultNone);
    this._$elem.find('.js-input').html(JSON.stringify(options, null, 2));
  }

  public showDefaults(): void {
    this._$elem.find('.js-client-code__options').addClass(inputScreenClassNames.clientCodeOptionsNone);
    this._$elem.find('.js-client-code__default').removeClass(inputScreenClassNames.clientCodeDefaultNone);
  }

  public setTitle(text: string): void {
    this._$elem.find('.js-form-set__title').text(text);
  }

  public hideToggle(): void {
    this._$elem.toggleClass(inputScreenClassNames.none);
  }
}

export default InputScreen;
