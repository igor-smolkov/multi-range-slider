import { IViewHandler } from "./View";

type TBar = {
    viewHandler: IViewHandler;
    id: number;
    className: string;
    length: number;
    isActive: boolean;
    isActual: boolean;
    isEven: boolean;
    isVertical: boolean;
}

interface IBar {
    getElem(): HTMLDivElement;
    isProcessed(): boolean;
}

class Bar implements IBar {
    private _view: IViewHandler;
    private _id: number;
    private _className: string;
    private _isActive: boolean;
    private _isActual: boolean;
    private _isVertical: boolean;
    private _elem: HTMLDivElement;
    private _isProcessed: boolean;
    constructor(options: TBar = {
        viewHandler: null,
        id: Date.now(),
        className: 'bar',
        length: 100,
        isActive: false,
        isActual: true,
        isEven: false,
        isVertical: false,
    }) {
        const config = {...options};
        this._view = config.viewHandler;
        this._id = config.id;
        this._className = config.className;
        this._isActive = config.isActive;
        this._isActual = config.isActual;
        this._isVertical = config.isVertical;
        this._elem = this._make(config);
        this._isProcessed = true;
    }
    public getElem() {
        return this._elem;
    }
    public isProcessed() {
        return this._isProcessed;
    }
    public release() {
        this._isProcessed = true;
    }
    public setLengthPer(lengthPer: number) {
        if (!this._isVertical) {
            this._elem.style.width = `${lengthPer}%`;
        } else {
            this._elem.style.height = `${lengthPer}%`;
        }
    }
    public setIndentPer(indentPer: number) {
        if (!this._isVertical) {
            this._elem.style.left = `${indentPer}%`;
        } else {
            this._elem.style.top = `${indentPer}%`;
        }
    }
    public getLengthPX() {
        const calc = this._elem.getBoundingClientRect();
        return !this._isVertical ? calc.width : calc.height;
    }
    public getIndentPX() {
        const calc = this._elem.getBoundingClientRect();
        return !this._isVertical ? calc.left : calc.top;
    }
    public toggleActive() {
        this._isActive = !this._isActive;
        if (!this._isActual) return;
        this._elem.classList.toggle(`${this._className}_active`);
    }
    public append(elem: HTMLButtonElement) {
        this._elem.append(elem);
    }
    private _make(config: TBar) {
        const bar = document.createElement('div');
        bar.classList.add(config.className);
        if (config.isActual) {
            bar.classList.add(`${config.className}_actual`);
            if (config.isActive) {
                bar.classList.add(`${config.className}_active`);
            }
            if (config.isEven) {
                bar.classList.add(`${config.className}_even`);
            }
        }
        if (config.isVertical) {
            bar.classList.add(`${config.className}_vertical`);
            bar.style.height = `${config.length}%`;
        } else {
            bar.style.width = `${config.length}%`;
        }
        bar.addEventListener('pointerdown', (e) => this._handlePointerDown(e));
        return bar;
    }
    private _handlePointerDown(e: MouseEvent) {
        this.activate(!this._isVertical ? e.clientX : e.clientY);
    }
    private activate(clientCoord: number) {
        this._isProcessed = false;
        if (!this._view) return;
        this._view.handleBarProcessed(clientCoord, this._id);
    }
}

export { Bar, TBar, IBar }