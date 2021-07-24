import { ILabel, Label } from "./Label";
import { IViewConfigurator, IViewHandler } from "./View";

type TThumbConfig = {
    className: string;
    id: number;
    withLabel?: boolean;
}

interface IThumb {
    update(config?: TThumbConfig): void;
    getElem(): HTMLButtonElement;
    isProcessed(): boolean;
    activate(): void;
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
        this._createElem();
        this._initLabel();
        this._isProcessed = true;
        document.addEventListener('pointerup', this._handlePointerUp.bind(this));
    }

    public update(config?: TThumbConfig) {
        this._withLabel = config.withLabel ?? this._withLabel;
        if (this._withLabel) {
            if (this._label) { this._label.update(this._viewConfigurator.getLabelConfig()); }
            else { this._initLabel() }
        } else {
            this._thumbElem.innerHTML = '';
            this._label = null;
        }
    }
    public getElem() {
        return this._thumbElem;
    }
    public isProcessed() {
        return this._isProcessed;
    }
    public activate() {
        this._isProcessed = false;
        this._viewHandler.handleSelectRange(this._id);
    }

    private _initLabel() {
        if (!this._withLabel) return;
        this._label = new Label(this._viewConfigurator.getLabelConfig());
        this._thumbElem.append(this._label.getElem());
    }
    private _createElem() {
        const thumbElem = document.createElement('button');
        thumbElem.classList.add(this._className);
        thumbElem.addEventListener('pointerdown', this._handlePointerDown.bind(this));
        thumbElem.addEventListener('click', (e)=>{e.preventDefault()});
        this._thumbElem = thumbElem;
    }
    private _handlePointerDown() {
        this.activate();
    }
    private _handlePointerUp() {
        this._release();
    }
    private _release() {
        this._isProcessed = true;
    }
}

export { Thumb, IThumb, TThumbConfig }