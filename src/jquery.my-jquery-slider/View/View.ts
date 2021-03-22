import Presenter from '../Presenter';
import IView from './IView'

class View {
    presenter :Presenter;
    root :HTMLElement;
    bar :HTMLElement;
    thumbs :Array<HTMLButtonElement>;
    currentIndex :number;
    currentBtnCtrl :HTMLButtonElement;
    constructor(data :IView, presenter :Presenter) {
        this.presenter = presenter;
        this.root = data.root;
        this.thumbs = [];
        this.fill(data);
        this.render();
    }
    fill(data :IView) {
        this.currentIndex = data.currentIndex;
        this.bar = this.createBar();
        this.initThumbs(data.values);
        this.currentBtnCtrl = this.createCurrentBtnCtrl();
    }
    render() {
        this.thumbs.forEach(thumb => {
            this.bar.append(thumb);
        })
        this.root.append(this.bar);
        this.root.append(this.currentBtnCtrl);
    }
    getRoot() {
        return this.root;
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
            this.presenter.forward(index);
        })
        return btn;
    }
    createCurrentBtnCtrl() {
        const btn = document.createElement('button');
        btn.innerText = '=>';
        btn.addEventListener('click', (e) => {
            this.presenter.forward();
        })
        return btn;
    }
    setCurrentIndex(index :number) {
        this.currentIndex = index;
    }
    setThumbValue(value :number) {
        this.thumbs[this.currentIndex].innerText = value.toString();
    }
}

export default View;