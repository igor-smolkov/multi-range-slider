export default class Slider {
    defaults :ImyJquerySlider = {
        minValue: 0,
        maxValue: 100,
        curValue: 50,
        isInterval: false,
        minInterval: 25,
        maxInterval: 75,
        step: 1,
        orientation: 'horizontal'
    }
    options :ImyJquerySlider;
    metadata :ImyJquerySlider;
    config :ImyJquerySlider;
    elem :HTMLElement;
    $elem :JQuery;
    rangeElem :HTMLInputElement;
    doubleRangeElem :HTMLInputElement;
    style: HTMLStyleElement;
    activeNow: string;
    afterDotLen: number;
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

        this.rangeElem.addEventListener('input', this.onInput.bind(this));
        if (this.config.isInterval) {
            this.activeNow = 'nobody';
            this.doubleRangeElem.addEventListener('input', this.onInput.bind(this));
            this.doubleRangeElem.addEventListener('focus', () => { this.onFocus('doubleRangeElem') });
            this.rangeElem.addEventListener('focus', () => { this.onFocus('rangeElem') });
            this.doubleRangeElem.addEventListener('pointerup', this.onPointerUp.bind(this));
            this.rangeElem.addEventListener('pointerup', this.onPointerUp.bind(this));
        }
    }
    onInput() {
        if (this.config.isInterval) {
            this.update({
                minInterval: +this.rangeElem.value,
                maxInterval: +this.doubleRangeElem.value,
                curValue: +((+this.doubleRangeElem.value)-(+this.rangeElem.value)),
            });
        } else {
            this.update({curValue: +this.rangeElem.value});
        }
        this.$elem.trigger('my-jquery-slider.input');
    }
    onFocus(who:string) {
        this.activeNow = who;
        this.initRange();
        console.log('zaz');
    }
    onPointerUp() {
        if(this.activeNow === 'rangeElem') {
            this.rangeElem.blur();
        } else if (this.activeNow === 'doubleRangeElem') {
            this.doubleRangeElem.blur();
        }
        this.activeNow = 'nobody';
        this.initRange();
    }
    configCorrect() {
        this.config.maxValue = this.config.maxValue < this.config.minValue ? 
            this.config.maxValue + this.config.minValue : this.config.maxValue;
        if (this.config.isInterval) {
            this.config.maxInterval = this.config.maxInterval > this.config.maxValue ?
                this.config.maxValue : this.config.maxInterval;
            this.config.minInterval = this.config.minInterval < this.config.minValue ?
                this.config.minValue : this.config.minInterval;
            if (this.config.maxInterval < this.config.minInterval) {
                const swap :number = this.config.maxInterval;
                this.config.maxInterval = this.config.minInterval;
                this.config.minInterval = swap;
            }
            this.config.curValue = this.config.maxInterval - this.config.minInterval
        } else {
            this.config.curValue = (this.config.curValue < this.config.minValue)||(this.config.curValue > this.config.maxValue) ? 
                (this.config.minValue + this.config.maxValue)/2 : this.config.curValue;
            this.config.maxInterval = this.config.minInterval = this.config.curValue;
        }
        this.config.step = this.config.step > (this.config.maxValue - this.config.minValue) ? 
            this.config.maxValue - this.config.minValue : this.config.step;
        this.afterDotLen = this.config.step.toString().includes('.') ? this.config.step.toString().split('.').pop().length : 0;
        this.config.curValue = +this.config.curValue.toFixed(this.afterDotLen);
        this.config.orientation = (this.config.orientation !== 'horizontal')&&(this.config.orientation !== 'vertical') ? 
            'horizontal' : this.config.orientation;
    }
    update(newOptions :ImyJquerySlider) {
        this.config = $.extend(this.config, newOptions);
        this.configCorrect();
        this.$elem.data(this.config);
        this.initRange();
    }
    renderSlider() {
        this.style = document.createElement('style');
        this.style.innerText = `
            :host {
                width: 100%;
                height: 20px;
            }
            input[type=range][orient=vertical] {
                writing-mode: bt-lr; /* IE */
                -webkit-appearance: slider-vertical; /* WebKit */
            }
            input[type=range] {
                width: 100%;
                position: absolute;
                right: 0;
            }
        `;

        this.elem.attachShadow({mode: 'open'});
        this.elem.shadowRoot.append(this.style);

        this.rangeElem = document.createElement('input');
        this.rangeElem.type = 'range';
        this.elem.shadowRoot.append(this.rangeElem);
        if (this.config.isInterval) {
            this.doubleRangeElem = document.createElement('input');
            this.doubleRangeElem.type = 'range';
            this.elem.shadowRoot.append(this.doubleRangeElem);

            this.style.innerText += `
                input[type=range]:nth-child(2) {
                    left: 0;
                }
            `;
        }
    }
    initRange() {
        this.rangeElem.min = this.config.minValue.toString();
        this.rangeElem.max = this.config.maxValue.toString();
        this.rangeElem.step = this.config.step.toString();
        this.rangeElem.value = this.config.curValue.toString();
        this.rangeElem.setAttribute('orient', this.config.orientation);

        if(this.config.isInterval) {
            const middleInterval = +(this.config.minInterval + this.config.curValue / 2).toFixed(this.afterDotLen);
            const fullInterval = this.config.maxValue - this.config.minValue;
            let rangeElemWidth = 100;

            if (this.activeNow === 'rangeElem') {
                rangeElemWidth = +((this.config.maxInterval / fullInterval) * 100).toFixed(this.afterDotLen);
                this.rangeElem.max = this.config.maxInterval.toString();
                this.doubleRangeElem.min = this.config.maxInterval.toString();
            } else if (this.activeNow === 'doubleRangeElem') {
                rangeElemWidth = +((this.config.minInterval / fullInterval) * 100).toFixed(this.afterDotLen);
                this.rangeElem.max = this.config.minInterval.toString();
                this.doubleRangeElem.min = this.config.minInterval.toString();
            } else {
                rangeElemWidth = +((middleInterval / fullInterval) * 100).toFixed(this.afterDotLen);
                this.rangeElem.max = middleInterval.toString();
                this.doubleRangeElem.min = middleInterval.toString();
            }

            this.rangeElem.value = this.config.minInterval.toString();
            this.rangeElem.style.width = `${rangeElemWidth}%`;

            this.doubleRangeElem.max = this.config.maxValue.toString();
            this.doubleRangeElem.step = this.config.step.toString();
            this.doubleRangeElem.value = this.config.maxInterval.toString();
            this.doubleRangeElem.setAttribute('orient', this.config.orientation);
            
            this.doubleRangeElem.style.width = `${100-rangeElemWidth}%`;
        }
    }
}