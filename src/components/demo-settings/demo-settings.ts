import $ from 'jquery';

class DemoSettings {
  private _$elem: JQuery<HTMLElement>

  constructor() {
    this._$elem = $('.js-demo-settings');
    this.onMoreSliders(this._toggleSliders.bind(this));
  }

  public onOptions(callback: ()=>unknown): void {
    this._$elem.find('[name="options"]').on('change', callback);
  }

  public onDemoMode(callback: ()=>unknown): void {
    this._$elem.find('[name="demo-mode"]').on('change', callback);
  }

  public onMoreSliders(callback: ()=>unknown): void {
    this._$elem.find('[name="more-sliders"]').on('change', callback);
  }

  public onCurrent(callback: ()=>unknown): void {
    this._$elem.find('[name="current"]').on('change', callback);
  }

  public onDemoOrientation(callback: ()=>unknown): void {
    this._$elem.find('[name="demo-orientation"]').on('change', callback);
  }

  public onInputPanel(callback: ()=>unknown): void {
    this._$elem.find('[name="input-panel"]').on('change', callback);
  }

  public onOutputPanel(callback: ()=>unknown): void {
    this._$elem.find('[name="output-panel"]').on('change', callback);
  }

  public onEventPanel(callback: ()=>unknown): void {
    this._$elem.find('[name="event-panel"]').on('change', callback);
  }

  public checkOptions(): boolean {
    return this._$elem.find('[name="options"]').is(':checked');
  }

  public checkDemoMode(): 'init' | 'update' {
    return this._$elem.find('[name="demo-mode"]:checked').val() as 'init' | 'update';
  }

  public checkMoreSliders(): boolean {
    return this._$elem.find('[name="more-sliders"]').is(':checked');
  }

  public checkCurrent(): 0 | 1 | 2 | 3 {
    return +this._$elem.find('[name="current"]:checked').val() as 0 | 1 | 2 | 3;
  }

  public checkDemoOrientation(): 'row' | 'col' {
    return this._$elem.find('[name="demo-orientation"]:checked').val() as 'row' | 'col';
  }

  public checkDoubleSync(): boolean {
    return this._$elem.find('[name="double-sync"]').is(':checked');
  }

  public checkInputPanel(): boolean {
    return this._$elem.find('[name="input-panel"]').is(':checked');
  }

  public checkOutputPanel(): boolean {
    return this._$elem.find('[name="output-panel"]').is(':checked');
  }

  public checkEventPanel(): boolean {
    return this._$elem.find('[name="event-panel"]').is(':checked');
  }

  private _toggleSliders() {
    if (this.checkMoreSliders()) this._slidersEnable();
    else this._slidersDisable();
  }

  private _slidersEnable() {
    this._$elem.find('[name="current"]').each((_, el) => el.removeAttribute('disabled'));
  }

  private _slidersDisable() {
    this._$elem.find('[name="current"]').each((i, el) => {
      if (i === 0) $(el).prop('checked', true);
      el.setAttribute('disabled', 'true');
    });
  }
}

export default DemoSettings;
