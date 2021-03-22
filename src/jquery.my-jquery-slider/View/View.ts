import Presenter from '../Presenter';
import IView from './IView'

class View {
    presenter :Presenter;
    root :HTMLElement;
    bar :HTMLDivElement;
    thumbs :Array<HTMLButtonElement>;
    currentIndex :number;
    currentBtnCtrl :HTMLButtonElement;
    data :IView;
    constructor(data :IView, presenter :Presenter) {
        this.data = data;
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
        bar.style.position = 'absolute';
        bar.style.top = '50px';
        bar.style.left = `${this.data.limits[0]*10}px`;
        bar.style.width = `${(this.data.limits[1]-this.data.limits[0])*10+20}px`;
        bar.style.minHeight = '20px';
        bar.style.border = `1px solid black`;
        return bar;
    }
    initThumbs(values :Array<number>) {
        values.forEach((value, index) => this.addThumb(value, index));
    }
    addThumb(value :number, index :number) {
        this.thumbs.push(this.createThumb(value, index))
    }
    createThumb(value :number, index :number) {
        const thumb = document.createElement('button');
        thumb.id = `thumb_${index}`;
        thumb.innerText = value.toString();

        console.log(value*10);
        thumb.style.position = 'absolute';
        thumb.style.top = '0px';
        thumb.style.left = `${value*10-this.data.limits[0]*10}px`;
        thumb.style.width = '20px';
        thumb.style.height = '20px';
        thumb.style.border = '1px solid blue';
        thumb.style.borderRadius = '10px';
        thumb.style.fontSize ='10px';
        thumb.style.padding ='0';
        if (index === this.currentIndex) {
            thumb.style.backgroundColor = 'red';
        }

        thumb.addEventListener('focus', (e) => {
            this.presenter.current(index);
        })
        thumb.addEventListener('keydown', (e) => {
            if (e.code == 'ArrowRight') {
                this.presenter.forward(index);
            }
            if (e.code == 'ArrowLeft') {
                this.presenter.backward(index);
            }
        });
        return thumb;
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
        this.thumbs[this.currentIndex].style.backgroundColor = 'white';
        this.currentIndex = index;
        this.thumbs[this.currentIndex].style.backgroundColor = 'red';
    }
    setThumbValue(value :number) {
        this.thumbs[this.currentIndex].innerText = value.toString();
        this.thumbs[this.currentIndex].style.left = `${value*10-this.data.limits[0]*10}px`;
    }
}

export default View;