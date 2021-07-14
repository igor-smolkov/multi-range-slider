import { HorizontalBar, IBar, VerticalBar } from './Bar'
import { IViewHandler, IViewConfigurator } from './View';

type TSlotConfig = {
    className: string,
    withIndent?: boolean,
}

interface ISlot {
    getElem(): HTMLDivElement;
}

abstract class Slot implements ISlot {

    protected viewHandler: IViewHandler;
    protected viewConfigurator: IViewConfigurator;
    protected isProcessed: boolean;
    protected bars: IBar[];
    protected slotElem: HTMLDivElement;
    protected className: string;
    private _withIndent?: boolean;

    constructor(options: TSlotConfig = {
        className: 'slot',
        withIndent: true,
    }, viewConfigurator: IViewConfigurator, viewHandler: IViewHandler) {
        this.viewConfigurator = viewConfigurator;
        this.viewHandler = viewHandler;
        const config = {...options};
        this.className = config.className;
        this._withIndent = config.withIndent ?? true;
        this.initBars();
        this._createElem();
        this.isProcessed = true;
        document.addEventListener('pointermove', (e) => this.handlePointerMove(e));
        document.addEventListener('pointerup', (e) => this.handlePointerUp(e));
    }

    public abstract calcLengthPX(): number;
    public abstract calcIndentPX(): number;

    public calcInnerCoord(clientCoord :number) {
        const innerCoord = clientCoord - this.calcIndentPX();
        return 0 <= innerCoord ? innerCoord : 0;
    }
    public getElem() {
        return this.slotElem;
    }

    protected abstract initBars(): void;
    protected abstract handlePointerDown(e: MouseEvent): void;
    protected abstract handlePointerMove(e: MouseEvent): void;
    protected abstract handlePointerUp(e: MouseEvent): void;
    protected abstract isBeforeLastBar(clientCoord: number): boolean;
    protected abstract calcPerValue(clientCoord: number): number;

    protected activate() {
        this.isProcessed = true;
    }
    protected release() {
        this.isProcessed = true;
    }
    protected isBarProcessed() {
        return !this.bars.some(bar => !bar.isProcessed());
    }

    private _createElem() {
        const slotElem = document.createElement('div');
        slotElem.classList.add(this.className);
        if (!this._withIndent) { slotElem.style.margin = '0'; }
        this.bars.forEach(bar => slotElem.append(bar.getElem()));
        slotElem.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
        this.slotElem = slotElem;
    }
}

class HorizontalSlot extends Slot {
    public calcLengthPX() {
        return this.slotElem.getBoundingClientRect().width;
    }
    public calcIndentPX() {
        return this.slotElem.getBoundingClientRect().left;
    }
    protected initBars() {
        const bars: IBar[] = [];
        this.viewConfigurator.getBarConfigs()
            .forEach(barConfig => bars.push(new HorizontalBar(barConfig, this.viewConfigurator, this.viewHandler)));
        this.bars = bars;
    }
    protected handlePointerDown(e :MouseEvent) {
        this.activate();
        if (this.isBarProcessed() || !this.isBeforeLastBar(e.clientX)) { this.bars[this.bars.length-1].activate() }
        this.viewHandler.handleSelectPerValue(this.calcPerValue(e.clientX));
    }
    protected handlePointerMove(e: MouseEvent) {
        if (this.isProcessed) return;
        e.preventDefault();
        this.viewHandler.handleSelectPerValue(this.calcPerValue(e.clientX));
    }
    protected handlePointerUp(e: MouseEvent) {
        if (this.isProcessed) return;
        this.release();
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
    constructor(options: TSlotConfig, viewConfigurator: IViewConfigurator, viewHandler: IViewHandler) {
        super(options, viewConfigurator, viewHandler);
        this._markAsVertical();
    }
    public calcLengthPX() {
        return this.slotElem.getBoundingClientRect().height;
    }
    public calcIndentPX() {
        return this.slotElem.getBoundingClientRect().top;
    }
    protected initBars() {
        const bars: IBar[] = [];
        this.viewConfigurator.getBarConfigs()
            .forEach(barConfig => bars.push(new VerticalBar(barConfig, this.viewConfigurator, this.viewHandler)));
        this.bars = bars;
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
    protected handlePointerUp(e: MouseEvent) {
        if (this.isProcessed) return;
        this.release();
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