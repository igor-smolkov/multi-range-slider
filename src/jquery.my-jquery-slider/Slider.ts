export default class Slider {
    sliderElem :HTMLElement;
    rangeElem :HTMLInputElement;
    constructor(elem :HTMLElement, options: {
        minValue: number;
        maxValue: number;
    }) {
        this.sliderElem = elem;
        this.renderSlider();
        this.initRange(options.minValue, options.maxValue);

        this.sliderElem.addEventListener('change', ()=> {
            console.log(this.rangeElem.value);
        })
    }
    renderSlider() {
        this.rangeElem = document.createElement('input');
        this.rangeElem.type = 'range';

        this.sliderElem.append(this.rangeElem);
    }
    initRange(minValue :number = 0, maxValue :number = 100) {
        this.rangeElem.min = minValue.toString();
        this.rangeElem.max = maxValue.toString();
        this.rangeElem.step = '0.01';
        this.rangeElem.value = minValue.toString();
    }
}