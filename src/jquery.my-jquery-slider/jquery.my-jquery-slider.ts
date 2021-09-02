import $ from 'jquery';
import { Presenter } from './Presenter';
import TMyJQuerySlider from './TMyJQuerySlider';

{
  const sliders = new Map();
  $.fn.myJQuerySlider = function myJQuerySlider(options: TMyJQuerySlider = {}) {
    return this.each(function workWithElem() {
      if (!sliders.has(this)) {
        sliders.set(this, new Presenter(this, options));
      } else {
        sliders.get(this).update(options);
      }
    });
  };
}
