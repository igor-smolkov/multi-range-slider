import $ from 'jquery';

import TMyJQuerySlider from '../../jquery.my-jquery-slider/TMyJQuerySlider';
import outputScreenClassNames from './utils/outputScreenClassNames';

class OutputScreen {
  private _$elem: JQuery<HTMLElement>;

  constructor() {
    this._$elem = $('.js-output-screen');
  }

  public show(options: TMyJQuerySlider): void {
    this._$elem
      .find('.js-output')
      .html(JSON.stringify(options, null, 2));
  }

  public hideToggle(): void {
    this._$elem.toggleClass(outputScreenClassNames.none);
  }
}

export default OutputScreen;
