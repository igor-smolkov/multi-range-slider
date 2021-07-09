import { IThumb, Thumb } from "./Thumb";

type TBar = {
    thumb: IThumb;
    id: number;
    className: string;
    length: number;
    isActive: boolean;
    isActual: boolean;
    isEven: boolean;
    isVertical: boolean;
    onProcess?(clientCoord: number, id: number): void;
}

interface IBar {
    getElem(): HTMLDivElement;
    isProcessed(): boolean;
    activate(): void;
    release(): void;
    setLengthPer(lengthPer: number): void;
    setIndentPer(indentPer: number): void;
}

class Bar implements IBar {
    private _thumb: IThumb;
    private _id: number;
    private _className: string;
    private _isActive: boolean;
    private _isActual: boolean;
    private _isVertical: boolean;
    private _elem: HTMLDivElement;
    private _isProcessed: boolean;
    private _onProcess: Function;
    constructor(options: TBar = {
        thumb: new Thumb(),
        id: Date.now(),
        className: 'bar',
        length: 100,
        isActive: false,
        isActual: true,
        isEven: false,
        isVertical: false,
    }) {
        const config = {...options};
        this._thumb = config.thumb;
        this._id = config.id;
        this._className = config.className;
        this._isActive = config.isActive;
        this._isActual = config.isActual;
        this._isVertical = config.isVertical;
        this._elem = this._make(config);
        this._onProcess = config.onProcess;
        this._isProcessed = true;
    }
    public getElem() {
        return this._elem;
    }
    public isProcessed() {
        return this._isProcessed;
    }
    public activate() {
        this._isProcessed = false;
        this._toggleDisplayActive();
    }
    public release() {
        this._isProcessed = true;
        this._toggleDisplayActive();
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
        bar.append(config.thumb.getElem());
        bar.addEventListener('pointerdown', (e) => this._handlePointerDown(e));
        return bar;
    }
    private _handlePointerDown(e: MouseEvent) {
        this.activate();
        this._execute(!this._isVertical ? e.clientX : e.clientY);
    }
    private _execute(clientCoord: number) {
        if (!this._onProcess) return;
        this._onProcess(clientCoord, this._id);
    }
    public _toggleDisplayActive() {
        this._isActive = !this._isActive;
        if (!this._isActual) return;
        this._elem.classList.toggle(`${this._className}_active`);
    }
}

export { Bar, TBar, IBar }