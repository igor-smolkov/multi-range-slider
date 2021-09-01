import './demo-settings.scss';

import '../form-set/form-set';
import '../toggle/toggle';

class DemoSettings {
  private _$elem: JQuery<HTMLElement>

  constructor() {
    this._$elem = $('.js-demo-settings');
  }

  public onOptions(callback: ()=>unknown): void {
    this._$elem.find('[name="options"]').on('change', callback);
  }

  public onDemoMode(callback: ()=>unknown): void {
    this._$elem.find('[name="demo-mode"]').on('change', callback);
  }

  public checkOptions(): boolean {
    return this._$elem.find('[name="options"]').is(':checked');
  }

  public checkDemoMode(): 'init' | 'update' {
    return this._$elem.find('[name="demo-mode"]:checked').val() as 'init' | 'update';
  }

  public blinkInit(): void {
    const $radio = this._$elem.find('[value="init"]');
    $radio.addClass('radio-group__box_blink');
    setTimeout(() => $radio.removeClass('radio-group__box_blink'), 500);
  }

  public blinkUpdate(): void {
    console.log('upd');
    const $radio = this._$elem.find('[value="update"]');
    $radio.addClass('radio-group__box_blink');
    setTimeout(() => $radio.removeClass('radio-group__box_blink'), 500);
  }
}

export default DemoSettings;
