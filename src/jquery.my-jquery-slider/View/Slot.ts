import { HorizontalBar, IBar, VerticalBar } from './Bar'
import { IViewHandler, IViewConfigurator } from './View';

type TSlotConfig = {
    className: string,
    withIndent?: boolean,
}

interface ISlot {
    getElem(): HTMLDivElement;
    isProcessed(): boolean;
    activate(): void;
    release(): void;
}

abstract class Slot implements ISlot {

    protected viewHandler: IViewHandler;
    protected viewConfigurator: IViewConfigurator;
    protected bars: IBar[];
    protected slotElem: HTMLDivElement;
    protected className: string;
    private _withIndent?: boolean;
    private _isProcessed: boolean;

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
        this._isProcessed = true;
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
    public isProcessed() {
        return this._isProcessed;
    }
    public activate() {
        this._isProcessed = false;
    }
    public release() {
        this._isProcessed = true;
    }

    protected abstract initBars(): void;
    protected abstract execute(e :MouseEvent): void;

    private _createElem() {
        const slotElem = document.createElement('div');
        slotElem.classList.add(this.className);
        if (!this._withIndent) { slotElem.style.margin = '0'; }
        this.bars.forEach(bar => slotElem.append(bar.getElem()));
        slotElem.addEventListener('pointerdown', (e) => this._handlePointerDown(e));
        this.slotElem = slotElem;
    }
    private _handlePointerDown(e :MouseEvent) {
        this.activate();
        this.execute(e);
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
    protected execute(e :MouseEvent) {
        this.viewHandler.handleSlotProcess(e.clientX);
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
    protected execute(e :MouseEvent) {
        this.viewHandler.handleSlotProcess(e.clientY);
    }
    private _markAsVertical() {
        this.slotElem.classList.add(`${this.className}_vertical`);
    }
}

export { HorizontalSlot, VerticalSlot, ISlot, TSlotConfig }