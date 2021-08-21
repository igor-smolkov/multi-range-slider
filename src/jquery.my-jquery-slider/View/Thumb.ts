import { ILabel } from "./Label";
import { IViewHandler } from "./View";

type TThumbConfig = {
    className: string;
    id: number;
    withLabel?: boolean;
}

interface IThumb {
    update(config: TThumbConfig): void;
    getElem(): HTMLButtonElement;
    isProcessed(): boolean;
    activate(): void;
}

class Thumb implements IThumb {

    private _viewHandler: IViewHandler;
    private _label: ILabel;
    private _thumbElem: HTMLButtonElement;
    private _className: string;
    private _id: number;
    private _withLabel?: boolean;
    private _isProcessed: boolean;

    constructor(
        label: ILabel,
        viewHandler: IViewHandler,
        options: TThumbConfig = {
            className: 'thumb',
            id: Date.now(),
        }
    ) {
        this._label = label;
        this._viewHandler = viewHandler;
        const config = {...options};
        this._className = config.className;
        this._id = config.id;
        this._withLabel = config.withLabel ?? false;
        this._createElem();
        this._setLabelElem();
        this._isProcessed = true;
        document.addEventListener('pointerup', this._handlePointerUp.bind(this));
    }

    public update(config: TThumbConfig) {
        this._withLabel = config.withLabel ?? this._withLabel;
        this._setLabelElem();
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

    private _createElem() {
        const thumbElem = document.createElement('button');
        thumbElem.classList.add(this._className);
        thumbElem.addEventListener('pointerdown', this._handlePointerDown.bind(this));
        thumbElem.addEventListener('click', (e)=>{e.preventDefault()});
        this._thumbElem = thumbElem;
    }
    private _setLabelElem() {
        if (!this._withLabel) {
            this._thumbElem.innerHTML = ''
            return
        }
        this._thumbElem.append(this._label.getElem());
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