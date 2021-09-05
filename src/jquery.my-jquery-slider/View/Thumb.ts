import { ILabel } from './Label';
import { IViewHandler } from './View';

type TThumbConfig = {
  className: string;
  id: number;
  withLabel?: boolean;
}

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
    },
  ) {
    this._label = label;
    this._viewHandler = viewHandler;
    const config = { ...options };
    this._className = config.className;
    this._id = config.id;
    this._withLabel = config.withLabel ?? false;
    this._createElem();
    this._setLabelElem();
    this._isProcessed = true;
    this._bindEventListeners();
  }

  public update(config: TThumbConfig): void {
    this._withLabel = config.withLabel ?? this._withLabel;
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
    this._viewHandler.handleSelectRange(this._id);
  }

  private static _handleClick(e: MouseEvent) {
    e.preventDefault();
  }

  private _createElem() {
    const thumbElem = document.createElement('div');
    thumbElem.setAttribute('tabindex', '0');
    thumbElem.classList.add(this._className);
    thumbElem.addEventListener('click', Thumb._handleClick);
    this._thumbElem = thumbElem;
  }

  private _setLabelElem() {
    if (!this._withLabel) {
      this._thumbElem.innerHTML = '';
      return;
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
    this._viewHandler.handleFocus(this._id);
  }

  private _bindEventListeners() {
    this._thumbElem.addEventListener('pointerdown', this._handlePointerDown.bind(this));
    document.addEventListener('pointerup', this._handlePointerUp.bind(this));

    this._thumbElem.addEventListener('keydown', this._handleKeyDown.bind(this));
    this._thumbElem.addEventListener('focus', this._handleFocus.bind(this));
  }
}

export { Thumb, IThumb, TThumbConfig };
