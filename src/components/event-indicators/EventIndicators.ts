import $ from 'jquery';

import eventIndicatorClassNames from './utils/eventIndicatorClassNames';

class EventIndicators {
  private _$elem: JQuery<HTMLElement>

  constructor() {
    this._$elem = $('.js-event-indicators');
  }

  public blinkInit(): void {
    const $radio = this._$elem.find('.js-init-blink');
    $radio.addClass(eventIndicatorClassNames.lineBlink);
    setTimeout(() => $radio.removeClass(eventIndicatorClassNames.lineBlink), 500);
  }

  public blinkUpdate(): void {
    const $radio = this._$elem.find('.js-update-blink');
    $radio.addClass(eventIndicatorClassNames.lineBlink);
    setTimeout(() => $radio.removeClass(eventIndicatorClassNames.lineBlink), 500);
  }

  public hideToggle(): void {
    this._$elem.toggleClass('event-indicators_none');
  }
}

export default EventIndicators;
