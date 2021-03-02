import EventEmitter from './EventEmitter';

export default class View {
    eventEmitter :EventEmitter;
    elem :HTMLElement;
    forwardBtn :HTMLButtonElement;
    backBtn :HTMLButtonElement;
    outputField :HTMLDivElement;
    constructor(elem :HTMLElement, eventEmitter :EventEmitter) {
        this.eventEmitter = eventEmitter;

        this.elem = elem;
        this.backBtn = this.addBtn('back');
        this.outputField = this.addOutput();
        this.forwardBtn = this.addBtn('forward');
    }
    onClick(e :any) {
        if(e.target.classList.contains('btn_back')) {
            this.eventEmitter.emit('view-back');
        }
        if(e.target.classList.contains('btn_forward')) {
            this.eventEmitter.emit('view-forward');
        }
    }
    addBtn(value :string) {
        const btn = document.createElement('button');
        btn.innerText = value;
        btn.classList.add('btn_'+value);
        this.elem.append(btn);
        btn.addEventListener('click', (e) => this.onClick(e));
        return btn;
    }
    addOutput(value :string = '') {
        const div = document.createElement('div');
        div.innerText = value;
        div.classList.add('output');
        this.elem.append(div);
        return div;
    }
    message(msg :any) {
        const output :HTMLDivElement = this.elem.querySelector('.output')
        output.innerText = msg;
    }
}