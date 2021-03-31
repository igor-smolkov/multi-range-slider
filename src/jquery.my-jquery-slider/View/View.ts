import Presenter from '../Presenter';
import IView from './IView'
import IBar from './IBar'
import Bar from './Bar'

class View {
    presenter :Presenter;
    root :HTMLElement;
    slider :HTMLButtonElement;
    bars :Array<Bar>;
    currentIndex :number;
    constructor(data :IView, presenter :Presenter) {
        this.presenter = presenter;
        this.init(data);
        this.render();
    }
    init(data :IView) {
        this.root = data.root;
        this.slider = this.makeSlider();
        this.bars = this.makeBars(data.pairsValuePerValue, data.currentIndex);
        this.currentIndex = data.currentIndex;
    }
    makeSlider() {
        const slider = document.createElement('button');
        slider.style.position = 'relative';
        slider.style.top = '50px';
        slider.style.left = '0';
        slider.style.width = '1200px';
        slider.style.minHeight = '20px';
        slider.style.border = `1px solid black`;
        slider.addEventListener('click', (e) => this.handleSliderClick(e));
        return slider;
    }
    makeBars(pairsValuePerValue :Array< Array<number> >, currentIndex :number) {
        const bars :Array<Bar> = [];
        pairsValuePerValue.forEach((pairValuePerValue, index) => {
            const width = pairValuePerValue[1];
            const left = index !== 0 ? pairsValuePerValue[index-1][1] : 0;
            const isActive = index === currentIndex ? true : false;
            const isActual = this._checkActual(index, pairsValuePerValue.length);
            const isOdd = index % 2 !== 0 ? true : false;

            bars.push(new Bar({
                width: width, 
                left: left,
                isActive: isActive,
                isActual: isActual,
                isOdd: isOdd,
            }));
            bars[index].elem.addEventListener('click', (e) => this.handleBarClick(e, index));
        })
        return bars;
    }
    handleSliderClick(e :MouseEvent) {
        const fromLastBarBegin = e.clientX - this.bars[this.bars.length-1].elem.getBoundingClientRect().left;
        const lastBarWidth = this.bars[this.bars.length-1].elem.getBoundingClientRect().width;
        const fromLastBarEnd = fromLastBarBegin - lastBarWidth;
        const fromSliderBegin = e.clientX - this.slider.getBoundingClientRect().left;
        if (fromLastBarEnd > 0) {
            this.presenter.current(this.bars.length-1);
            this.presenter.setPerValue(this._calcPer(fromSliderBegin));
        }
    }
    handleBarClick(e :MouseEvent, index :number) {
        const fromSliderBegin = e.clientX - this.slider.getBoundingClientRect().left;
        console.log(fromSliderBegin);
        this.presenter.current(index);
        this.presenter.setPerValue(this._calcPer(fromSliderBegin));
    }
    render() {
        this.slider.innerHTML = '';
        this.bars.forEach(slot => {
            this.slider.append(slot.elem);
        })
        this.root.append(this.slider);
    }
    update(data :IView) {
        if (data.currentIndex || data.currentIndex === 0) {
            this.updateCurrentIndex(data.currentIndex);
        }
        if (data.pairsValuePerValue) {
            this.updateBars(data.pairsValuePerValue, this.currentIndex);
        }
    }
    updateCurrentIndex(newIndex :number) {
        this.bars[this.currentIndex].toggleActive();
        this.bars[newIndex].toggleActive();
        this.currentIndex = newIndex;
    }
    updateBars(pairsValuePerValue :Array< Array<number> >, currentIndex :number) {
        pairsValuePerValue.forEach((pairValuePerValue, index) => {
            const width = pairValuePerValue[1];
            const left = index !== 0 ? pairsValuePerValue[index-1][1] : 0;
            const isActive = index === currentIndex ? true : false;
            const isActual = this._checkActual(index, pairsValuePerValue.length);
            const isOdd = index % 2 !== 0 ? true : false;
            this.bars[index].update({
                width: width, 
                left: left,
                isActive: isActive,
                isActual: isActual,
                isOdd: isOdd,
            });
        })
    }
    getRoot() {
        return this.root;
    }
    _checkActual(index :number, length :number) {
        const actuals = [];
        let isPrime = true;
        for(let i = 2; i < length; i++){
            if (length % i === 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) {
            for (let i = 0; i < length; i++) {
                if (length > 1) {
                    actuals.push(i === 0 ? false : true);
                } else {
                    actuals.push(true);
                }
            }
        } else {
            for (let i = length - 1; i > 0; i--) {
                if (length % i === 0) {
                    for (let j = 0; j < length; j++) {
                        actuals.push(j % i === 0 ? false : true);
                    }
                    break;
                }
            }
        }
        return actuals[index];
    }
    _calcPer(pixels :number) {
        const width = this.slider.getBoundingClientRect().width;
        return pixels / width * 100;
    }
}

export default View;