import View from "./View";

class Slider {
    view :View;
    elem :HTMLDivElement;
    constructor(view :View) {
        this.view = view;
        this.elem = this.make();
    }
    make() {
        const slider = document.createElement('div');
        slider.classList.add('my-jquery-slider');
        slider.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
        return slider;
    }
    handlePointerDown(e :MouseEvent) {
        const innerX = this.getInnerX(e.clientX);
        this.view.handleSliderPointerDown(innerX);
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

export default Slider