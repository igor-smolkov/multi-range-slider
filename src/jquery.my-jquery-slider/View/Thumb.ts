import View from "./View";

class Thumb {
    view :View;
    id :number;
    elem :HTMLButtonElement;
    isProcessed :boolean;
    constructor(id :number, view :View) {
        this.view = view;
        this.id = id;
        this.elem = this.make();
        this.isProcessed = true;
    }
    make() {
        const thumb = document.createElement('button');
        thumb.classList.add('my-jquery-slider__thumb');
        thumb.addEventListener('pointerdown', this.handlePointerDown.bind(this));
        return thumb;
    }
    handlePointerDown() {
        this.activate();
    }
    activate() {
        this.isProcessed = false;
        this.view.handleThumbProcessed(this.id);
    }
    release() {
        this.isProcessed = true;
    }
}

export default Thumb;