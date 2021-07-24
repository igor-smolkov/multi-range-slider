import './my-jquery-slider.scss';

import { Corrector } from './Corrector';
import { IPresenter } from '../Presenter';
import { HorizontalRoot, VerticalRoot, IRoot, TRootConfig } from './Root';
import { TThumbConfig } from './Thumb';
import { TBarConfig } from './Bar';
import { TSlotConfig } from './Slot';
import { TScaleConfig, Scale } from './Scale';
import { TSegmentConfig } from './Segment';
import { TLabelConfig } from './Label';

type TView = {
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
    getThumbConfig(id: number): TThumbConfig;
    getLabelConfig(): TLabelConfig;
    getScaleConfig(): TScaleConfig;
    getSegmentConfigs(): TSegmentConfig[];
}

interface IViewRender {
    render(config: TView): void;
}

class View implements IViewHandler, IViewConfigurator, IViewRender {

    private _presenter: IPresenter;
    private _rootElem: HTMLElement;
    private _root: IRoot;
    private _className: string;
    private _config: TView;
    private _isProcessed: boolean;
    private _selectedPerValue: number;

    constructor(options: TView = {
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
    }, presenter: IPresenter, rootElem: HTMLElement) {
        this._presenter = presenter;
        this._className = 'my-jquery-slider';
        this._rootElem = rootElem;
        this._isProcessed = true;
        this.render({...options});
        document.addEventListener('pointerup', this._handleRelease.bind(this))
    }
    public render(options: TView) {
        if (this._config && this._config.orientation === options.orientation) {
            this._config = this._isProcessed ? options : {...options, perValues: this._config.perValues};
            this._rerender();
            return;
        }
        this._config = options;
        this._selectedPerValue = this._config.perValues[this._config.active];
        this._root = this._config.orientation === 'vertical' ? 
            new VerticalRoot(this.getRootConfig(), this, this) : 
            new HorizontalRoot(this.getRootConfig(), this, this);
        if (this._config.scale) {
            const scale = new Scale(this.getScaleConfig(), this, this);
            this._root.setScale(scale);
        }
        this._root.display();
    }

    public getRootConfig() {
        const indent = !this._config.withIndent ? 'none' : this._config.withLabel ? 'more' : 'normal';
        const rootConfig: TRootConfig = {
            rootElem: this._rootElem,
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
    public getSegmentConfigs() {
        const segmentConfigs: TSegmentConfig[] = [];
        const resonableStep = Scale.calcResonableStep({
            min: this._config.min,
            max: this._config.max,
            step: this._config.step,
            maxLengthPx: this._root.calcLengthPx(),
            isVertical: this._config.orientation === 'vertical',
            type: this._config.scale,
        });
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
        this._presenter.update();
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
        this._isProcessed = true;
        this._presenter.update();
    }

    private _rerender() {
        if (!this._isProcessed) { this._correctPerValues() }
        this._root.update(this.getRootConfig());
        this._root.display();
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

export { View, TView, IViewHandler, IViewConfigurator, IViewRender }