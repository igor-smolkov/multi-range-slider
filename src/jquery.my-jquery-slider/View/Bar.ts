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
    getElem(): HTMLDivElement;
    isProcessed(): boolean;
    activate(): void;
    release(): void;
    setLengthPer(lengthPer: number): void;
    setIndentPer(indentPer: number): void;
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
    }

    public abstract calcLengthPX(): number;
    public abstract calcIndentPX(): number;
    
    public setLengthPer(lengthPer: number) {
        if (lengthPer < 0 || lengthPer > 100) return;
        this.lengthPer = lengthPer;
        this.drawLengthPer();
    }
    public setIndentPer(indentPer: number) {
        if (indentPer < 0 || indentPer > 100) return;
        this.indentPer = indentPer;
        this.drawIndentPer();
    }    

    public getElem() {
        return this.barElem;
    }
    public isProcessed() {
        return this._isProcessed;
    }
    public activate() {
        this._isProcessed = false;
        this._toggleActive();
    }
    public release() {
        this._isProcessed = true;
        this._toggleActive();
    }

    protected abstract drawLengthPer(): void;
    protected abstract drawIndentPer(): void;
    protected abstract execute(e: MouseEvent): void;

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
        barElem.addEventListener('pointerdown', (e) => this._handlePointerDown(e));
        this.barElem = barElem;
    }
    private _handlePointerDown(e: MouseEvent) {
        this.activate();
        this.execute(e);
    }
    private _toggleActive() {
        this._isActive = !this._isActive;
        this._markActive();
    }
    private _markActive() {
        if (!this._isActual) return;
        this.barElem.classList.toggle(`${this.className}_active`);
    }
}

class HorizontalBar extends Bar {
    public calcLengthPX() {
        return this.barElem.getBoundingClientRect().width;
    }
    public calcIndentPX() {
        return this.barElem.getBoundingClientRect().top;
    }
    protected drawLengthPer() {
        this.barElem.style.width = `${this.lengthPer}%`;
    }
    protected drawIndentPer() {
        this.barElem.style.left = `${this.lengthPer}%`;
    }
    protected execute(e: MouseEvent) {
        this.viewHandler.handleBarProcess(e.clientX, this.id);
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
        return this.barElem.getBoundingClientRect().left;
    }
    protected drawLengthPer() {
        this.barElem.style.height = `${this.lengthPer}%`;
    }
    protected drawIndentPer() {
        this.barElem.style.top = `${this.indentPer}%`;
    }
    protected execute(e: MouseEvent) {
        this.viewHandler.handleBarProcess(e.clientY, this.id);
    }
    private _markAsVertical() {
        this.barElem.classList.add(`${this.className}_vertical`);
    }
}

export { IBar, TBarConfig, HorizontalBar, VerticalBar }