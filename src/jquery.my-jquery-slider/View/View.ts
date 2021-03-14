import EventEmitter from '../EventEmitter';
import InputRange from './InputRange';

class View {
    outerEventEmitter :EventEmitter;
    innerEventEmitter :EventEmitter;
    root :HTMLElement;
    inputRange :InputRange;
    constructor(root :HTMLElement, outerEventEmitter :EventEmitter) {
        this.outerEventEmitter = outerEventEmitter;
        this.innerEventEmitter = new EventEmitter();
        this.root = root;
    }
    init(config :ImyJquerySlider) {
        this.inputRange = new InputRange(config, this.innerEventEmitter);
        this.subscribeToRange();
        this.triggerInit();
    }
    update(config :ImyJquerySlider) {
        this.inputRange.update(config)
    }
    render() {
        this.root.append(this.inputRange.getElem());
        this.triggerRender(this.root);
    }
    subscribeToRange() {
        this.innerEventEmitter.subscribe('input-range-input', (value :number)=>this.handleChange(value));
    }
    triggerInit() {
        this.outerEventEmitter.emit('view-init');
    }
    triggerRender(root :HTMLElement) {
        this.outerEventEmitter.emit('view-render');
    }
    triggerChange(value :number) {
        this.outerEventEmitter.emit('view-change', value);
    }
    handleChange(value :number) {
        this.triggerChange(value)
    }
    getRoot() {
        return this.root;
    }
    log(msg :any) {
        console.log(msg);
    }
}

export default View;