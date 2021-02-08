import Slider from './slider';

(function($){
    $.fn.myJquerySlider = function(userOpt: ImyJquerySlider){

        const defaultOpt: ImyJquerySlider = {
            minValue: 0,
            maxValue: 100,
            step: 1,
        }

        const fullOpt = (userOpt: ImyJquerySlider) => {
            for (let key in defaultOpt) {
                if(!userOpt.hasOwnProperty(key)) { 
                    userOpt[key] = defaultOpt[key];
                }
            }
            return userOpt;
        }

        let sliderId: number = 0;
        const make = () => {
            const slider = new Slider(
                this[sliderId++], 
                fullOpt(userOpt)
            );
        };

        return this.each(make);
    };
})(jQuery);