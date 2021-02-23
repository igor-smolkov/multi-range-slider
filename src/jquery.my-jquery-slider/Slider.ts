import './my-jquery-slider.scss'

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
    doubleRangeLeftElem :HTMLInputElement;
    doubleRangeRightElem :HTMLInputElement;
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

        this.init();
        // this.renderSlider();
        // this.initRange();

        // if (this.config.isInterval) {
        //     this.activeNow = 'nobody';
        //     this.doubleRangeElem.addEventListener('input', this.onInput.bind(this));
        //     this.doubleRangeElem.addEventListener('focus', () => { this.onFocus('doubleRangeElem') });
        //     this.rangeElem.addEventListener('focus', () => { this.onFocus('rangeElem') });
        //     this.doubleRangeElem.addEventListener('pointerup', this.onPointerUp.bind(this));
        //     this.rangeElem.addEventListener('pointerup', this.onPointerUp.bind(this));
        // }
    }
    init() {
        if(!this.elem.classList.contains('my-jquery-slider')) {
            this.elem.classList.add('my-jquery-slider');
        }
        if (!this.config.isInterval) {
            this.renderRangeElem();
            this.elem.append(this.rangeElem);
        } else {
            this.renderDoubleRangeElem();
            this.elem.append(this.rangeElem);
            this.elem.append(this.doubleRangeLeftElem);
            this.elem.append(this.doubleRangeRightElem);
        }
    }
    update(newOptions :ImyJquerySlider) {
        this.config = $.extend(this.config, newOptions);
        this.configCorrect();
        this.$elem.data(this.config);
        this.updateRanges();
    }
    updateRanges() {
        if (!this.config.isInterval) {
            this.setRangeOpt(this.rangeElem, {
                min: this.config.minValue,
                max: this.config.maxValue,
                step: this.config.step,
                value: this.config.curValue,
                orient: this.config.orientation,
            });
        } else {
            const middleInterval = +(this.config.minInterval + this.config.curValue / 2).toFixed(this.afterDotLen);
            const limit = this.activeNow === 'left-range' ? this.config.maxInterval : 
                this.activeNow === 'right-range' ? this.config.minInterval :
                middleInterval;
            this.doubleRangeLeftElem.style.width = this.calcLeftRangeWidth(limit)+'%';
            this.doubleRangeRightElem.style.width = (100-this.calcLeftRangeWidth(limit))+'%';
            this.setRangeOpt(this.doubleRangeLeftElem, {
                min: this.config.minValue,
                max: middleInterval,
                step: this.config.step,
                value: this.config.minInterval,
                orient: this.config.orientation,
            });
            this.setRangeOpt(this.doubleRangeRightElem, {
                min: middleInterval,
                max: this.config.maxValue,
                step: this.config.step,
                value: this.config.maxInterval,
                orient: this.config.orientation,
            });
        }
    }
    renderRangeElem() {
        this.rangeElem = document.createElement('input');
        this.rangeElem.type = 'range';

        this.setRangeOpt(this.rangeElem, {
            min: this.config.minValue,
            max: this.config.maxValue,
            step: this.config.step,
            value: this.config.curValue,
            orient: this.config.orientation,
        });

        this.rangeElem.addEventListener('input', this.onInput.bind(this));
    }
    renderDoubleRangeElem() {
        this.renderRangeElem();
        this.rangeElem.style.display = 'none';

        const middleInterval = +(this.config.minInterval + this.config.curValue / 2).toFixed(this.afterDotLen);

        this.doubleRangeLeftElem = document.createElement('input');
        this.doubleRangeLeftElem.type = 'range';
        this.doubleRangeLeftElem.style.left = '0';
        this.doubleRangeLeftElem.style.width = this.calcLeftRangeWidth(middleInterval)+'%';

        this.setRangeOpt(this.doubleRangeLeftElem, {
            min: this.config.minValue,
            max: middleInterval,
            step: this.config.step,
            value: this.config.minInterval,
            orient: this.config.orientation,
        });

        this.doubleRangeRightElem = document.createElement('input');
        this.doubleRangeRightElem.type = 'range';
        this.doubleRangeRightElem.style.right = '0';
        this.doubleRangeRightElem.style.width = (100-this.calcLeftRangeWidth(middleInterval))+'%';

        this.setRangeOpt(this.doubleRangeRightElem, {
            min: middleInterval,
            max: this.config.maxValue,
            step: this.config.step,
            value: this.config.maxInterval,
            orient: this.config.orientation,
        });

        this.activeNow = 'nobody';
        this.doubleRangeLeftElem.addEventListener('input', this.onInput.bind(this));
        this.doubleRangeRightElem.addEventListener('input', this.onInput.bind(this));
        this.doubleRangeLeftElem.addEventListener('focus', () => { this.onFocus('left-range') });
        this.doubleRangeRightElem.addEventListener('focus', () => { this.onFocus('right-range') });
        this.doubleRangeLeftElem.addEventListener('pointerup', this.onPointerUp.bind(this));
        this.doubleRangeRightElem.addEventListener('pointerup', this.onPointerUp.bind(this));
    }
    setRangeOpt(elem :HTMLInputElement, opts :ImyJquerySlider) {
        elem.min = opts.min.toString();
        elem.max = opts.max.toString();
        elem.step = opts.step.toString();
        elem.value = opts.value.toString();
        elem.setAttribute('orient', opts.orientation);
    }
    calcLeftRangeWidth(limit :number){
        return +((limit / (this.config.maxValue - this.config.minValue)) * 100).toFixed(this.afterDotLen);
    }
    onInput() {
        if (!this.config.isInterval) {
            this.update({curValue: +this.rangeElem.value});
        } else {
            this.update({
                minInterval: +this.doubleRangeLeftElem.value,
                maxInterval: +this.doubleRangeRightElem.value,
                curValue: +((+this.doubleRangeRightElem.value)-(+this.doubleRangeLeftElem.value)),
            });
        }
        this.$elem.trigger('my-jquery-slider.input');
    }
    onFocus(who:string) {
        this.activeNow = who;
        this.updateRanges();
    }
    onPointerUp() {
        if(this.activeNow === 'left-range') {
            this.doubleRangeLeftElem.blur();
        } else if (this.activeNow === 'right-range') {
            this.doubleRangeRightElem.blur();
        }
        this.activeNow = 'nobody';
        this.updateRanges();
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
    // renderSlider() {
    //     this.style = document.createElement('style');
    //     this.style.innerText = `
    //         :host {
    //             width: 100%;
    //             height: 20px;
    //         }
    //         input[type=range][orient=vertical] {
    //             writing-mode: bt-lr; /* IE */
    //             -webkit-appearance: slider-vertical; /* WebKit */
    //         }
    //         input[type=range] {
    //             width: 100%;
    //             position: absolute;
    //             right: 0;
    //         }
    //     `;

    //     this.elem.attachShadow({mode: 'open'});
    //     this.elem.shadowRoot.append(this.style);

    //     this.rangeElem = document.createElement('input');
    //     this.rangeElem.type = 'range';
    //     this.elem.shadowRoot.append(this.rangeElem);
    //     if (this.config.isInterval) {
    //         this.doubleRangeElem = document.createElement('input');
    //         this.doubleRangeElem.type = 'range';
    //         this.elem.shadowRoot.append(this.doubleRangeElem);

    //         this.style.innerText += `
    //             input[type=range]:nth-child(2) {
    //                 left: 0;
    //             }
    //         `;
    //     }
    // }
    // initRange() {
    //     this.rangeElem.min = this.config.minValue.toString();
    //     this.rangeElem.max = this.config.maxValue.toString();
    //     this.rangeElem.step = this.config.step.toString();
    //     this.rangeElem.value = this.config.curValue.toString();
    //     this.rangeElem.setAttribute('orient', this.config.orientation);

    //     if(this.config.isInterval) {
    //         const middleInterval = +(this.config.minInterval + this.config.curValue / 2).toFixed(this.afterDotLen);
    //         const fullInterval = this.config.maxValue - this.config.minValue;
    //         let rangeElemWidth = 100;

    //         if (this.activeNow === 'rangeElem') {
    //             rangeElemWidth = +((this.config.maxInterval / fullInterval) * 100).toFixed(this.afterDotLen);
    //             this.rangeElem.max = this.config.maxInterval.toString();
    //             this.doubleRangeElem.min = this.config.maxInterval.toString();
    //         } else if (this.activeNow === 'doubleRangeElem') {
    //             rangeElemWidth = +((this.config.minInterval / fullInterval) * 100).toFixed(this.afterDotLen);
    //             this.rangeElem.max = this.config.minInterval.toString();
    //             this.doubleRangeElem.min = this.config.minInterval.toString();
    //         } else {
    //             rangeElemWidth = +((middleInterval / fullInterval) * 100).toFixed(this.afterDotLen);
    //             this.rangeElem.max = middleInterval.toString();
    //             this.doubleRangeElem.min = middleInterval.toString();
    //         }

    //         this.rangeElem.value = this.config.minInterval.toString();
    //         this.rangeElem.style.width = `${rangeElemWidth}%`;

    //         this.doubleRangeElem.max = this.config.maxValue.toString();
    //         this.doubleRangeElem.step = this.config.step.toString();
    //         this.doubleRangeElem.value = this.config.maxInterval.toString();
    //         this.doubleRangeElem.setAttribute('orient', this.config.orientation);
            
    //         this.doubleRangeElem.style.width = `${100-rangeElemWidth}%`;
    //     }
    // }
}