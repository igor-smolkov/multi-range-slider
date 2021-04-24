import View from "./View";

class Slot {
    view :View;
    elem :HTMLDivElement;
    isProcessed :boolean;
    constructor(view :View) {
        this.view = view;
        this.elem = this.make();
        this.isProcessed = true;
    }
    make() {
        const slot = document.createElement('div');
        slot.classList.add('my-jquery-slider__slot');
        slot.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
        return slot;
    }
    handlePointerDown(e :MouseEvent) {
        this.activate(e.clientX);
    }
    activate(clientX :number) {
        this.isProcessed = false;
        this.view.handleSliderProcessed(clientX);
    }
    release() {
        this.isProcessed = true;
    }
    getInnerX(clientX :number) {
        return clientX - this.getLeftPX();
    }
    getLeftPX() {
        return this.elem.getBoundingClientRect().left;
    }
    getWidthPX() {
        return this.elem.getBoundingClientRect().width;
    }
    append(elem :HTMLDivElement) {
        this.elem.append(elem);
    }
}

export default Slot