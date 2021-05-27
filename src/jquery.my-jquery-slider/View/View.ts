import Presenter from '../Presenter';
import IView from './IView';
import './my-jquery-slider.scss';
import Slot from './Slot';
import Bar from './Bar';
import Thumb from './Thumb';
import Scale from './Scale';
import Label from './Label';

class View {
    presenter :Presenter;
    current :number;
    isVertical: boolean;
    root :HTMLElement;
    slot :Slot;
    bars :Array<Bar>;
    thumbs :Array<Thumb>;
    scale :Scale;
    label :Label;
    isProcessed :boolean;
    constructor(data :IView, presenter :Presenter) {
        const className = 'my-jquery-slider';
        this.presenter = presenter;
        this.current = data.current;
        this.isVertical = data.vertical;
        this.root = this.initRoot(root, data.lengthPx, data.indent);
        this.slot = new Slot(data.vertical, data.indent, this);
        this.bars = this.makeBars(data.perValues);
        this.thumbs = this.makeThumbs(data.perValues.length);
        this.scale = data.scale ? new Scale({
            min: data.min,
            max: data.max,
            step: data.step,
            list: data.list,
            sign: typeof(data.scale) === 'boolean' ? 'none' : data.scale,
            maxLengthPx: this._getMaxLength(),
            indent: data.indent,
        }, this) : null;
        this.label = data.label ? new Label(className) : null;
        this.isProcessed = true;
        document.addEventListener('pointermove', (e) => this.handlePointerMove(e));
        document.addEventListener('pointerup', this.handlePointerUp.bind(this));
        this.render();
    }
    initRoot(root :HTMLElement, lengthPx?: number, indent: boolean = true) {
        root.classList.add('my-jquery-slider');
        if(this.isVertical) {
            root.classList.add('my-jquery-slider_vertical');
            if (lengthPx) {
                root.style.minHeight = `${lengthPx}px`;
                root.style.height = `${lengthPx}px`;
            }
            if (!indent) {
                root.style.padding = '0';
            }
        } else {
            if (lengthPx) {
                root.style.minWidth = `${lengthPx}px`;
                root.style.width = `${lengthPx}px`;
            }
        }
        return root;
    }
    makeBars(perValues :Array<number>) {
        const bars :Array<Bar> = [];
        let indentPer = 0;
        perValues.forEach((perValue, index) => {
            const bar = new Bar({
                id: index,
                length: perValue-indentPer,
                isActive: index === this.current ? true : false,
                isActual: this._checkActual(index, perValues.length),
                isEven: (index + 1) % 2 === 0 ? true : false,
                isVertical: this.isVertical,
            }, this);
            bar.setIndentPer(indentPer);
            bars.push(bar);
            indentPer = perValue;
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
    handlePointerMove(e :MouseEvent) {
        if (this.isProcessed) return;
        e.preventDefault();
        this._sendPerValue(!this.isVertical ? e.clientX : e.clientY);
    }
    handlePointerUp() {
        if (this.isProcessed) return;
        this.isProcessed = true;
        this.thumbs[this.current].release();
        this.bars[this.current].release();
        this.slot.release();
    }
    handleSliderProcessed(clientCoord :number) {
        if (!this.bars[this.current].isProcessed || !this.thumbs[this.current].isProcessed) return;
        if (this.isProcessed) {
            const lastIndex = this.bars.length-1;
            const lastBarIndent = this.bars[lastIndex].getIndentPX();
            if (clientCoord < lastBarIndent && !this.isVertical) return;
            if (clientCoord > lastBarIndent && this.isVertical) return;
            this.thumbs[lastIndex].activate();
            this._sendPerValue(clientCoord);
        }
    }
    handleBarProcessed(clientCoord :number, index :number) {
        if (this.thumbs[index].isProcessed) {
            this.thumbs[index].activate();
            this._sendPerValue(clientCoord);
        }
    }
    handleThumbProcessed(index :number) {
        this.isProcessed = false;
        this.presenter.select(index);
    }
    handleScaleClick(value :number) {
        this.presenter.selectCloseOfValue(value);
        this.presenter.setValue(value);
    }
    update(data :IView) {
        if (data.current || data.current === 0) {
            const prev = this.current;
            this.current = data.current;
            this.renderBar(prev);
            this.renderBar(data.current);
        }
        if (data.perValues) {
            // this.label.showValue(data.value, this.thumbs[this.current].elem.getBoundingClientRect().left);
            this.renderBars(data.perValues);
        }
    }
    render() {
        this.root.innerHTML = '';
        this.bars.forEach((bar, index) => {
            bar.append(this.thumbs[index].elem);
            this.slot.append(bar.elem);
        });
        if (this.label) {
            this.root.append(this.label.elem);
        }
        if (this.scale) {
            this.root.append(this.scale.elem);
        }
        this.root.append(this.slot.elem);
    }
    renderBars(perValues :Array<number>) {
        let indentPer = 0;
        perValues.forEach((perValue, index) => {
            this.bars[index].setLengthPer(perValue-indentPer);
            this.bars[index].setIndentPer(indentPer);
            indentPer = perValue;
        })
    }
    renderBar(index :number) {
        this.bars[index].toggleActive();
    }
    getRoot() {
        return this.root;
    }
    _getMaxLength() {
        const padding = this.root.style.padding !== ''  ? parseInt(this.root.style.padding, 10) : 15;
        const rootSizes = this.root.getBoundingClientRect();
        return this.isVertical ? rootSizes.height - padding*2 : rootSizes.width - padding*2;
    }
    _sendPerValue(clientCoord :number) {
        const innerCoord = this.slot.getInnerCoord(clientCoord);
        const innerCoordPer = this._calcPer(innerCoord);
        this.presenter.setCurrent(innerCoordPer);
    }
    _calcPer(pixels :number) {
        const length = this.slot.getLengthPX();
        const calc = !this.isVertical ? pixels / length * 100 : 100 - (pixels / length * 100);
        return calc;
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