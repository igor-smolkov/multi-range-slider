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
        this.root = data.root;
        this.bars = [];
        this.fill(data);
        this.render();
        this.subscribe();
    }
    fill(data :IView) {
        this.currentIndex = data.currentIndex;
        this.slider = this.makeSlider();

        data.pairsValuePerValue.forEach((pairValuePerValue, index) => {
            const width = pairValuePerValue[1];
            const left = index !== 0 ? data.pairsValuePerValue[index-1][1] : 0;
            const isActive = index === this.currentIndex ? true : false;
            const isActual = this.checkActual(index, data.pairsValuePerValue.length);
            const isOdd = index % 2 !== 0 ? true : false;

            this.bars.push(new Bar({
                width: width, 
                left: left,
                isActive: isActive,
                isActual: isActual,
                isOdd: isOdd,
            }));
        })
    }
    checkActual(index :number, length :number) {
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
    subscribe() {
        this.slider.addEventListener('click', (e)=>{
            const fromLastBarBegin = e.clientX - this.bars[this.bars.length-1].elem.getBoundingClientRect().left;
            const lastBarWidth = this.bars[this.bars.length-1].elem.getBoundingClientRect().width;
            const fromLastBarEnd = fromLastBarBegin - lastBarWidth;
            const fromSliderBegin = e.clientX - this.slider.getBoundingClientRect().left;
            if (fromLastBarEnd > 0) {
                this.presenter.current(this.bars.length-1);
                this.presenter.setPerValue(this.calcPer(fromSliderBegin));
            }   
        });
    }
    calcPer(pixels :number) {
        const width = this.slider.getBoundingClientRect().width;
        return pixels / width * 100;
    }
    render() {
        this.bars.forEach(slot => {
            this.slider.append(slot.elem);
        })
        this.root.append(this.slider);
    }
    makeSlider() {
        const slider = document.createElement('button');
        slider.style.position = 'relative';
        slider.style.top = '50px';
        slider.style.left = '0';
        slider.style.width = '1200px';
        slider.style.minHeight = '20px';
        slider.style.border = `1px solid black`;
        return slider;
    }
    setCurrentIndex(index :number) {
        this.bars[this.currentIndex].toggleActive();
        this.currentIndex = index;
        this.bars[this.currentIndex].toggleActive();
    }
    setValue(value :number, perValue :number) {
        this.bars[this.currentIndex].setWidth(perValue);
    }
    getRoot() {
        return this.root;
    }
}

export default View;