import $ from 'jquery';

import { MultiRangeSliderConfig } from '../../jquery.multi-range-slider/MultiRangeSliderConfig';
import outputScreenClassNames from './utils/outputScreenClassNames';

class OutputScreen {
  private $elem: JQuery<HTMLElement>;

  constructor() {
    this.$elem = $('.js-output-screen');
  }

  public show(options: MultiRangeSliderConfig): void {
    this.$elem
      .find('.js-output')
      .html(JSON.stringify(options, null, 2));
  }

  public hideToggle(): void {
    this.$elem.toggleClass(outputScreenClassNames.none);
  }
}

export default OutputScreen;
