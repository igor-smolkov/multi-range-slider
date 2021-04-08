import View from "./View";
import IBar from "./IBar";

class Bar {
    view: View;
    id: number;
    width: number;
    isActive :boolean;
    elem :HTMLDivElement;
    isProcessed :boolean;
    constructor(config :IBar, view :View) {
        this.view = view;
        this.id = config.id;
        this.width = config.width;
        this.isActive = config.isActive;
        this.elem = this.make(config);
        this.isProcessed = true;
    }
    make(config :IBar) {
        const bar = document.createElement('div');
        bar.classList.add('my-jquery-slider__bar');
        if (config.isActive) {
            bar.classList.add('my-jquery-slider__bar_active');
        }
        bar.style.width = `${config.width}%`;
        bar.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
        return bar;
    }
    handlePointerDown(e :MouseEvent) {
        this.activate(e.clientX);
    }
    activate(clientX :number) {
        this.isProcessed = false;
        this.view.handleBarProcessed(clientX, this.id);
    }
    release() {
        this.isProcessed = true;
    }
    setWidthPer(widthPer :number) {
        this.elem.style.width = `${widthPer}%`;
    } 
    setLeftPer(leftPer :number) {
        this.elem.style.left = `${leftPer}%`;
    }
    getLeftPX() {
        return this.elem.getBoundingClientRect().left;
    }
    toggleActive() {
        this.isActive = !this.isActive;
        this.elem.classList.toggle('my-jquery-slider__bar_active');
    }
    append(elem :HTMLButtonElement) {
        this.elem.append(elem);
    }
}

export default Bar;