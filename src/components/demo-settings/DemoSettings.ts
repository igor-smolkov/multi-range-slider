import $ from 'jquery';

class DemoSettings {
  private $elem: JQuery<HTMLElement> = $('.js-demo-settings');

  constructor() {
    this.onMoreSliders(this.toggleSliders.bind(this));
  }

  public onOptions(callback: () => unknown): void {
    this.$elem.find('[name="options"]').on('change', callback);
  }

  public onDemoMode(callback: () => unknown): void {
    this.$elem.find('[name="demo-mode"]').on('change', callback);
  }

  public onMoreSliders(callback: () => unknown): void {
    this.$elem.find('[name="more-sliders"]').on('change', callback);
  }

  public onCurrent(callback: () => unknown): void {
    this.$elem.find('[name="current"]').on('change', callback);
  }

  public onDemoOrientation(callback: () => unknown): void {
    this.$elem
      .find('[name="demo-orientation"]')
      .on('change', callback);
  }

  public onInputPanel(callback: () => unknown): void {
    this.$elem.find('[name="input-panel"]').on('change', callback);
  }

  public onOutputPanel(callback: () => unknown): void {
    this.$elem.find('[name="output-panel"]').on('change', callback);
  }

  public onEventPanel(callback: () => unknown): void {
    this.$elem.find('[name="event-panel"]').on('change', callback);
  }

  public checkOptions(): boolean {
    return this.$elem.find('[name="options"]').is(':checked');
  }

  public checkDemoMode(): 'init' | 'update' {
    return this.$elem.find('[name="demo-mode"]:checked').val() as
      | 'init'
      | 'update';
  }

  public checkMoreSliders(): boolean {
    return this.$elem.find('[name="more-sliders"]').is(':checked');
  }

  public checkCurrent(): 0 | 1 | 2 | 3 {
    return Number(this.$elem.find('[name="current"]:checked').val()) as
      | 0
      | 1
      | 2
      | 3;
  }

  public checkDemoOrientation(): 'row' | 'col' {
    return this.$elem
      .find('[name="demo-orientation"]:checked')
      .val() as 'row' | 'col';
  }

  public checkDoubleSync(): boolean {
    return this.$elem.find('[name="double-sync"]').is(':checked');
  }

  public checkInputPanel(): boolean {
    return this.$elem.find('[name="input-panel"]').is(':checked');
  }

  public checkOutputPanel(): boolean {
    return this.$elem.find('[name="output-panel"]').is(':checked');
  }

  public checkEventPanel(): boolean {
    return this.$elem.find('[name="event-panel"]').is(':checked');
  }

  private toggleSliders() {
    if (this.checkMoreSliders()) this.slidersEnable();
    else this.slidersDisable();
  }

  private slidersEnable() {
    this.$elem
      .find('[name="current"]')
      .each((_, el) => el.removeAttribute('disabled'));
  }

  private slidersDisable() {
    this.$elem.find('[name="current"]').each((i, el) => {
      if (i === 0) $(el).prop('checked', true);
      el.setAttribute('disabled', 'true');
    });
  }
}

export default DemoSettings;
