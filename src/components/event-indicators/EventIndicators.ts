import $ from 'jquery';

import eventIndicatorClassNames from './utils/eventIndicatorClassNames';

class EventIndicators {
  private $elem: JQuery<HTMLElement>;

  constructor() {
    this.$elem = $('.js-event-indicators');
  }

  public blinkInit(): void {
    const $radio = this.$elem.find('.js-init-blink');
    $radio.addClass(eventIndicatorClassNames.lineBlink);
    setTimeout(
      () => $radio.removeClass(eventIndicatorClassNames.lineBlink),
      500,
    );
  }

  public blinkUpdate(): void {
    const $radio = this.$elem.find('.js-update-blink');
    $radio.addClass(eventIndicatorClassNames.lineBlink);
    setTimeout(
      () => $radio.removeClass(eventIndicatorClassNames.lineBlink),
      500,
    );
  }

  public hideToggle(): void {
    this.$elem.toggleClass(eventIndicatorClassNames.none);
  }
}

export default EventIndicators;
