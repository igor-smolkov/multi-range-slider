import Slider from './slider';

(function($){
    $.fn.myJquerySlider = function(userOpt: ImyJquerySlider){

        const defaultOpt: ImyJquerySlider = {
            minValue: 0,
            maxValue: 100,
            curValue: 50,
            step: 1,
        }

        const fullOpt = () => {
            if (!userOpt) return defaultOpt;
            for (let key in defaultOpt) {
                if(!userOpt.hasOwnProperty(key)) { 
                    userOpt[key] = defaultOpt[key];
                }
                if(key === 'maxValue') {
                    userOpt.maxValue = userOpt.maxValue < userOpt.minValue ? 
                        userOpt.maxValue + userOpt.minValue : userOpt.maxValue;
                }
                if(key === 'curValue') {
                    userOpt.curValue = (userOpt.curValue < userOpt.minValue)||(userOpt.curValue > userOpt.maxValue) ? 
                        (userOpt.minValue + userOpt.maxValue)/2 : userOpt.curValue;
                }
                if(key === 'step') {
                    userOpt.step = userOpt.step > (userOpt.maxValue - userOpt.minValue) ? 
                        userOpt.maxValue - userOpt.minValue : userOpt.step;
                }
            }
            return userOpt;
        }

        let sliderId: number = 0;
        const make = () => {
            const slider = new Slider(
                this[sliderId++], 
                fullOpt()
            );
        };

        return this.each(make);
    };
})(jQuery);