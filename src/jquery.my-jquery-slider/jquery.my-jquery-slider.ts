import Slider from './slider';

(function($){
    const sliders = new Map();
    $.fn.myJquerySlider = function(options :ImyJquerySlider) {
        return this.each(function() {
            if(!sliders.has(this)) {
                sliders.set(this, new Slider(this, options));
            } else {
                sliders.get(this).update(options);
                // return sliders.get(this).config
                // $(this).val(sliders.get(this).config.curValue);
            }
        });
    };
})(jQuery);