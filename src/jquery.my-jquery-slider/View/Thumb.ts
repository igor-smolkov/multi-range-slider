import View from "./View";

class Thumb {
    view :View;
    id :number;
    elem :HTMLButtonElement;
    constructor(id :number, view :View) {
        this.view = view;
        this.id = id;
        this.elem = this.make(id);
    }
    make(id :number) {
        const thumb = document.createElement('button');
        thumb.classList.add('my-jquery-slider__thumb');
        thumb.addEventListener('pointerdown', (e) => this.view.handleThumbPointerDown(e, id));
        return thumb;
    }
}

export default Thumb;