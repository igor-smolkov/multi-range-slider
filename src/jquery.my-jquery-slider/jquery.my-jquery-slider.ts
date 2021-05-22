import Presenter from './Presenter'

(function($){
    const sliders = new Map();
    $.fn.myJquerySlider = function(options :IMyJquerySlider) {
        return this.each(function() {
            if(!sliders.has(this)) {
                sliders.set(this, new Presenter(this, options));
            } else {
                sliders.get(this).update(this, options);
            }
        });
    };
})(jQuery);