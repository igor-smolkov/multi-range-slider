export default class Slider {
    sliderElem :HTMLElement;
    rangeElem :HTMLInputElement;
    constructor(elem :HTMLElement, options: ImyJquerySlider) {
        this.sliderElem = elem;
        this.renderSlider();
        this.initRange(options);

        this.sliderElem.addEventListener('change', ()=> {
            console.log(this.rangeElem.value);
        })
    }
    renderSlider() {
        this.rangeElem = document.createElement('input');
        this.rangeElem.type = 'range';

        this.sliderElem.append(this.rangeElem);
    }
    initRange(options: ImyJquerySlider) {
        this.rangeElem.min = options.minValue.toString();
        this.rangeElem.max = options.maxValue.toString();
        this.rangeElem.step = options.step.toString();
        this.rangeElem.value = options.curValue.toString();
    }
}