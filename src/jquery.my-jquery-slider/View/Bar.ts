import View from "./View";
import IBar from "./IBar";

class Bar {
    view: View;
    id: number;
    length: number;
    isActive :boolean;
    isActual :boolean;
    isVertical :boolean;
    elem :HTMLDivElement;
    isProcessed :boolean;
    constructor(config :IBar, view :View) {
        this.view = view;
        this.id = config.id;
        this.length = config.length;
        this.isActive = config.isActive;
        this.isActual = config.isActual;
        this.isVertical = config.isVertical;
        this.elem = this.make(config);
        this.isProcessed = true;
    }
    make(config :IBar) {
        const bar = document.createElement('div');
        bar.classList.add('my-jquery-slider__bar');
        if (config.isActual) {
            bar.classList.add('my-jquery-slider__bar_actual');
            if (config.isActive) {
                bar.classList.add('my-jquery-slider__bar_active');
            }
            if (config.isEven) {
                bar.classList.add('my-jquery-slider__bar_even');
            }
        }
        if (this.isVertical) {
            bar.classList.add('my-jquery-slider__bar_vertical');
            bar.style.height = `${config.length}%`;
        } else {
            bar.style.width = `${config.length}%`;
        }
        bar.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
        return bar;
    }
    handlePointerDown(e :MouseEvent) {
        this.activate(!this.isVertical ? e.clientX : e.clientY);
    }
    activate(clientCoord :number) {
        this.isProcessed = false;
        this.view.handleBarProcessed(clientCoord, this.id);
    }
    release() {
        this.isProcessed = true;
    }
    setLengthPer(lengthPer :number) {
        if (!this.isVertical) {
            this.elem.style.width = `${lengthPer}%`;
        } else {
            this.elem.style.height = `${lengthPer}%`;
        }
    }
    setIndentPer(indentPer :number) {
        if (!this.isVertical) {
            this.elem.style.left = `${indentPer}%`;
        } else {
            this.elem.style.top = `${indentPer}%`;
        }
    }
    getIndentPX() {
        const calc = this.elem.getBoundingClientRect();
        return !this.isVertical ? calc.left : calc.top;
    }
    toggleActive() {
        this.isActive = !this.isActive;
        if (!this.isActual) return;
        this.elem.classList.toggle('my-jquery-slider__bar_active');
    }
    append(elem :HTMLButtonElement) {
        this.elem.append(elem);
    }
}

export default Bar;