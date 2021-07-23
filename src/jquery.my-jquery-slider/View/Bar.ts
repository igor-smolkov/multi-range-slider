import { IThumb, Thumb } from "./Thumb";
import { IViewConfigurator, IViewHandler } from "./View";

type TBarConfig = {
    className: string;
    id: number;
    lengthPer: number;
    indentPer: number;
    isActive: boolean;
    isActual: boolean;
    isEven: boolean;
}

interface IBar {
    update(config: TBarConfig): void;
    getElem(): HTMLDivElement;
    isProcessed(): boolean;
    activate(): void;
    calcIndentPX(): number;
}

abstract class Bar implements IBar {

    protected viewHandler: IViewHandler;
    protected viewConfigurator: IViewConfigurator;
    protected thumb: IThumb;
    protected barElem: HTMLDivElement;
    protected className: string;
    protected id: number;
    protected lengthPer: number;
    protected indentPer: number;
    private _isActive: boolean;
    private _isActual: boolean;
    private _isEven: boolean;
    private _isProcessed: boolean;

    constructor(options: TBarConfig = {
        className: 'bar',
        id: Date.now(),
        lengthPer: 100,
        indentPer: 0,
        isActive: false,
        isActual: true,
        isEven: false,
    }, viewConfigurator: IViewConfigurator, viewHandler: IViewHandler) {
        this.viewConfigurator = viewConfigurator;
        this.viewHandler = viewHandler;
        const config = {...options};
        this.className = config.className;
        this.id = config.id;
        this.lengthPer = config.lengthPer;
        this.indentPer = config.indentPer;
        this._isActive = config.isActive;
        this._isActual = config.isActual;
        this._isEven = config.isEven;
        this._initThumb();
        this._createElem();
        this.drawLengthPer();
        this._isProcessed = true;
        document.addEventListener('pointerup', this._handlePointerUp.bind(this));
        console.log('bar init');
    }

    public abstract calcIndentPX(): number;    

    public update(config: TBarConfig) {
        this.id = config.id;
        this.lengthPer = config.lengthPer;
        this.indentPer = config.indentPer;
        this._isActive = config.isActive;
        this._isActual = config.isActual;
        this._isEven = config.isEven;
        this.thumb.update(this.viewConfigurator.getThumbConfig(this.id));
        this._createElem();
        this.drawLengthPer();
        console.log('bar update');
    }
    public getElem() {
        return this.barElem;
    }
    public isProcessed() {
        return this._isProcessed;
    }
    public activate() {
        if (this.thumb.isProcessed()) { this.thumb.activate() }
        this._isProcessed = false;
        this._isActive = true;
        this._markActive();
    }

    protected abstract drawLengthPer(): void;
    protected abstract drawIndentPer(): void;

    private _initThumb() {
        this.thumb = new Thumb(this.viewConfigurator.getThumbConfig(this.id), this.viewConfigurator, this.viewHandler);
    }
    private _createElem() {
        const barElem = document.createElement('div');
        barElem.classList.add(this.className);
        if (this._isActual) {
            barElem.classList.add(`${this.className}_actual`);
            if (this._isActive) {
                barElem.classList.add(`${this.className}_active`);
            }
            if (this._isEven) {
                barElem.classList.add(`${this.className}_even`);
            }
        }
        barElem.append(this.thumb.getElem());
        barElem.addEventListener('pointerdown', this._handlePointerDown.bind(this));
        this.barElem = barElem;
    }
    private _handlePointerDown() {
        this.activate();
    }
    private _handlePointerUp() {
        this._release();
    }
    private _release() {
        this._isProcessed = true;
        this._isActive = false;
        this._unmarkActive();
    }
    private _markActive() {
        if (!this._isActual) return;
        this.barElem.classList.add(`${this.className}_active`);
    }
    private _unmarkActive() {
        this.barElem.classList.remove(`${this.className}_active`);
    }
}

class HorizontalBar extends Bar {
    public calcLengthPX() {
        return this.barElem.getBoundingClientRect().width;
    }
    public calcIndentPX() {
        return this.barElem.getBoundingClientRect().left;
    }
    protected drawLengthPer() {
        this.barElem.style.width = `${this.lengthPer}%`;
    }
    protected drawIndentPer() {
        this.barElem.style.left = `${this.lengthPer}%`;
    }
}
class VerticalBar extends Bar {
    constructor(options: TBarConfig, viewConfigurator: IViewConfigurator, viewHandler: IViewHandler) {
        super(options, viewConfigurator, viewHandler);
        this._markAsVertical();
    }
    public calcLengthPX() {
        return this.barElem.getBoundingClientRect().height;
    }
    public calcIndentPX() {
        return this.barElem.getBoundingClientRect().top;
    }
    protected drawLengthPer() {
        this.barElem.style.height = `${this.lengthPer}%`;
    }
    protected drawIndentPer() {
        this.barElem.style.top = `${this.indentPer}%`;
    }
    private _markAsVertical() {
        this.barElem.classList.add(`${this.className}_vertical`);
    }
}

export { IBar, TBarConfig, HorizontalBar, VerticalBar }