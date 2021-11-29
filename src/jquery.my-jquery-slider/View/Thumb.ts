import { ILabel } from './Label';
import { IViewHandler } from './IView';

type TThumbConfig = {
  className: string;
  id: number;
  withLabel: boolean;
};

interface IThumb {
  update(config: TThumbConfig): void;
  getElem(): HTMLDivElement;
  isProcessed(): boolean;
  activate(): void;
}

class Thumb implements IThumb {
  private _viewHandler: IViewHandler;

  private _label: ILabel;

  private _thumbElem: HTMLDivElement;

  private _className?: string;

  private _id?: number;

  private _withLabel?: boolean;

  private _isProcessed: boolean;

  constructor(
    label: ILabel,
    viewHandler: IViewHandler,
    options: TThumbConfig,
  ) {
    this._label = label;
    this._viewHandler = viewHandler;
    this._applyOptions(options);
    this._thumbElem = this._createElem();
    this._isProcessed = true;
    this._setLabelElem();
    this._bindEventListeners();
  }

  public update(options: TThumbConfig): void {
    this._applyOptions(options);
    this._setLabelElem();
  }

  public getElem(): HTMLDivElement {
    return this._thumbElem;
  }

  public isProcessed(): boolean {
    return this._isProcessed;
  }

  public activate(): void {
    this._isProcessed = false;
    this._viewHandler.handleSelectRange(this._id as number);
  }

  private _applyOptions(options: TThumbConfig) {
    const config = { ...options };
    this._className = config.className;
    this._id = config.id;
    this._withLabel = config.withLabel;
  }

  private _createElem() {
    const thumbElem = document.createElement('div');
    thumbElem.setAttribute('tabindex', '0');
    thumbElem.classList.add(this._className as string);
    return thumbElem;
  }

  private _setLabelElem() {
    this._thumbElem.innerHTML = '';
    if (!this._withLabel) return;
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

  private _handleKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        e.preventDefault();
        this._viewHandler.handleStepForward();
        return;
      case 'ArrowDown':
      case 'ArrowLeft':
        e.preventDefault();
        this._viewHandler.handleStepBackward();
        break;
      default:
    }
  }

  private _handleFocus() {
    this._viewHandler.handleFocus(this._id as number);
  }

  private _bindEventListeners() {
    this._thumbElem.addEventListener(
      'pointerdown',
      this._handlePointerDown.bind(this),
    );
    document.addEventListener(
      'pointerup',
      this._handlePointerUp.bind(this),
    );

    this._thumbElem.addEventListener(
      'keydown',
      this._handleKeyDown.bind(this),
    );
    this._thumbElem.addEventListener(
      'focus',
      this._handleFocus.bind(this),
    );
  }
}

export { Thumb, IThumb, TThumbConfig };
