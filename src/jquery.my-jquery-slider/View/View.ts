import './my-jquery-slider.scss';

import { Corrector } from '../Corrector';
import { IPresenter } from '../Presenter';
import { HorizontalRoot, VerticalRoot, IRoot, TRootConfig } from './Root';
import { TThumbConfig } from './Thumb';
import { TBarConfig } from './Bar';
import { ISlot, TSlotConfig, HorizontalSlot, VerticalSlot } from './Slot';
import { TScaleConfig, Scale, TScaleCalcResonableStep } from './Scale';
import { TSegmentConfig } from './Segment';
import { TLabelConfig } from './Label';

type TViewConfig = {
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
    handleResize(): void;
    handleSelectRange(index: number): void;
    handleSelectValue(value: number): void;
    handleSelectPerValue(perValue: number): void;
}

interface IViewConfigurator {
    getRootConfig(): TRootConfig;
    getSlotConfig(): TSlotConfig;
    getBarConfigs(): TBarConfig[];
    getThumbConfig(id?: number): TThumbConfig;
    getLabelConfig(): TLabelConfig;
    getScaleConfig(): TScaleConfig;
    getSegmentConfigs(calcResonableStep:(options: TScaleCalcResonableStep) => number): TSegmentConfig[];
}

interface IViewRender {
    render(config: TViewConfig): void;
}

class View implements IViewHandler, IViewConfigurator, IViewRender {

    private _presenter: IPresenter;
    private _rootElem: HTMLElement;

    private _root: IRoot;
    private _slot: ISlot;

    private _className: string;
    private _config: TViewConfig;
    private _isProcessed: boolean;
    private _selectedPerValue: number;

    constructor(presenter: IPresenter, rootElem: HTMLElement, options: TViewConfig = {
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
    }) {
        this._presenter = presenter;
        this._rootElem = rootElem;
        this._config = options;
        this._className = 'my-jquery-slider';
        this._isProcessed = true;
        document.addEventListener('pointerup', this._handleRelease.bind(this))
    }
    public render(options: TViewConfig) {
        if (this._root && this._config.orientation === options.orientation) {
            this._config = this._isProcessed ? options : {...options, perValues: this._config.perValues};
            this._rerender();
            return;
        }
        this._config = options;
        this._selectedPerValue = this._config.perValues[this._config.active];
        if (this._config.orientation === 'vertical') {
            this._initVerticallSubviews()
        } else {
            this._initHorizontalSubviews()
        }
        if (this._config.scale) {
            const scale = new Scale(this.getScaleConfig(), this, this);
            this._root.setScale(scale);
        }
        this._root.display();
    }

    public getRootConfig() {
        const indent = !this._config.withIndent ? 'none' : this._config.withLabel ? 'more' : 'normal';
        const rootConfig: TRootConfig = {
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
            withLabel: this._config.withLabel && this._config.active === id,
        }
        return thumbConfig;
    }
    public getLabelConfig() {
        const labelConfig: TLabelConfig = {
            className: `${this._className}__label`,
            text: this._config.label === 'name' ? 
                this._config.name ?? this._config.value.toString() : 
                this._config.value.toString(),
        }
        return labelConfig;
    }
    public getScaleConfig() {
        const scaleConfig: TScaleConfig = {
            className: `${this._className}__scale`,
            withIndent: this._config.withIndent ?? true,
        }
        return scaleConfig;
    }
    public getSegmentConfigs(calcResonableStep:(options: TScaleCalcResonableStep) => number): TSegmentConfig[] {
        const segmentConfigs: TSegmentConfig[] = [];
        const resonableStep = calcResonableStep({
            min: this._config.min,
            max: this._config.max,
            step: this._config.step,
            maxLengthPx: this._root ? this._root.calcContentLengthPx() : this._config.lengthPx,
            isVertical: this._config.orientation === 'vertical',
            type: this._config.scale,
        }) ?? this._config.step;
        let acc;
        for(acc = this._config.min; acc <= this._config.max; acc += resonableStep) {
            acc = Corrector.correcterValueTailBy(resonableStep)(acc);
            segmentConfigs.push({
                className: `${this._className}__segment`,
                value: acc,
                notch: acc % (10*resonableStep) === 0 ? 'long' : 'normal',
                label: this._config.scale !== 'basic' ? this._config.list.has(acc) ? this._config.list.get(acc) : acc : null,
                grow: (acc + resonableStep > this._config.max) ? (this._config.max - acc) : resonableStep,
                isLast: acc === this._config.max,
            });
        }
        if (acc - resonableStep !== this._config.max) {
            segmentConfigs.pop();
            segmentConfigs.push({
                className: `${this._className}__segment`,
                value: this._config.max,
                label: this._config.scale !== 'basic' ? this._config.list.has(this._config.max) ? this._config.list.get(this._config.max) : null : null,
                notch: 'short',
                grow: this._config.max - (acc - resonableStep),
                isLast: true,
            });
        }
        return segmentConfigs;
    }
    
    public handleResize() {
        this._rerender();
    }
    public handleSelectRange(index: number) {
        if (!this._isProcessed) return;
        this._isProcessed = false;
        this._presenter.setActive(index);
    }
    public handleSelectValue(value :number) {
        this._presenter.setActiveCloseOfValue(value);
        this._presenter.setValue(value);
    }
    public handleSelectPerValue(perValue: number) {
        this._selectedPerValue = perValue;
        this._presenter.setPerValue(this._selectedPerValue);
    }
    private _handleRelease() {
        if (this._isProcessed) return;
        this._isProcessed = true;
        this._presenter.update();
    }

    private _initHorizontalSubviews() {
        this._slot = new HorizontalSlot(this.getSlotConfig(), this, this);
        this._root = new HorizontalRoot(this._rootElem, this._slot, this, this.getRootConfig())
    }
    private _initVerticallSubviews() {
        this._slot = new VerticalSlot(this.getSlotConfig(), this, this);
        this._root = new VerticalRoot(this._rootElem, this._slot, this, this.getRootConfig())
    }
    private _rerender() {
        if (!this._isProcessed) { this._correctPerValues() }
        this._slot.update(this.getSlotConfig());
        this._root.update(this.getRootConfig());
    }
    private _correctPerValues() {
        const active = this._config.active;
        const prev = this._config.perValues[active - 1];
        const next = this._config.perValues[active + 1];
        const isFirst = this._config.active - 1 < 0;
        const isMoreThenPrev = this._selectedPerValue >= prev;
        const isLessThenMin = this._selectedPerValue <= 0;
        const isLast = this._config.active + 1 >= this._config.perValues.length;
        const isLessThenNext = this._selectedPerValue <= next;
        const isMoreThenMax = this._selectedPerValue >= 100;

        this._config.perValues[active] = 
            isFirst && isLast ?
                isLessThenMin ? 0 : 
                    isMoreThenMax ? 100 : this._selectedPerValue :
                isFirst ? 
                    isLessThenMin ? 0 :
                        isLessThenNext ? this._selectedPerValue : next :
                    isLast ?
                        isMoreThenMax ? 100 :
                            isMoreThenPrev ? this._selectedPerValue : prev :
                        isLessThenNext ?
                            isMoreThenPrev ? this._selectedPerValue : prev :
                            next;
    }
}

export { View, TViewConfig, IViewHandler, IViewConfigurator, IViewRender }