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

  public checkOptions(): boolean {
    return this._$elem.find('[name="options"]').is(':checked');
  }
}

export default DemoSettings;
