import { IViewHandler } from "./View";

type TThumb = {
    viewHandler: IViewHandler;
    id: number;
    className: string;
}

interface IThumb {
    getElem(): HTMLButtonElement;
    isProcessed(): boolean;
    activate(): void;
    release(): void;
}

class Thumb implements IThumb {
    private _view: IViewHandler;
    private _id: number;
    private _elem: HTMLButtonElement;
    private _isProcessed: boolean;
    constructor(options: TThumb = {
        viewHandler: null,
        id: Date.now(),
        className: 'thumb',
    }) {
        const config = {...options};
        this._view = config.viewHandler;
        this._id = config.id;
        this._elem = this._make(config.className);
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
        if (!this._view) return;
        this._view.handleThumbProcessed(this._id);
    }
    public release() {
        this._isProcessed = true;
    }

    private _make(className: string) {
        const thumb = document.createElement('button');
        thumb.classList.add(className);
        thumb.addEventListener('pointerdown', this._handlePointerDown.bind(this));
        thumb.addEventListener('click', (e)=>{e.preventDefault()});
        return thumb;
    }
    private _handlePointerDown() {
        this.activate();
    }
}

export { Thumb, IThumb, TThumb }