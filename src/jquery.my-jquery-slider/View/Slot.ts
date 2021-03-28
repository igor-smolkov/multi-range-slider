class Slot {
    elem :HTMLDivElement;
    constructor(width :number, left ?:number) {
        this.elem = this.makeSlot(width, left);
    }
    makeSlot(width :number, left :number = 0) {
        const elem = document.createElement('div');
        elem.style.position = 'absolute';
        elem.style.top = '0';
        elem.style.left = `${left}%`;
        elem.style.width = `${width-left}%`;
        elem.style.minHeight = '20px';
        elem.style.border = `1px solid green`;
        elem.style.backgroundColor = 'lightgreen'
        return elem;
    }
}

export default Slot;