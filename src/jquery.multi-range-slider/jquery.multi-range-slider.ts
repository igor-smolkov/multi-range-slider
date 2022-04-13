import { Presenter } from './Presenter';
import { MultiRangeSliderConfig } from './MultiRangeSliderConfig';

function multiRangeSliderFactory(jQuery: JQueryStatic): void {
  const $ = jQuery;
  const sliders = new Map();
  $.fn.multiRangeSlider = function multiRangeSlider(options: unknown = {}) {
    return this.each(function workWithElem() {
      if (!sliders.has(this)) {
        sliders.set(
          this,
          new Presenter($(this), options as MultiRangeSliderConfig),
        );
      } else {
        sliders.get(this).update(options);
      }
    });
  };
}

export default multiRangeSliderFactory;
