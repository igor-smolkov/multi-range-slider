import './my-jquery-slider.scss';

import { HorizontalRoot, VerticalRoot, IRoot, TRootConfig } from './Root';
import { Thumb, IThumb, TThumbConfig } from './Thumb';
import { Bar, IBar, TBar, TBarConfig } from './Bar';
import { Slot, ISlot, VerticalSlot, HorizontalSlot, TSlotConfig } from './Slot';
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
    handleSlotProcess(clientCoord :number): void;
    handleBarProcess(clientCoord :number, index :number): void;
    handleThumbProcess(index :number): void;
}

interface IViewConfigurator {
    getRootConfig(): TRootConfig;
    getSlotConfig(): TSlotConfig;
    getBarConfigs(): TBarConfig[];
    getThumbConfig(id: number): TThumbConfig;
    getLabelConfig(): string;
}

interface IView {
    
}

class View implements IView, IViewHandler, IViewConfigurator {
    private _config: TView;
    private _className: string;
    private _presenter: IPresenter;

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
        this._className = 'my-jquery-slider';
        this._config = {...options};
        this.render();

        this._presenter = presenter;
        this._isProcessed = true;
        document.addEventListener('pointermove', (e) => this._handlePointerMove(e));
        document.addEventListener('pointerup', this._handlePointerUp.bind(this));
    }
    public render() {
        const isVertical = this._config.orientation === 'vertical' ? true : false;
        const root = isVertical ? 
            new VerticalRoot(this.getRootConfig(), this, this) : 
            new HorizontalRoot(this.getRootConfig(), this, this);
        root.display();

        this._scale = config.scale ? this._makeScale(config) : null;
        this._draw(config.root);
        this._showLabel(config.value, config.name);
    }
    public getRootConfig() {
        const indent = !this._config.withIndent ? 'none' : this._config.withLabel ? 'more' : 'normal';
        const rootConfig: TRootConfig = {
            rootElem: this._config.root,
            className: this._className,
            indent: indent,
        }
        return rootConfig;
    }
    public getSlotConfig() { 
        const slotConfig: TSlotConfig = {
            className: `${this._className}__slot`,
            withIndent: this._config.withIndent ?? true,
        }
        return slotConfig;
    }
    public getBarConfigs() {
        const barConfigs: TBarConfig[] = [];
        let indentPer = 0;
        this._config.perValues.forEach((perValue, index) => {
            const barConfig: TBarConfig = {
                className: `${this._className}__bar`,
                id: index,
                lengthPer: perValue-indentPer,
                indentPer: indentPer,
                isActive: index === this._config.active ? true : false,
                isActual: this._config.actuals.indexOf(index) !== -1 ? true : false,
                isEven: (index + 1) % 2 === 0 ? true : false,
            }
            barConfigs.push(barConfig);
            indentPer = perValue;
        });
        return barConfigs;
    }
    public getThumbConfig(id: number = 0) {
        const thumbConfig: TThumbConfig = {
            className: `${this._className}__thumb`,
            id: id,
            withLabel: this._config.withLabel && this._active === id,
        }
        return thumbConfig;
    }
    public getLabelConfig() {
        return `${this._className}__thumb`;
    }
    public handleUpdate() {
        this._presenter.update();
    }
    public handleSlotProcess(clientCoord :number) {
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
    public handleBarProcess(clientCoord :number, index :number) {
        if (this._thumbs[index].isProcessed()) {
            this._thumbs[index].activate();
            this._sendPerValue(clientCoord);
        }
    }
    public handleThumbProcess(index :number) {
        this._isProcessed = false;
        this._presenter.setActive(index);
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
    public handleScaleClick(value :number) {
        this._presenter.setActiveCloseOfValue(value);
        this._presenter.setValue(value);
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

export { View, IView, TView, IViewHandler, IViewConfigurator }