import {View} from "./View";

class Thumb {
    private _view: View;
    private _id: number;
    private _elem: HTMLButtonElement;
    private _isProcessed: boolean;
    constructor(id: number, className: string, view: View) {
        this._view = view;
        this._id = id;
        this._elem = this._make(className);
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

export {Thumb}