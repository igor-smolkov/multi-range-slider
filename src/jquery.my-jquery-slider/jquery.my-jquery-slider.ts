import $ from 'jquery';
import { Presenter } from './Presenter';
import TMyJQuerySlider from './TMyJQuerySlider';

{
  const sliders = new Map();
  $.fn.myJQuerySlider = function myJQuerySlider(options: TMyJQuerySlider = {}) {
    return this.each(function workWithElem() {
      if (!sliders.has(this)) {
        console.log('init', options);
        sliders.set(this, new Presenter(this, options));
      } else {
        console.log('update');
        sliders.get(this).update(options);
      }
    });
  };
}
