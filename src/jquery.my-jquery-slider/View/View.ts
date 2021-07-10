import './my-jquery-slider.scss';

import { HorizontalRoot, VerticalRoot, IRoot } from './Root';
import { Thumb, IThumb } from './Thumb';
import { Bar, IBar } from './Bar';
import { Slot, ISlot } from './Slot';
import { Scale, IScale } from './Scale';
import { Label, ILabel } from './Label';
import { IPresenter } from '../Presenter';

type TView = {
    root: HTMLElement;
    min: number;
    max: number;
    value: number;
    name: string;
    step: number;
    orientation: 'vertical' | 'horizontal';
    perValues: Array<number>;
    active: number;
    actuals: number[];
    list: Map<number, string>;
    withIndent: boolean;
    withLabel: boolean;
    label?: 'number' | 'name';
    scale?: 'basic' | 'numeric' | 'named';
    lengthPx?: number;
}

interface IViewHandler {
    handleUpdate(): void;
}

interface IView {
    
}

class View implements IView, IViewHandler {
    private _presenter: IPresenter;
    private _className: string;
    private _root: IRoot;
    private _thumbs: IThumb[];
    private _bars: IBar[];
    private _slot: ISlot;
    private _scale: IScale;
    private _label: ILabel;
    private _isProcessed: boolean;
    private _isVertical: boolean;
    private _active :number;
    private _perValue :number;
    private _onUpdate: Function;
    constructor(options: TView = {
        root: document.createElement('div'),
        min: 0,
        max: 100,
        value: 50,
        name: '',
        step: 1,
        orientation: 'horizontal',
        perValues: [50],
        active: 0,
        actuals: [0],
        withLabel: false,
        list: new Map(),
        withIndent: true,
    }, presenter: IPresenter) {
        const config = {...options};
        this._presenter = presenter;
        this._className = 'my-jquery-slider';
        this.render(config);
        this._isProcessed = true;
        document.addEventListener('pointermove', (e) => this._handlePointerMove(e));
        document.addEventListener('pointerup', this._handlePointerUp.bind(this));
    }
    public render(config: TView) {
        const isVertical = config.orientation === 'vertical' ? true : false;
        this._root = isVertical ? 
            new VerticalRoot(this._className, config, this) : 
            new HorizontalRoot(this._className, config, this);

        this._bars = this._makeBars(config);
        this._slot = new Slot({
            bars: this._bars,
            className: `${this._className}__slot`,
            isVertical: this._isVertical,
            withIndent: config.withIndent,
            onProcess: this.handleSliderProcessed.bind(this),
        });
        this._scale = config.scale ? this._makeScale(config) : null;
        this._label = config.withLabel ? new Label(`${this._className}__label`) : null;
        this._draw(config.root);
        this._showLabel(config.value, config.name);
    }
    handleUpdate() {
        this._presenter.update();
    }
    public modify(prop :string, ...values: Array<number | string | number[]>) {
        switch(prop) {
            case 'active': {
                const value = values[0] as number;
                const name = values[1] as string;
                const active = values[2] as number;
                this._bars[this._active].toggleActive();
                this._active = active;
                this._bars[this._active].toggleActive();
                this._showLabel(value, name);
                break;
            }
            case 'value': {
                const value = values[0] as number;
                const name = values[1] as string;
                const perValues = values[2] as number[];
                let indentPer = 0;
                perValues.forEach((perValue: number, index) => {
                    const isValidPerValue = (this._perValue >= perValues[index-1] || (this._perValue >= 0 && index === 0)) && (this._perValue <= perValues[index+1] || (this._perValue <= 100 && index === perValues.length-1));
                    const perValueDraw = index === this._active && !this._isProcessed && isValidPerValue ? this._perValue : perValue;
                    this._bars[index].setLengthPer(perValueDraw-indentPer);
                    this._bars[index].setIndentPer(indentPer);
                    indentPer = perValueDraw;
                })
                this._showLabel(value, name);
                break;
            }
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
    private _makeBars(config: TView) {
        const bars: Bar[] = [];
        let indentPer = 0;
        config.perValues.forEach((perValue, index) => {
            const bar = new Bar({
                thumb: new Thumb({
                    id: index,
                    className: `${this._className}__thumb`,
                    onProcess: this.handleThumbProcessed.bind(this)
                }),
                id: index,
                className: `${this._className}__bar`,
                length: perValue-indentPer,
                isActive: index === config.active ? true : false,
                isActual: config.actuals.indexOf(index) !== -1 ? true : false,
                isEven: (index + 1) % 2 === 0 ? true : false,
                isVertical: this._isVertical,
                onProcess: this.handleBarProcessed.bind(this)
            });
            bar.setIndentPer(indentPer);
            bars.push(bar);
            indentPer = perValue;
        });
        return bars;
    }
    private _makeScale(config: TView) {
        return new Scale({
            className: `${this._className}__scale`,
            min: config.min,
            max: config.max,
            step: config.step,
            list: config.list,
            type: config.scale,
            maxLengthPx: this._getRootLengthPx(),
            withIndent: config.withIndent,
            isVertical: this._isVertical,
        })
    }
    private _handlePointerMove(e: MouseEvent) {
        if (this._isProcessed) return;
        e.preventDefault();
        this._sendPerValue(!this._isVertical ? e.clientX : e.clientY);
    }
    private _sendPerValue(clientCoord: number) {
        const innerCoord = this._slot.getInnerCoord(clientCoord);
        const innerCoordPer = this._calcPer(innerCoord);
        this._perValue = innerCoordPer;
        this._presenter.setPerValue(innerCoordPer);
    }
    private _calcPer(pixels: number) {
        const length = this._slot.getLengthPX();
        const calc = !this._isVertical ? pixels / length * 100 : 100 - (pixels / length * 100);
        return calc;
    }
    private _handlePointerUp(e: MouseEvent) {
        if (this._isProcessed) return;
        this._isProcessed = true;
        this._thumbs[this._active].release();
        this._bars[this._active].release();
        this._slot.release();
        this._sendPerValue(!this._isVertical ? e.clientX : e.clientY);
    }
    private _draw(root: HTMLElement) {
        root.innerHTML = '';
        if (this._scale) { root.append(this._scale.getElem()) }
        root.append(this._slot.getElem());
    }
    private _showLabel(value: number, name: string) {
        if (this._label === null) return;
        this._thumbs[this._active].getElem().append(this._label.getElem());
        this._label.show(value, name);
    }
}

export { View, IView, TView, IViewHandler }