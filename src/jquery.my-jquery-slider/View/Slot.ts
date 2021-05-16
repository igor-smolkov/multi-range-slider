import View from "./View";

class Slot {
    view :View;
    elem :HTMLDivElement;
    isVertical :boolean;
    isProcessed :boolean;
    constructor(isVertical :boolean, indent: boolean, view :View) {
        this.view = view;
        this.isVertical = isVertical;
        this.elem = this.make(indent);
        this.isProcessed = true;
    }
    make(indent: boolean = true) {
        const slot = document.createElement('div');
        slot.classList.add('my-jquery-slider__slot');
        if (this.isVertical) {
            slot.classList.add('my-jquery-slider__slot_vertical');
        }
        if (!indent) {
            slot.style.margin = '0';
        }
        slot.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
        return slot;
    }
    handlePointerDown(e :MouseEvent) {
        this.activate(!this.isVertical ? e.clientX : e.clientY);
    }
    activate(clientCoord :number) {
        this.isProcessed = false;
        this.view.handleSliderProcessed(clientCoord);
    }
    release() {
        this.isProcessed = true;
    }
    getInnerCoord(clientCoord :number) {
        return clientCoord - this.getIndentPX();
    }
    getIndentPX() {
        const calc = this.elem.getBoundingClientRect();
        return !this.isVertical ? calc.left : calc.top;
    }
    getLengthPX() {
        const calc = this.elem.getBoundingClientRect();
        return !this.isVertical ? calc.width : calc.height;
    }
    append(elem :HTMLDivElement) {
        this.elem.append(elem);
    }
}

export default Slot