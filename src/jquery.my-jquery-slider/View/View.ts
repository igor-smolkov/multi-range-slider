import Presenter from '../Presenter';
import IView from './IView'
import Slot from './Slot'

class View {
    presenter :Presenter;
    root :HTMLElement;
    bar :HTMLDivElement;
    slots :Array<Slot>;
    thumbs :Array<HTMLButtonElement>;
    currentIndex :number;
    currentBtnCtrl :HTMLButtonElement;
    constructor(data :IView, presenter :Presenter) {
        this.presenter = presenter;
        this.root = data.root;
        this.thumbs = [];
        this.slots = [];
        this.fill(data);
        this.render();
    }
    fill(data :IView) {
        this.currentIndex = data.currentIndex;
        this.bar = this.createBar();

        data.pairsValuePerValue.forEach((pairValuePerValue, index) => {
            if (index !== 0) {
                const prevPair = data.pairsValuePerValue[index-1];
                this.slots.push(new Slot(pairValuePerValue[1], prevPair[1]));
            } else {
                console.log(new Slot(pairValuePerValue[1]));
                this.slots.push(new Slot(pairValuePerValue[1]));
            }
        })

        // this.initThumbs(data.pairsValuePerValue);
        this.currentBtnCtrl = this.createCurrentBtnCtrl();
    }
    render() {
        this.slots.forEach(slot => {
            this.bar.append(slot.elem);
        })
        // this.thumbs.forEach(thumb => {
        //     this.bar.append(thumb);
        // })
        this.root.append(this.bar);
        this.root.append(this.currentBtnCtrl);
    }
    getRoot() {
        return this.root;
    }
    createBar() {
        const bar = document.createElement('div');
        bar.style.position = 'relative';
        bar.style.top = '50px';
        bar.style.left = '0';
        bar.style.width = '1200px';
        bar.style.minHeight = '20px';
        bar.style.border = `1px solid black`;
        return bar;
    }
    initThumbs(pairsValuePerValue :Array< Array<number> >) {
        pairsValuePerValue.forEach((pairValuePerValue, index) => this.addThumb(pairValuePerValue, index));
    }
    addThumb(pairValuePerValue :Array<number>, index :number) {
        this.thumbs.push(this.createThumb(pairValuePerValue, index))
    }
    createThumb(pairValuePerValue :Array<number>, index :number) {
        const thumb = document.createElement('button');
        thumb.id = `thumb_${index}`;
        thumb.innerText = pairValuePerValue[0].toString();

        thumb.style.position = 'absolute';
        thumb.style.top = '0px';
        thumb.style.left = `${pairValuePerValue[1]}%`;
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
        // this.thumbs[this.currentIndex].style.backgroundColor = 'white';
        this.currentIndex = index;
        // this.thumbs[this.currentIndex].style.backgroundColor = 'red';
    }
    setThumbValue(value :number, perValue :number) {
        // this.thumbs[this.currentIndex].innerText = value.toString();
        // this.thumbs[this.currentIndex].style.left = `${perValue}%`;
    }
}

export default View;