import Controller from './Controller-fd'

(function($){
    const sliders = new Map();
    $.fn.myJquerySlider = function(options :ImyJquerySlider) {
        return this.each(function() {
            if(!sliders.has(this)) {
                sliders.set(this, new Controller(this, options));
            } else {
                sliders.get(this).update(options);
            }
        });
    };
})(jQuery);