import { Bar, IBar } from './Bar'

type TSlot = {
    bars: IBar[],
    className: string,
    isVertical: boolean,
    withIndent: boolean,
    onProcess?(clientCoord: number): void;
}

interface ISlot {
    getElem(): HTMLDivElement;
    isProcessed(): boolean;
    activate(): void;
    release(): void;
}

class Slot implements ISlot {
    private _bars: IBar[];
    private _elem: HTMLDivElement;
    private _isVertical: boolean;
    private _isProcessed: boolean;
    private _onProcess: Function;
    constructor(options: TSlot = {
        bars: [new Bar()],
        className: 'slot',
        isVertical: false,
        withIndent: true,
    }) {
        const config = {...options};
        this._bars = config.bars;
        this._isVertical = config.isVertical;
        this._elem = this._make(config);
        this._onProcess = config.onProcess;
        this._isProcessed = true;
    }
    public getElem() {
        return this._elem;
    }
    public isProcessed() {
        return this._isProcessed;
    }
    public activate() {
        this._isProcessed = false;
    }
    public release() {
        this._isProcessed = true;
    }
    public getInnerCoord(clientCoord :number) {
        const innerCoord = clientCoord - this.getIndentPX();
        return 0 <= innerCoord ? innerCoord : 0;
    }
    public getIndentPX() {
        const calc = this._elem.getBoundingClientRect();
        return !this._isVertical ? calc.left : calc.top;
    }
    public getLengthPX() {
        const calc = this._elem.getBoundingClientRect();
        return !this._isVertical ? calc.width : calc.height;
    }
    private _make(config: TSlot) {
        const slot = document.createElement('div');
        slot.classList.add(config.className);
        if (config.isVertical) {
            slot.classList.add(`${config.className}_vertical`);
        }
        if (!config.withIndent) {
            slot.style.margin = '0';
        }
        config.bars.forEach(bar => slot.append(bar.getElem()));        
        slot.addEventListener('pointerdown', (e) => this._handlePointerDown(e));
        return slot;
    }
    private _handlePointerDown(e :MouseEvent) {
        this.activate();
        this._execute(!this._isVertical ? e.clientX : e.clientY);
    }
    private _execute(clientCoord: number) {
        if (!this._onProcess) return;
        this._onProcess(clientCoord);
    }
}

export { Slot, ISlot }