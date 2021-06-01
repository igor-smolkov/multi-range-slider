import { View } from "./View";

class Slot {
    private _view: View;
    private _elem: HTMLDivElement;
    private _isVertical: boolean;
    private _isProcessed: boolean;
    constructor(className: string, isVertical: boolean, withIndent: boolean, view: View) {
        this._view = view;
        this._elem = this._make(className, isVertical, withIndent);
        this._isVertical = isVertical;
        this._isProcessed = true;
    }
    public getElem() {
        return this._elem;
    }
    public append(elem :HTMLDivElement) {
        this._elem.append(elem);
    }
    public release() {
        this._isProcessed = true;
    }
    public getInnerCoord(clientCoord :number) {
        const innerCoord = clientCoord - this.getIndentPX();
        return 0 <= innerCoord ? innerCoord : 0;
    }
    public getIndentPX() {
        const calc = this._elem.getBoundingClientRect();
        return !this._isVertical ? calc.left : calc.top;
    }
    public getLengthPX() {
        const calc = this._elem.getBoundingClientRect();
        return !this._isVertical ? calc.width : calc.height;
    }
    private _make(className: string, isVertical: boolean, withIndent: boolean = true) {
        const slot = document.createElement('div');
        slot.classList.add(className);
        if (isVertical) {
            slot.classList.add(`${className}_vertical`);
        }
        if (!withIndent) {
            slot.style.margin = '0';
        }
        slot.addEventListener('pointerdown', (e) => this._handlePointerDown(e));
        return slot;
    }
    private _handlePointerDown(e :MouseEvent) {
        this._activate(!this._isVertical ? e.clientX : e.clientY);
    }
    private _activate(clientCoord :number) {
        this._isProcessed = false;
        this._view.handleSliderProcessed(clientCoord);
    }
}

export { Slot }