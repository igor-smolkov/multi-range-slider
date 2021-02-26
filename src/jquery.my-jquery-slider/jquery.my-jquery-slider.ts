import Slider from './slider';
import View from './View';

(function($){
    const sliders = new Map();
    $.fn.myJquerySlider = function(options :ImyJquerySlider) {
        return this.each(function() {
            if(!sliders.has(this)) {
                sliders.set(this, new View(this, options));
            } else {
                sliders.get(this).update(options);
            }
        });
    };
})(jQuery);