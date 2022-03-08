import { EventEmitter, IEventEmitter } from '../EventEmitter';
import { ILabel } from './Label';

enum ArrowKey {
  up = 'ArrowUp',
  right = 'ArrowRight',
  down = 'ArrowDown',
  left = 'ArrowLeft',
}

enum ThumbEvent {
  select = 'select',
  stepForward = 'step-forward',
  stepBackward = 'step-backward',
}

type ThumbSelect = {
  id: number;
  isFocusOnly?: boolean;
}

type TThumbConfig = {
  className: string;
  id: number;
  withLabel: boolean;
};

interface IThumb {
  on(event: ThumbEvent, callback: (args?: ThumbSelect) => unknown): void;
  update(config: TThumbConfig): void;
  getElem(): HTMLDivElement;
  isProcessed(): boolean;
  activate(): void;
}

class Thumb implements IThumb {
  private eventEmitter: IEventEmitter = new EventEmitter();

  private label: ILabel;

  private thumbElem: HTMLDivElement;

  private className?: string;

  private id?: number;

  private withLabel?: boolean;

  private isProcessedLoc: boolean;

  constructor(label: ILabel, options: TThumbConfig) {
    this.label = label;
    this.applyOptions(options);
    this.thumbElem = this.createElem();
    this.isProcessedLoc = true;
    this.setLabelElem();
    this.bindEventListeners();
  }

  public on(event: ThumbEvent, callback: (args?: ThumbSelect) => unknown): void {
    this.eventEmitter.subscribe(event, callback);
  }

  public update(options: TThumbConfig): void {
    this.applyOptions(options);
    this.setLabelElem();
  }

  public getElem(): HTMLDivElement {
    return this.thumbElem;
  }

  public isProcessed(): boolean {
    return this.isProcessedLoc;
  }

  public activate(): void {
    this.isProcessedLoc = false;
    this.notify(ThumbEvent.select, { id: this.id as number });
  }

  private applyOptions(options: TThumbConfig) {
    const config = { ...options };
    this.className = config.className;
    this.id = config.id;
    this.withLabel = config.withLabel;
  }

  private createElem() {
    const thumbElem = document.createElement('div');
    thumbElem.setAttribute('tabindex', '0');
    thumbElem.classList.add(this.className as string);
    return thumbElem;
  }

  private setLabelElem() {
    this.thumbElem.innerHTML = '';
    if (!this.withLabel) return;
    this.thumbElem.append(this.label.getElem());
  }

  private handlePointerDown() {
    this.activate();
  }

  private handlePointerUp() {
    this.release();
  }

  private release() {
    this.isProcessedLoc = true;
  }

  private handleKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case ArrowKey.up:
      case ArrowKey.right:
        e.preventDefault();
        this.notify(ThumbEvent.stepForward);
        return;
      case ArrowKey.down:
      case ArrowKey.left:
        e.preventDefault();
        this.notify(ThumbEvent.stepBackward);
        break;
      default:
    }
  }

  private handleFocus() {
    this.notify(ThumbEvent.select, { id: this.id as number, isFocusOnly: true });
  }

  private bindEventListeners() {
    this.thumbElem.addEventListener(
      'pointerdown',
      this.handlePointerDown.bind(this),
    );
    document.addEventListener(
      'pointerup',
      this.handlePointerUp.bind(this),
    );

    this.thumbElem.addEventListener(
      'keydown',
      this.handleKeyDown.bind(this),
    );
    this.thumbElem.addEventListener(
      'focus',
      this.handleFocus.bind(this),
    );
  }

  private notify(event: string, args?: ThumbSelect) {
    this.eventEmitter.emit(event, args);
  }
}

export {
  Thumb, IThumb, TThumbConfig, ThumbEvent, ThumbSelect,
};
