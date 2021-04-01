import Presenter from '../Presenter';
import IView from './IView-s';
import './view__slider.scss';
import './view__bar.scss';

class View {
    presenter :Presenter;
    root :HTMLElement;
    slider :HTMLButtonElement;
    bar :HTMLButtonElement;
    constructor(data :IView, root :HTMLElement, presenter :Presenter) {
        this.presenter = presenter;
        this.root = root;
        this.slider = this.makeSlider();
        this.bar = this.makeBar(data.width);
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
        const xFromSliderBegin = e.clientX - this.slider.getBoundingClientRect().left;
        this.presenter.setCurrent(
            this._calcPer(xFromSliderBegin)
        );
    }
    makeBar(width :number) {
        const bar = document.createElement('button');
        bar.classList.add('view__bar');
        bar.style.width = `${width}%`;
        bar.addEventListener('click', (e) => this.handleBarClick(e));
        return bar;
    }
    handleBarClick(e :MouseEvent) {
        console.log('handleBarClick');
    }
    render() {
        this.root.innerHTML = '';
        this.slider.append(this.bar);
        this.root.append(this.slider);
    }
    renderBar(width :number) {
        this.bar.style.width = `${width}%`;
    }
    _calcPer(pixels :number) {
        const width = this.slider.getBoundingClientRect().width;
        return pixels / width * 100;
    }
}

export default View;