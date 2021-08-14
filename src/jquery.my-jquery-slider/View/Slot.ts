import { HorizontalBar, IBar, TBarConfig, VerticalBar } from './Bar'
import { IViewHandler, IViewConfigurator } from './View';

type TSlotConfig = {
    className: string,
    withIndent?: boolean,
}

interface ISlot {
    update(config?: TSlotConfig): void;
    getElem(): HTMLDivElement;
}

abstract class Slot implements ISlot {

    protected viewHandler: IViewHandler;
    protected isProcessed: boolean;
    protected bars: IBar[];
    protected slotElem: HTMLDivElement;
    protected className: string;
    private _withIndent?: boolean;

    constructor(
        bars: IBar[],
        viewHandler: IViewHandler, 
        options: TSlotConfig = { className: 'slot' }
    ) {
        this.bars = bars;
        this.viewHandler = viewHandler;
        const config = {...options};
        this.className = config.className;
        this._withIndent = config.withIndent ?? true;
        this._createElem();
        this._appendBars();
        this._configurateElem();
        this.isProcessed = true;
        document.addEventListener('pointermove', (e) => this.handlePointerMove(e));
        document.addEventListener('pointerup', this._handlePointerUp.bind(this));
    }

    public update(config?: TSlotConfig) {
        this._withIndent = config.withIndent ?? this._withIndent;
        this._configurateElem();
    }
    public getElem() {
        return this.slotElem;
    }

    protected abstract handlePointerDown(e: MouseEvent): void;
    protected abstract handlePointerMove(e: MouseEvent): void;
    protected abstract isBeforeLastBar(clientCoord: number): boolean;
    protected abstract calcPerValue(clientCoord: number): number;
    protected abstract calcLengthPX(): number;
    protected abstract calcIndentPX(): number;

    protected activate() {
        this.isProcessed = false;
    }
    protected release() {
        this.isProcessed = true;
    }
    protected isBarProcessed() {
        return !this.bars.some(bar => !bar.isProcessed());
    }
    protected calcInnerCoord(clientCoord :number) {
        const innerCoord = clientCoord - this.calcIndentPX();
        return 0 <= innerCoord ? innerCoord : 0;
    }
    
    private _createElem() {
        const slotElem = document.createElement('div');
        slotElem.classList.add(this.className);
        slotElem.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
        this.slotElem = slotElem;
    }
    private _appendBars() {
        this.bars.forEach(bar => this.slotElem.append(bar.getElem()))
    }
    private _configurateElem() {
        if (!this._withIndent) { this.slotElem.style.margin = '0'; }
    }
    private _handlePointerUp() {
        if (this.isProcessed) return;
        this.release();
    }
}

class HorizontalSlot extends Slot {
    public calcLengthPX() {
        return this.slotElem.getBoundingClientRect().width;
    }
    public calcIndentPX() {
        return this.slotElem.getBoundingClientRect().left;
    }
    protected handlePointerDown(e: MouseEvent) {
        this.activate();
        if (this.isBarProcessed() || !this.isBeforeLastBar(e.clientX)) { this.bars[this.bars.length-1].activate() }
        this.viewHandler.handleSelectPerValue(this.calcPerValue(e.clientX));
    }
    protected handlePointerMove(e: MouseEvent) {
        if (this.isProcessed) return;
        e.preventDefault();
        this.viewHandler.handleSelectPerValue(this.calcPerValue(e.clientX));
    }
    protected isBeforeLastBar(clientCoord: number) {
        return clientCoord < this.bars[this.bars.length-1].calcIndentPX();
    }
    protected calcPerValue(clientCoord: number) {
        return this.calcInnerCoord(clientCoord) / this.calcLengthPX() * 100;
    }
}

class VerticalSlot extends Slot {
    constructor(bars: IBar[], viewHandler: IViewHandler, options?: TSlotConfig) {
        super(bars, viewHandler, options);
        this._markAsVertical();
    }
    public calcLengthPX() {
        return this.slotElem.getBoundingClientRect().height;
    }
    public calcIndentPX() {
        return this.slotElem.getBoundingClientRect().top;
    }
    protected handlePointerDown(e :MouseEvent) {
        this.activate();
        if (this.isBarProcessed() || !this.isBeforeLastBar(e.clientY)) { this.bars[this.bars.length-1].activate() }
        this.viewHandler.handleSelectPerValue(this.calcPerValue(e.clientY));
    }
    protected handlePointerMove(e: MouseEvent) {
        if (this.isProcessed) return;
        e.preventDefault();
        this.viewHandler.handleSelectPerValue(this.calcPerValue(e.clientY));
    }
    protected isBeforeLastBar(clientCoord: number) {
        return clientCoord > this.bars[this.bars.length-1].calcIndentPX();
    }
    protected calcPerValue(clientCoord: number) {
        return 100 - (this.calcInnerCoord(clientCoord) / this.calcLengthPX() * 100);
    }
    private _markAsVertical() {
        this.slotElem.classList.add(`${this.className}_vertical`);
    }
}

export { HorizontalSlot, VerticalSlot, ISlot, TSlotConfig }