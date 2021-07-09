type TThumb = {
    id: number;
    className: string;
    onProcess?(id: number): void;
}

interface IThumb {
    getElem(): HTMLButtonElement;
    isProcessed(): boolean;
    activate(): void;
    release(): void;
}

class Thumb implements IThumb {
    private _id: number;
    private _elem: HTMLButtonElement;
    private _isProcessed: boolean;
    private _onProcess: Function;
    constructor(options: TThumb = {
        id: Date.now(),
        className: 'thumb',
    }) {
        const config = {...options};
        this._id = config.id;
        this._elem = this._make(config.className);
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
        this._execute();
    }
    public release() {
        this._isProcessed = true;
    }

    private _make(className: string) {
        const thumb = document.createElement('button');
        thumb.classList.add(className);
        thumb.addEventListener('pointerdown', this._handlePointerDown.bind(this));
        thumb.addEventListener('click', (e)=>{e.preventDefault()});
        return thumb;
    }
    private _handlePointerDown() {
        this.activate();
    }
    private _execute() {
        if (!this._onProcess) return;
        this._onProcess(this._id);
    }
}

export { Thumb, IThumb, TThumb }