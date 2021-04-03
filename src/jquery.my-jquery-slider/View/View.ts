import Presenter from '../Presenter';
import IView from './IView';
import './my-jquery-slider.scss';

class View {
    presenter :Presenter;
    root :HTMLElement;
    slider :HTMLDivElement;
    bars :Array<HTMLDivElement>;
    thumbs :Array<HTMLButtonElement>;
    current :number;
    isBarProcessed :boolean;
    isThumbProcessed :boolean;
    constructor(data :IView, root :HTMLElement, presenter :Presenter) {
        this.presenter = presenter;
        this.root = root;
        this.current = data.current;
        this.slider = this.makeSlider();
        this.bars = this.makeBars(data.perValues);
        this.thumbs = this.makeThumbs(data.perValues.length);
        this.isBarProcessed = false;
        this.isThumbProcessed = false;
        document.addEventListener('pointermove', (e) => this.handleDocPointerMove(e));
        document.addEventListener('pointerup', (e) => this.handleDocPointerUp(e));
        this.render();
    }
    makeSlider() {
        const slider = document.createElement('div');
        slider.classList.add('my-jquery-slider');
        slider.addEventListener('pointerdown', (e) => this.handleSliderPointerDown(e));
        return slider;
    }
    makeBars(perValues :Array<number>) {
        const bars :Array<HTMLDivElement> = [];
        let left = 0;
        perValues.forEach((perValue, index) => {
            const bar = this.makeBar(perValue-left, index);
            bar.style.left = `${left}%`;
            bars.push(bar);
            left = perValue;
        });
        return bars;
    }
    makeBar(width :number, index :number) {
        const bar = document.createElement('div');
        bar.classList.add('my-jquery-slider__bar');
        if (index === this.current) {
            bar.classList.add('my-jquery-slider__bar_active');
        }
        bar.style.width = `${width}%`;
        bar.addEventListener('pointerdown', (e) => this.handleBarPointerDown(e, index));
        return bar;
    }
    makeThumbs(count :number) {
        const thumbs :Array<HTMLButtonElement> = [];
        for(let i = 0; i < count; i++) {
            thumbs.push(this.makeThumb(i));
        }
        return thumbs;
    }
    makeThumb(index :number) {
        const thumb = document.createElement('button');
        thumb.classList.add('my-jquery-slider__thumb');
        thumb.addEventListener('pointerdown', (e) => this.handleThumbPointerDown(e, index));
        return thumb;
    }
    handleDocPointerMove(e :MouseEvent) {
        if (this.isThumbProcessed) {
            e.preventDefault();
            const xFromSliderBegin = e.clientX - this.slider.getBoundingClientRect().left;
            this.presenter.setCurrent(
                this._calcPer(xFromSliderBegin)
            );
        }
    }
    handleDocPointerUp(e :MouseEvent) {
        this.isBarProcessed = false;
        this.isThumbProcessed = false;
    }
    handleSliderPointerDown(e :MouseEvent) {
        if (this.isBarProcessed) {
            this.isBarProcessed = false;
            return;
        }
        if (!this.isThumbProcessed) {
            const xFromSliderBegin = e.clientX - this.slider.getBoundingClientRect().left;
            const xLastBar = this.bars[this.bars.length-1].getBoundingClientRect().left;
            if (xFromSliderBegin > xLastBar) {
                this.isThumbProcessed = true;
                this.presenter.select(this.bars.length-1);
                this.presenter.setCurrent(
                    this._calcPer(xFromSliderBegin)
                );
            } 
        }
    }
    handleBarPointerDown(e :MouseEvent, index :number) {
        this.isBarProcessed = true;
        if (!this.isThumbProcessed) {
            this.isThumbProcessed = true;
            this.presenter.select(index);
            const xFromSliderBegin = e.clientX - this.slider.getBoundingClientRect().left;
            this.presenter.setCurrent(
                this._calcPer(xFromSliderBegin)
            );
        }
    }
    handleThumbPointerDown(e :MouseEvent, index :number) {
        this.isThumbProcessed = true;
        this.presenter.select(index);
    }
    update(data :IView) {
        if (data.current || data.current === 0) {
            const prev = this.current;
            this.current = data.current;
            this.renderBar(prev);
            this.renderBar(data.current);
        }
        if (data.perValues) {
            this.renderBars(data.perValues);
        }
    }
    render() {
        this.root.innerHTML = '';
        this.bars.forEach((bar, index) => {
            bar.append(this.thumbs[index]);
            this.slider.append(bar);
        });
        this.root.append(this.slider);
    }
    renderBars(perValues :Array<number>) {
        let left = 0;
        perValues.forEach((perValue, index) => {
            this.bars[index].style.width = `${perValue-left}%`;
            this.bars[index].style.left = `${left}%`;
            left = perValue;
        })
    }
    renderBar(index :number) {
        this.bars[index].classList.toggle('my-jquery-slider__bar_active');
    }
    _calcPer(pixels :number) {
        const width = this.slider.getBoundingClientRect().width;
        return pixels / width * 100;
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
}

export default View;