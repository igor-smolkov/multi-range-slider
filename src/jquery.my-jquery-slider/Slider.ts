export default class Slider {
    defaults :ImyJquerySlider = {
        minValue: 0,
        maxValue: 100,
        curValue: 50,
        step: 1,
    }
    options :ImyJquerySlider;
    metadata :ImyJquerySlider;
    config :ImyJquerySlider;
    elem :HTMLElement;
    $elem :JQuery;
    rangeElem :HTMLInputElement;
    
    constructor(elem :HTMLElement, options :ImyJquerySlider) {
        this.elem = elem;
        this.$elem = $(elem);
        this.options = options;
        this.metadata = this.$elem.data( 'options' );

        this.config = $.extend({}, this.defaults, this.metadata, this.options);
        this.configCorrect();
        this.$elem.data(this.config);

        this.renderSlider();
        this.initRange();

        this.elem.addEventListener('change', ()=> {
            this.update({curValue: +this.rangeElem.value});
            this.$elem.trigger('my-jquery-slider.change');
        })
    }
    configCorrect() {
        this.config.maxValue = this.config.maxValue < this.config.minValue ? 
            this.config.maxValue + this.config.minValue : this.config.maxValue;
        this.config.curValue = (this.config.curValue < this.config.minValue)||(this.config.curValue > this.config.maxValue) ? 
            (this.config.minValue + this.config.maxValue)/2 : this.config.curValue;
        this.config.step = this.config.step > (this.config.maxValue - this.config.minValue) ? 
            this.config.maxValue - this.config.minValue : this.config.step;
    }
    update(newOptions :ImyJquerySlider) {
        this.config = $.extend(this.config, newOptions);
        this.configCorrect();
        this.$elem.data(this.config);
        this.initRange();
    }
    renderSlider() {
        this.rangeElem = document.createElement('input');
        this.rangeElem.type = 'range';

        this.elem.append(this.rangeElem);
    }
    initRange() {
        this.rangeElem.min = this.config.minValue.toString();
        this.rangeElem.max = this.config.maxValue.toString();
        this.rangeElem.step = this.config.step.toString();
        this.rangeElem.value = this.config.curValue.toString();
    }
}