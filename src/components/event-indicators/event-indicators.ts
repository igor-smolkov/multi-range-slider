import './event-indicators.scss';

import '../form-set/form-set';

class EventIndicators {
  private _$elem: JQuery<HTMLElement>

  constructor() {
    this._$elem = $('.js-event-indicators');
  }

  public blinkInit(): void {
    const $radio = this._$elem.find('.js-init-blink');
    $radio.addClass('event-indicators__line_blink');
    setTimeout(() => $radio.removeClass('event-indicators__line_blink'), 500);
  }

  public blinkUpdate(): void {
    const $radio = this._$elem.find('.js-update-blink');
    $radio.addClass('event-indicators__line_blink');
    setTimeout(() => $radio.removeClass('event-indicators__line_blink'), 500);
  }
}

export default EventIndicators;
