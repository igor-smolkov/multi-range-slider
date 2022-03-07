import $ from 'jquery';

enum TogglerEvent {
  enable = 'enable',
  disable = 'disable',
}

interface IToggler {
  checkMin(): boolean;
  checkMax(): boolean;
  checkValue(): boolean;
  checkStep(): boolean;
  checkOrientation(): boolean;
  checkIsDouble(): boolean;
  checkMinInterval(): boolean;
  checkMaxInterval(): boolean;
  checkActiveRange(): boolean;
  checkLimits(): boolean;
  checkWithLabel(): boolean;
  checkLabel(): boolean;
  checkScale(): boolean;
  checkSegments(): boolean;
  checkWithNotch(): boolean;
  checkLabelsList(): boolean;
  checkActualRanges(): boolean;
  checkLengthPx(): boolean;
  checkWithIndent(): boolean;
}

class Toggler implements IToggler {
  private $elem: JQuery<HTMLElement> = $('.js-toggler');

  private subscribers: Set<(event: TogglerEvent, name: string) => unknown> = new Set();

  constructor() {
    this.init();
  }

  public subscribe(
    callback: (event: TogglerEvent, name: string) => unknown,
  ): void {
    this.subscribers.add(callback);
  }

  public unsubscribe(
    callback: (event: TogglerEvent, name: string) => unknown,
  ): void {
    this.subscribers.delete(callback);
  }

  public enable(): void {
    this.$elem.find('.js-form-set').prop('disabled', false);
  }

  public disable(): void {
    this.$elem.find('.js-form-set').prop('disabled', true);
  }

  public checkMin(): boolean {
    return this.$elem.find('[name="min"]').is(':checked');
  }

  public checkMax(): boolean {
    return this.$elem.find('[name="max"]').is(':checked');
  }

  public checkValue(): boolean {
    return this.$elem.find('[name="value"]').is(':checked');
  }

  public checkStep(): boolean {
    return this.$elem.find('[name="step"]').is(':checked');
  }

  public checkOrientation(): boolean {
    return this.$elem.find('[name="orientation"]').is(':checked');
  }

  public checkIsDouble(): boolean {
    return this.$elem.find('[name="is-double"]').is(':checked');
  }

  public checkMinInterval(): boolean {
    return this.$elem.find('[name="min-interval"]').is(':checked');
  }

  public checkMaxInterval(): boolean {
    return this.$elem.find('[name="max-interval"]').is(':checked');
  }

  public checkActiveRange(): boolean {
    return this.$elem.find('[name="active-range"]').is(':checked');
  }

  public checkLimits(): boolean {
    return this.$elem.find('[name="limits"]').is(':checked');
  }

  public checkWithLabel(): boolean {
    return this.$elem.find('[name="with-label"]').is(':checked');
  }

  public checkLabel(): boolean {
    return this.$elem.find('[name="label"]').is(':checked');
  }

  public checkScale(): boolean {
    return this.$elem.find('[name="scale"]').is(':checked');
  }

  public checkSegments(): boolean {
    return this.$elem.find('[name="segments"]').is(':checked');
  }

  public checkWithNotch(): boolean {
    return this.$elem.find('[name="with-notch"]').is(':checked');
  }

  public checkLabelsList(): boolean {
    return this.$elem.find('[name="labels-list"]').is(':checked');
  }

  public checkActualRanges(): boolean {
    return this.$elem.find('[name="actual-ranges"]').is(':checked');
  }

  public checkLengthPx(): boolean {
    return this.$elem.find('[name="length-px"]').is(':checked');
  }

  public checkWithIndent(): boolean {
    return this.$elem.find('[name="with-indent"]').is(':checked');
  }

  private init() {
    this.$elem.find('input').on('change', this.notify.bind(this));
  }

  private notify(e: Event) {
    const el = e.target as HTMLInputElement;
    this.subscribers.forEach((subscriber) => subscriber(
      el.checked ? TogglerEvent.enable : TogglerEvent.disable,
      el.getAttribute('name') as string,
    ));
  }
}

export { Toggler, IToggler, TogglerEvent };
