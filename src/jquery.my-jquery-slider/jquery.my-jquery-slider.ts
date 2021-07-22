import { Presenter } from './Presenter'
import { TMyJQuerySlider } from './TMyJQuerySlider';

(function($){

  const sliders = new Map();

  $.fn.myJQuerySlider = function(options :TMyJQuerySlider) {

    return this.each(function() {

      if(!sliders.has(this)) {
        sliders.set(this, new Presenter(this, options));
      } else {
        sliders.get(this).update(options);
      }
      
    });

  };

})(jQuery);