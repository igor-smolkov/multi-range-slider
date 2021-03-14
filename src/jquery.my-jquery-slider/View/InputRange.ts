import EventEmitter from '../EventEmitter';

interface IInputRange {
    maxValue ?:number;
    minValue ?:number;
    step ?:number;
    curValue ?:number;
}

class InputRange {
    outerEventEmitter :EventEmitter;
    elem :HTMLInputElement;
    constructor(config :IInputRange, outerEventEmitter :EventEmitter) {
        this.outerEventEmitter = outerEventEmitter;
        this.elem = this.create(config);
        this.subscribeToEvents(this.elem);
    }
    create(config :IInputRange) {
        const input = document.createElement('input');
        this.fillRange(input, config);
        input.type = 'range';
        return input;
    }
    update(config :IInputRange) {
        this.fillRange(this.elem, config);
    }
    subscribeToEvents(elem :HTMLInputElement) {
        elem.addEventListener('input', (e) => this.handleInput(e))
    }
    triggerInput(value :number) {
        this.outerEventEmitter.emit('input-range-input', value);
    }
    handleInput(e :any) {
        this.triggerInput(+e.target.value);
    }
    getElem() {
        return this.elem;
    }
    fillRange(range :HTMLInputElement, config :IInputRange) {
        range.max = config.maxValue.toString();
        range.min = config.minValue.toString();
        range.step = config.step.toString();
        range.value = config.curValue.toString();
    }
}

export default InputRange;