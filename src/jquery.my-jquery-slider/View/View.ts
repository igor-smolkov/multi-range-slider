import {Presenter} from '../Presenter';
import {IView} from './IView';
import './my-jquery-slider.scss';
import Slot from './Slot';
import Bar from './Bar';
import Thumb from './Thumb';
import Scale from './Scale';
import Label from './Label';

class View {
    private _presenter: Presenter;
    private _root: HTMLElement;
    private _slot: Slot;
    private _bars: Bar[];
    private _thumbs: Thumb[];
    private _scale: Scale;
    private _label: Label;
    private _isProcessed: boolean;
    private _isVertical: boolean;
    current :number;
    constructor(options: IView, presenter: Presenter) {
        this._presenter = presenter;
        this._render(options);
        this._isProcessed = true;
        document.addEventListener('pointermove', (e) => this._handlePointerMove(e));
        document.addEventListener('pointerup', this._handlePointerUp.bind(this));
    }
    public update(options: IView) {
        const config = Object.assign({}, options);
        config.orientation = options.orientation ? options.orientation : this.getOrientation();
        config.withLabel = options.withLabel ? options.withLabel : this.checkLabel();
        config.scale = options.scale ? options.scale : this.getScaleType();
        config.lengthPx = options.lengthPx ? options.lengthPx : this.getLengthPx(options.orientation === 'vertical' ? true : false);
        config.withIndent = options.withIndent ? options.withIndent : this.checkIndent(options.orientation === 'vertical' ? true : false);
        this._render(config);
    }
    public getOrientation() {
        return this._isVertical ? 'vertical' : 'horizontal';
    }
    public checkLabel() {
        return this._label !== null ? true : false;
    }
    public getScaleType() {
        return this._scale === null ? undefined : this._scale.getType()
    }
    public getLengthPx(isVertical: boolean) {
        const padding = this._root.style.padding !== ''  ? parseInt(this._root.style.padding, 10) : 15;
        const rootSizes = this._root.getBoundingClientRect();
        return isVertical ? rootSizes.height - padding*2 : rootSizes.width - padding*2;
    }
    public checkIndent(isVertical: boolean) {
        const rootSizes = this._root.getBoundingClientRect();
        const slotLength = this._slot.getLengthPX();
        if (isVertical) {
            return rootSizes.width !== slotLength ? true : false; 
        } else {
            return rootSizes.height !== slotLength ? true : false;
        }
    }
    public getRoot() {
        return this._root;
    }
    private _render(options: IView) {
        const className = 'my-jquery-slider';
        this._isVertical = options.orientation === 'vertical' ? true : false;
        this._root = this._configurateRoot(options.root, className, this._isVertical, options.lengthPx, options.withIndent);
        this._slot = new Slot(this._isVertical, options.withIndent, this);
        this._bars = this._makeBars(options.perValues, options.active, this._isVertical);
        this._thumbs = this._makeThumbs(options.perValues.length);
        const LengthPx = this.getLengthPx(this._isVertical);
        this._scale = options.scale ? this._makeScale(options, LengthPx) : null;
        this._label = options.withLabel ? new Label(className) : null;
        this._draw();
    }
    private _configurateRoot(root: HTMLElement, className: string, isVertical: boolean, lengthPx?: number, indent: boolean = true) {
        root.classList.add(className);
        if(isVertical) {
            root.classList.add(`${className}_vertical`);
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
    private _makeBars(perValues: number[], active: number, isVertical: boolean) {
        const bars: Bar[] = [];
        let indentPer = 0;
        perValues.forEach((perValue, index) => {
            const bar = new Bar({
                id: index,
                length: perValue-indentPer,
                isActive: index === active ? true : false,
                isActual: this._checkActual(index, perValues.length),
                isEven: (index + 1) % 2 === 0 ? true : false,
                isVertical: isVertical,
            }, this);
            bar.setIndentPer(indentPer);
            bars.push(bar);
            indentPer = perValue;
        });
        return bars;
    }
    private _checkActual(index: number, length: number) {
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
    private _makeThumbs(count: number) {
        const thumbs :Array<Thumb> = [];
        for(let i = 0; i < count; i++) {
            thumbs.push(new Thumb(i, this));
        }
        return thumbs;
    }
    private _makeScale(options: IView, maxLengthPx: number) {
        return new Scale({
            min: options.min,
            max: options.max,
            step: options.step,
            list: options.list,
            sign: (options.scale === 'numeric')||(options.scale === 'named') ? options.scale : 'none',
            maxLengthPx: maxLengthPx,
            withIndent: options.withIndent,
        }, this)
    }
    private _handlePointerMove(e: MouseEvent) {
        if (this._isProcessed) return;
        e.preventDefault();
        this._sendPerValue(!this.isVertical ? e.clientX : e.clientY);
    }
    private _sendPerValue(clientCoord: number) {
        const innerCoord = this._slot.getInnerCoord(clientCoord);
        const innerCoordPer = this._calcPer(innerCoord);
        this._presenter.setPerValue(innerCoordPer);
    }
    private _calcPer(pixels :number) {
        const length = this._slot.getLengthPX();
        const calc = !this._isVertical ? pixels / length * 100 : 100 - (pixels / length * 100);
        return calc;
    }
    private _handlePointerUp() {
        if (this._isProcessed) return;
        this._isProcessed = true;
        this._thumbs[this.current].release();
        this._bars[this.current].release();
        this._slot.release();
    }
    private _draw() {
        this._root.innerHTML = '';
        this._bars.forEach((bar, index) => {
            bar.append(this._thumbs[index].getElem());
            this._slot.append(bar.elem);
        });
        if (this._label) {
            this._root.append(this._label.getElem());
        }
        if (this._scale) {
            this._root.append(this._scale.getElem());
        }
        this._root.append(this._slot.getElem());
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
    // update(data :IView) {
    //     if (data.current || data.current === 0) {
    //         const prev = this.current;
    //         this.current = data.current;
    //         this.renderBar(prev);
    //         this.renderBar(data.current);
    //     }
    //     if (data.perValues) {
    //         // this.label.showValue(data.value, this.thumbs[this.current].elem.getBoundingClientRect().left);
    //         this.renderBars(data.perValues);
    //     }
    // }
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
}

export {View}