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
    private _slot: Slot;
    private _bars: Bar[];
    private _thumbs: Thumb[];
    private _scale: Scale;
    private _label: Label;
    private _isProcessed: boolean;
    private _isVertical: boolean;
    private _active :number;
    constructor(options: IView, presenter: Presenter) {
        this._presenter = presenter;
        this.render(options);
        this._isProcessed = true;
        document.addEventListener('pointermove', (e) => this._handlePointerMove(e));
        document.addEventListener('pointerup', this._handlePointerUp.bind(this));
    }
    public render(options: IView) {
        const className = 'my-jquery-slider';
        this._active = options.active;
        this._isVertical = options.orientation === 'vertical' ? true : false;
        this._configurateRoot(options.root, className, this._isVertical, options.lengthPx, options.withIndent);
        this._slot = new Slot(`${className}__slot`, this._isVertical, options.withIndent, this);
        this._bars = this._makeBars(className, options.perValues, options.active, options.actuals, this._isVertical);
        this._thumbs = this._makeThumbs(options.perValues.length, className);
        const LengthPx = this._getLengthPx(options.root, this._isVertical);
        this._scale = options.scale ? this._makeScale(options, LengthPx, className) : null;
        this._label = options.withLabel ? new Label(className) : null;
        this._draw(options.root);
    }
    public modify(prop :string, ...values: Array<number | number[]>) {
        switch(prop) {
            case 'active':
                this._bars[this._active].toggleActive();
                this._active = values[0] as number;
                this._bars[this._active].toggleActive();
                break;
            case 'value':
                const value = values[0] as number;
                const perValues = values[1] as number[];
                let indentPer = 0;
                perValues.forEach((perValue: number, index) => {
                    this._bars[index].setLengthPer(perValue-indentPer);
                    this._bars[index].setIndentPer(indentPer);
                    indentPer = perValue;
                })
                if (this._label !== null) {
                    this._label.showValue(value as number, this._thumbs[this._active].getElem().getBoundingClientRect().left);
                }
                break;
        }
    }
    public handleSliderProcessed(clientCoord :number) {
        if (!this._bars[this._active].isProcessed() || !this._thumbs[this._active].isProcessed()) return;
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
    private _configurateRoot(root: HTMLElement, className: string, isVertical: boolean, lengthPx?: number, withIndent: boolean = true) {
        root.classList.add(className);
        if(isVertical) {
            root.classList.add(`${className}_vertical`);
            if (lengthPx) {
                root.style.minHeight = `${lengthPx}px`;
                root.style.height = `${lengthPx}px`;
            }
            if (!withIndent) {
                root.style.padding = '0';
            }
        } else {
            if (lengthPx) {
                root.style.minWidth = `${lengthPx}px`;
                root.style.width = `${lengthPx}px`;
            }
        }
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
    private _getLengthPx(root: HTMLElement, isVertical: boolean) {
        const padding = root.style.padding !== ''  ? parseInt(root.style.padding, 10) : 15;
        const rootSizes = root.getBoundingClientRect();
        return isVertical ? rootSizes.height - padding*2 : rootSizes.width - padding*2;
    }
    private _makeScale(options: IView, maxLengthPx: number, className: string) {
        return new Scale({
            className: `${className}__scale`,
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
        this._thumbs[this._active].release();
        this._bars[this._active].release();
        this._slot.release();
    }
    private _draw(root: HTMLElement) {
        root.innerHTML = '';
        this._bars.forEach((bar, index) => {
            bar.append(this._thumbs[index].getElem());
            this._slot.append(bar.getElem());
        });
        if (this._label) {
            root.append(this._label.getElem());
        }
        if (this._scale) {
            root.append(this._scale.getElem());
        }
        root.append(this._slot.getElem());
    }
}

export {View}