import IBar from './IBar'

class Bar {
    width :number;
    left :number;
    isActive :boolean;
    isActual :boolean;
    isOdd :boolean;
    elem :HTMLDivElement;
    constructor(config :IBar) {
        this.width = config.width;
        this.left = config.left;
        this.isActive = config.isActive;
        this.isActual = config.isActual;
        this.isOdd = config.isOdd;
        this.elem = this.makeBar(this.width, this.left);
    }
    makeBar(width :number, left :number = 0) {
        const elem = document.createElement('div');
        elem.style.position = 'absolute';
        elem.style.top = '0';
        elem.style.left = `${left}%`;
        elem.style.width = `${width-left}%`;
        elem.style.minHeight = '20px';
        elem.style.border = `1px solid green`;
        elem.style.backgroundColor = this.isActual ? 'green' : elem.style.backgroundColor;
        elem.style.backgroundColor = this.isActive ? 'blue' : elem.style.backgroundColor;
        elem.style.opacity = this.isOdd && !this.isActive ? '0.5' : '1';
        return elem;
    }
    toggleActive() {
        this.isActive = !this.isActive;
        this.render();
    }
    setWidth(perValue :number) {
        this.width = perValue;
        this.render();
    }
    render() {
        this.elem.style.backgroundColor = this.isActual ? 'green' : this.elem.style.backgroundColor;
        this.elem.style.backgroundColor = this.isActive ? 'blue' : this.elem.style.backgroundColor;
        this.elem.style.opacity = this.isOdd && !this.isActive ? '0.5' : '1';
        this.elem.style.width = `${this.width-this.left}%`;
    }
}

export default Bar;