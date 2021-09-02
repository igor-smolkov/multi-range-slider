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

  public onDemoOrientation(callback: ()=>unknown): void {
    this._$elem.find('[name="demo-orientation"]').on('change', callback);
  }

  public checkOptions(): boolean {
    return this._$elem.find('[name="options"]').is(':checked');
  }

  public checkDemoMode(): 'init' | 'update' {
    return this._$elem.find('[name="demo-mode"]:checked').val() as 'init' | 'update';
  }

  public checkDemoOrientation(): 'row' | 'col' {
    return this._$elem.find('[name="demo-orientation"]:checked').val() as 'row' | 'col';
  }
}

export default DemoSettings;
