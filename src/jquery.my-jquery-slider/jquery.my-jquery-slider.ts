import { Presenter } from './Presenter';
import { TMyJQuerySlider } from './TMyJQuerySlider';

function myJQuerySliderFactory(jQuery: JQueryStatic): void {
  const $ = jQuery;
  const sliders = new Map();
  $.fn.myJQuerySlider = function myJQuerySlider(options: unknown = {}) {
    return this.each(function workWithElem() {
      if (!sliders.has(this)) {
        sliders.set(
          this,
          new Presenter($(this), options as TMyJQuerySlider),
        );
      } else {
        sliders.get(this).update(options);
      }
    });
  };
}

export default myJQuerySliderFactory;
