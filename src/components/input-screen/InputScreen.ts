import $ from 'jquery';

import TMyJQuerySlider from '../../jquery.my-jquery-slider/TMyJQuerySlider';
import inputScreenClassNames from './utils/inputScreenClassNames';

class InputScreen {
  private _$elem: JQuery<HTMLElement>;

  constructor() {
    this._$elem = $('.js-input-screen');
  }

  public showOptions(options: TMyJQuerySlider | null): void {
    this._$elem
      .find('.js-client-code-options')
      .removeClass(inputScreenClassNames.clientCodeOptionsNone);
    this._$elem
      .find('.js-client-code-default')
      .addClass(inputScreenClassNames.clientCodeDefaultNone);
    this._$elem
      .find('.js-input')
      .html(JSON.stringify(options, null, 2));
  }

  public showDefaults(): void {
    this._$elem
      .find('.js-client-code-options')
      .addClass(inputScreenClassNames.clientCodeOptionsNone);
    this._$elem
      .find('.js-client-code-default')
      .removeClass(inputScreenClassNames.clientCodeDefaultNone);
  }

  public setTitle(text: string): void {
    this._$elem.find('.js-form-set-title').text(text);
  }

  public hideToggle(): void {
    this._$elem.toggleClass(inputScreenClassNames.none);
  }
}

export default InputScreen;
