import EventEmitter from '../EventEmitter'
import IView from './IView'

class View {
    outerEventEmitter :EventEmitter;
    root :HTMLElement;
    bar :HTMLElement;
    thumbs :Array<HTMLButtonElement>;
    currentIndex :number;
    currentBtnCtrl :HTMLButtonElement;
    constructor(root :HTMLElement, outerEventEmitter :EventEmitter) {
        this.outerEventEmitter = outerEventEmitter;
        this.root = root;
        this.thumbs = [];
        this.outerEventEmitter.emit('view-inited', this.getRoot());
    }
    getRoot() {
        return this.root;
    }
    fill(config :IView) {
        this.currentIndex = config.currentIndex;
        this.bar = this.createBar();
        this.initThumbs(config.values);
        this.currentBtnCtrl = this.createCurrentBtnCtrl();
        this.outerEventEmitter.emit('view-filled', this.getRoot());
    }
    render() {
        this.thumbs.forEach(thumb => {
            this.bar.append(thumb);
        })
        this.root.append(this.bar);
        this.root.append(this.currentBtnCtrl);
        this.outerEventEmitter.emit('view-rendered', this.getRoot());
    }
    createBar() {
        const bar = document.createElement('div');
        return bar;
    }
    initThumbs(values :Array<number>) {
        values.forEach((value, index) => this.addThumb(value, index));
    }
    addThumb(value :number, index :number) {
        this.thumbs.push(this.createThumb(value, index))
    }
    createThumb(value :number, index :number) {
        const btn = document.createElement('button');
        btn.id = `thumb_${index}`;
        btn.innerText = value.toString();
        btn.addEventListener('click', (e) => {
            this.outerEventEmitter.emit('view-forward', index);
        })
        return btn;
    }
    createCurrentBtnCtrl() {
        const btn = document.createElement('button');
        btn.innerText = '=>';
        btn.addEventListener('click', (e) => {
            this.outerEventEmitter.emit('view-forward');
        })
        return btn;
    }
    setCurrentIndex(index :number) {
        console.log('here');
        this.currentIndex = index;
    }
    setThumbValue(value :number) {
        console.log(value);
        this.thumbs[this.currentIndex].innerText = value.toString();
    }
}

export default View;