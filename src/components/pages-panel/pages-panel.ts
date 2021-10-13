import $ from 'jquery';

class PagesPanel {
  private _$elem: JQuery<HTMLElement>

  constructor() {
    this._$elem = $('.js-pages-panel');
  }

  public hideToggle(): void {
    this._$elem.toggleClass('pages-panel_none');
  }
}

export default PagesPanel;
