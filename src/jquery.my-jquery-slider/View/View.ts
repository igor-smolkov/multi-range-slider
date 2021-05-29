import { Presenter } from '../Presenter';
import { IView } from './IView';
import './my-jquery-slider.scss';
import { Slot } from './Slot';
import { Bar } from './Bar';
import { Thumb } from './Thumb';
import { Scale } from './Scale';
import { Label } from './Label';

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
    public handleSliderProcessed(clientCoord :number) {
        if (!this._bars[this.current].isProcessed() || !this._thumbs[this.current].isProcessed()) return;
        if (this._isProcessed) {
            const lastIndex = this._bars.length-1;
            const lastBarIndent = this._bars[lastIndex].getIndentPX();
            if (clientCoord < lastBarIndent && !this._isVertical) return;
            if (clientCoord > lastBarIndent && this._isVertical) return;
            this._thumbs[lastIndex].activate();
            this._sendPerValue(clientCoord);
        }
    }
    public handleBarProcessed(clientCoord :number, index :number) {
        if (this._thumbs[index].isProcessed()) {
            this._thumbs[index].activate();
            this._sendPerValue(clientCoord);
        }
    }
    public handleThumbProcessed(index :number) {
        this._isProcessed = false;
        this._presenter.setActive(index);
    }
    public handleScaleClick(value :number) {
        this._presenter.setActiveCloseOfValue(value);
        this._presenter.setValue(value);
    }
    private _render(options: IView) {
        const className = 'my-jquery-slider';
        this._isVertical = options.orientation === 'vertical' ? true : false;
        this._root = this._configurateRoot(options.root, className, this._isVertical, options.lengthPx, options.withIndent);
        this._slot = new Slot(className, this._isVertical, options.withIndent, this);
        this._bars = this._makeBars(className, options.perValues, options.active, options.actuals, this._isVertical);
        this._thumbs = this._makeThumbs(options.perValues.length, className);
        const LengthPx = this.getLengthPx(this._isVertical);
        this._scale = options.scale ? this._makeScale(options, LengthPx, className) : null;
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
    private _makeBars(className: string, perValues: number[], active: number, actuals: number[], isVertical: boolean) {
        const bars: Bar[] = [];
        let indentPer = 0;
        perValues.forEach((perValue, index) => {
            const bar = new Bar({
                id: index,
                className: `${className}__bar`,
                length: perValue-indentPer,
                isActive: index === active ? true : false,
                isActual: actuals.indexOf(index) !== -1 ? true : false,
                isEven: (index + 1) % 2 === 0 ? true : false,
                isVertical: isVertical,
            }, this);
            bar.setIndentPer(indentPer);
            bars.push(bar);
            indentPer = perValue;
        });
        return bars;
    }

    private _makeThumbs(count: number, className: string) {
        const thumbs :Array<Thumb> = [];
        for(let i = 0; i < count; i++) {
            thumbs.push(new Thumb(i, `${className}__thumb`, this));
        }
        return thumbs;
    }
    private _makeScale(options: IView, maxLengthPx: number, className: string) {
        return new Scale({
            className: className,
            min: options.min,
            max: options.max,
            step: options.step,
            list: options.list,
            type: options.scale,
            maxLengthPx: maxLengthPx,
            withIndent: options.withIndent,
        }, this)
    }
    private _handlePointerMove(e: MouseEvent) {
        if (this._isProcessed) return;
        e.preventDefault();
        this._sendPerValue(!this._isVertical ? e.clientX : e.clientY);
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
            this._slot.append(bar.getElem());
        });
        if (this._label) {
            this._root.append(this._label.getElem());
        }
        if (this._scale) {
            this._root.append(this._scale.getElem());
        }
        this._root.append(this._slot.getElem());
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
    // renderBars(perValues :Array<number>) {
    //     let indentPer = 0;
    //     perValues.forEach((perValue, index) => {
    //         this.bars[index].setLengthPer(perValue-indentPer);
    //         this.bars[index].setIndentPer(indentPer);
    //         indentPer = perValue;
    //     })
    // }
    // renderBar(index :number) {
    //     this.bars[index].toggleActive();
    // }
}

export {View}