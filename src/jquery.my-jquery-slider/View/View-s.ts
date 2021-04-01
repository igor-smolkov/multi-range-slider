import Presenter from '../Presenter';
import IView from './IView-s';
import './view__slider.scss';
import './view__bar.scss';

class View {
    presenter :Presenter;
    root :HTMLElement;
    slider :HTMLButtonElement;
    bars :Array<HTMLButtonElement>;
    current :number;
    isBarProcessed :boolean;
    constructor(data :IView, root :HTMLElement, presenter :Presenter) {
        this.presenter = presenter;
        this.root = root;
        this.current = data.current;
        this.slider = this.makeSlider();
        this.bars = this.makeBars(data.widths);
        this.isBarProcessed = false;
        this.render();
    }
    makeSlider() {
        const slider = document.createElement('button');
        slider.classList.add('view__slider');
        slider.addEventListener('click', (e) => this.handleSliderClick(e));
        return slider;
    }
    handleSliderClick(e :MouseEvent) {
        console.log('handleSliderClick');
        if (this.isBarProcessed) {
            this.isBarProcessed = false;
            return;
        }
        const xFromSliderBegin = e.clientX - this.slider.getBoundingClientRect().left;
        this.presenter.select(this.bars.length-1);
        this.presenter.setCurrent(
            this._calcPer(xFromSliderBegin)
        );
    }
    makeBars(widths :Array<number>) {
        const bars :Array<HTMLButtonElement> = [];
        let left = 0;
        widths.forEach((width, index) => {
            const bar = this.makeBar(width-left, index);
            bar.style.left = `${left}%`;
            bars.push(bar);
            left += width;
        });
        return bars;
    }
    makeBar(width :number, index :number) {
        const bar = document.createElement('button');
        bar.classList.add('view__bar');
        if (index === this.current) {
            bar.classList.add('view__bar_active');
        }
        bar.style.width = `${width}%`;
        bar.addEventListener('click', (e) => this.handleBarClick(e, index));
        return bar;
    }
    handleBarClick(e :MouseEvent, index :number) {
        this.isBarProcessed = true;
        console.log('handleBarClick');
        this.presenter.select(index);
        const xFromSliderBegin = e.clientX - this.slider.getBoundingClientRect().left;
        this.presenter.setCurrent(
            this._calcPer(xFromSliderBegin)
        )
        // console.log(this._calcPer(xFromSliderBegin));
    }
    render() {
        this.root.innerHTML = '';
        this.bars.forEach(bar => this.slider.append(bar));
        this.root.append(this.slider);
    }
    renderBars(widths :Array<number>) {
        let left = 0;
        widths.forEach((width, index) => {
            this.bars[index].style.width = `${width-left}%`;
            this.bars[index].style.left = `${left}%`;
            left += width;
        })
    }
    renderBar(index :number) {
        this.bars[index].classList.toggle('view__bar_active');
    }
    update(data :IView) {
        if (data.current || data.current === 0) {
            const prev = this.current;
            this.current = data.current;
            this.renderBar(prev);
            this.renderBar(data.current);
        }
        if (data.widths) {
            this.renderBars(data.widths);
        }
    }
    _calcPer(pixels :number) {
        const width = this.slider.getBoundingClientRect().width;
        return pixels / width * 100;
    }
}

export default View;