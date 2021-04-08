import Presenter from '../Presenter';
import IView from './IView';
import './my-jquery-slider.scss';
import Slider from './Slider';
import Bar from './Bar';
import Thumb from './Thumb';

class View {
    presenter :Presenter;
    root :HTMLElement;
    current :number;
    slider :Slider;
    bars :Array<Bar>;
    thumbs :Array<Thumb>;
    isBarProcessed :boolean;
    isThumbProcessed :boolean;
    constructor(data :IView, root :HTMLElement, presenter :Presenter) {
        this.presenter = presenter;
        this.root = root;
        this.current = data.current;
        this.slider = new Slider(this);
        this.bars = this.makeBars(data.perValues);
        this.thumbs = this.makeThumbs(data.perValues.length);
        this.isBarProcessed = false;
        this.isThumbProcessed = false;
        document.addEventListener('pointermove', (e) => this.handleDocPointerMove(e));
        document.addEventListener('pointerup', (e) => this.handleDocPointerUp(e));
        this.render();
    }
    makeBars(perValues :Array<number>) {
        const bars :Array<Bar> = [];
        let leftPer = 0;
        perValues.forEach((perValue, index) => {
            const bar = new Bar({
                id: index,
                width: perValue-leftPer,
                isActive: index === this.current ? true : false,
            }, this);
            bar.setLeftPer(leftPer);
            bars.push(bar);
            leftPer = perValue;
        });
        return bars;
    }
    makeThumbs(count :number) {
        const thumbs :Array<Thumb> = [];
        for(let i = 0; i < count; i++) {
            thumbs.push(new Thumb(i, this));
        }
        return thumbs;
    }
    handleDocPointerMove(e :MouseEvent) {
        if (this.isThumbProcessed) {
            e.preventDefault();
            const xFromSliderBegin = this.slider.getInnerX(e.clientX);
            this.presenter.setCurrent(
                this._calcPer(xFromSliderBegin)
            );
        }
    }
    handleDocPointerUp(e :MouseEvent) {
        this.isBarProcessed = false;
        this.isThumbProcessed = false;
    }
    handleSliderPointerDown(innerX :number) {
        if (this.isBarProcessed) {
            this.isBarProcessed = false;
            return;
        }
        if (!this.isThumbProcessed) {
            const xLastBar = this.bars[this.bars.length-1].getLeftPX();
            if (innerX > xLastBar) {
                this.isThumbProcessed = true;
                this.presenter.select(this.bars.length-1);
                this.presenter.setCurrent(
                    this._calcPer(innerX)
                );
            } 
        }
    }
    handleBarPointerDown(e :MouseEvent, index :number) {
        this.isBarProcessed = true;
        if (!this.isThumbProcessed) {
            this.isThumbProcessed = true;
            this.presenter.select(index);
            const xFromSliderBegin = this.slider.getInnerX(e.clientX);
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
            bar.append(this.thumbs[index].elem);
            this.slider.append(bar.elem);
        });
        this.root.append(this.slider.elem);
    }
    renderBars(perValues :Array<number>) {
        let leftPer = 0;
        perValues.forEach((perValue, index) => {
            this.bars[index].setWidthPer(perValue-leftPer);
            this.bars[index].setLeftPer(leftPer);
            leftPer = perValue;
        })
    }
    renderBar(index :number) {
        this.bars[index].toggleActive();
    }
    _calcPer(pixels :number) {
        const width = this.slider.getWidthPX();
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