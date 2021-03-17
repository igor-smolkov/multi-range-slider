import EventEmitter from '../EventEmitter'

interface ISliderUI {
    root ?:HTMLElement;
    values ?:Array<number>;
    currentIndex ?:number;
}

class SliderUI {
    outerEventEmitter :EventEmitter;
    root :HTMLElement;
    bar :HTMLElement;
    thumbs :Array<HTMLButtonElement>;
    currentIndex :number;
    currentBtnCtrl :HTMLButtonElement;
    constructor(config :ISliderUI, outerEventEmitter :EventEmitter) {
        this.outerEventEmitter = outerEventEmitter;
        this.root = config.root;
        this.currentIndex = config.currentIndex;
        this.bar = this.createBar();
        this.initThumbs(config.values);
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
        btn.value = value.toString();
        btn.addEventListener('click', (e) => {
            this.outerEventEmitter.emit('slider-ui-forward', index);
        })
        return btn;
    }
    render() {
        this.thumbs.forEach(thumb => {
            this.bar.append(thumb);
        })
        this.root.append(this.bar);
        
        const btn = document.createElement('button');
        btn.value = '=>';
        btn.addEventListener('click', (e) => {
            this.outerEventEmitter.emit('slider-ui-forward');
        })
        this.root.append(btn);
    }
    getRoot() {
        return this.root;
    }
}

export default SliderUI;