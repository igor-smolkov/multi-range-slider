import { ILabel, Label } from "./Label";
import { IViewConfigurator, IViewHandler } from "./View";

type TThumbConfig = {
    className: string;
    id: number;
    withLabel?: boolean;
}

interface IThumb {
    getElem(): HTMLButtonElement;
    isProcessed(): boolean;
    activate(): void;
    release(): void;
}

class Thumb implements IThumb {

    private _viewHandler: IViewHandler;
    private _viewConfigurator: IViewConfigurator;
    private _label: ILabel;
    private _thumbElem: HTMLButtonElement;
    private _className: string;
    private _id: number;
    private _withLabel?: boolean;
    private _isProcessed: boolean;

    constructor(options: TThumbConfig = {
        className: 'thumb',
        id: Date.now(),
        withLabel: false,
    }, viewConfigurator: IViewConfigurator, viewHandler: IViewHandler) {
        this._viewConfigurator = viewConfigurator;
        this._viewHandler = viewHandler;
        const config = {...options};
        this._className = config.className;
        this._id = config.id;
        this._withLabel = config.withLabel ?? false;
        this._initLabel();
        this._createElem();
        this._isProcessed = true;
    }

    public getElem() {
        return this._thumbElem;
    }
    public isProcessed() {
        return this._isProcessed;
    }
    public activate() {
        this._isProcessed = false;
        this._execute();
    }
    public release() {
        this._isProcessed = true;
    }

    private _initLabel() {
        if (!this._withLabel) return;
        this._label = new Label(this._viewConfigurator.getLabelConfig());
    }
    private _createElem() {
        const thumbElem = document.createElement('button');
        thumbElem.classList.add(this._className);
        if (this._label) { thumbElem.append(this._label.getElem()) }
        thumbElem.addEventListener('pointerdown', this._handlePointerDown.bind(this));
        thumbElem.addEventListener('click', (e)=>{e.preventDefault()});
        this._thumbElem = thumbElem;
    }
    private _handlePointerDown() {
        this.activate();
    }
    private _execute() {
        this._viewHandler.handleThumbProcess(this._id);
    }
}

export { Thumb, IThumb, TThumbConfig }