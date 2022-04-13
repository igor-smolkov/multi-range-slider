import $ from 'jquery';

import { MultiRangeSliderConfig } from '../../jquery.multi-range-slider/MultiRangeSliderConfig';
import inputScreenClassNames from './utils/inputScreenClassNames';

class InputScreen {
  private $elem: JQuery<HTMLElement>;

  constructor() {
    this.$elem = $('.js-input-screen');
  }

  public showOptions(options: MultiRangeSliderConfig | null): void {
    this.$elem
      .find('.js-client-code-options')
      .removeClass(inputScreenClassNames.clientCodeOptionsNone);
    this.$elem
      .find('.js-client-code-default')
      .addClass(inputScreenClassNames.clientCodeDefaultNone);
    this.$elem
      .find('.js-input')
      .html(JSON.stringify(options, null, 2));
  }

  public showDefaults(): void {
    this.$elem
      .find('.js-client-code-options')
      .addClass(inputScreenClassNames.clientCodeOptionsNone);
    this.$elem
      .find('.js-client-code-default')
      .removeClass(inputScreenClassNames.clientCodeDefaultNone);
  }

  public setTitle(text: string): void {
    this.$elem.find('.js-form-set-title').text(text);
  }

  public hideToggle(): void {
    this.$elem.toggleClass(inputScreenClassNames.none);
  }
}

export default InputScreen;
