import Slider from './slider';

(function($){
    $.fn.myJquerySlider = function(options: {
        minValue: number;
        maxValue: number;
        step?: number;
    }){

        let sliderId: number = 0;
        const make = () => {
            const slider = new Slider(this[sliderId++], options);
        };

        return this.each(make);
    };
})(jQuery);