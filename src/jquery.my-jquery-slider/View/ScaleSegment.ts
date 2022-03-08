import { EventEmitter, IEventEmitter } from '../EventEmitter';

enum ScaleSegmentNotch {
  short = 'short',
  normal = 'normal',
  long = 'long',
}

enum ScaleSegmentEvent {
  select = 'select',
}

type TScaleSegmentConfig = {
  className: string;
  value: number;
  notch: ScaleSegmentNotch;
  label: number | string | null;
  grow: number;
  isLast: boolean;
  withNotch: boolean;
};

interface IScaleSegment {
  on(event: ScaleSegmentEvent, callback: (value?: number) => unknown): void;
  update(options: TScaleSegmentConfig): void;
  getElem(): HTMLDivElement;
}

class ScaleSegment implements IScaleSegment {
  private eventEmitter: IEventEmitter = new EventEmitter();

  private scaleSegmentElem: HTMLDivElement;

  private className?: string;

  private value?: number;

  private notch?: ScaleSegmentNotch;

  private label?: number | string;

  private grow?: number;

  private isLast?: boolean;

  private withNotch?: boolean;

  constructor(options: TScaleSegmentConfig) {
    this.applyOptions(options);
    this.scaleSegmentElem = ScaleSegment.createElem();
    this.configureElem();
    this.bindEventListeners();
  }

  public on(event: ScaleSegmentEvent, callback: (value?: number) => unknown): void {
    this.eventEmitter.subscribe(event, callback);
  }

  public update(options: TScaleSegmentConfig): void {
    this.applyOptions(options);
    this.configureElem();
  }

  public getElem(): HTMLDivElement {
    return this.scaleSegmentElem;
  }

  private static createElem() {
    const scaleSegmentElem = document.createElement('div');
    scaleSegmentElem.setAttribute('tabindex', '0');
    return scaleSegmentElem;
  }

  private applyOptions(options: TScaleSegmentConfig) {
    const config = { ...options };
    this.className = config.className;
    this.value = config.value;
    this.notch = config.notch;
    this.label = config.label as number | string;
    this.grow = config.grow;
    this.isLast = config.isLast;
    this.withNotch = config.withNotch;
  }

  private configureElem() {
    this.scaleSegmentElem.className = this.className as string;
    this.defineNotchModifier();
    this.defineLabelModifier();
    if (this.value || this.value === 0) {
      this.scaleSegmentElem.dataset.value = this.value.toString();
    }
    if (this.grow || this.grow === 0) {
      this.scaleSegmentElem.style.flexGrow = this.grow.toString();
    }
    if (this.isLast) {
      this.scaleSegmentElem.classList.add(`${this.className}_last`);
    }
  }

  private defineNotchModifier() {
    if (this.withNotch) this.defineNotchLengthModifier();
    else {
      this.scaleSegmentElem.classList.add(
        `${this.className}_notch_none`,
      );
    }
  }

  private defineNotchLengthModifier() {
    if (this.notch === ScaleSegmentNotch.long) {
      this.scaleSegmentElem.classList.add(`${this.className}_long`);
    } else if (this.notch === ScaleSegmentNotch.short) {
      this.scaleSegmentElem.classList.add(`${this.className}_short`);
    }
  }

  private defineLabelModifier() {
    if (typeof this.label === 'number') {
      this.scaleSegmentElem.classList.add(
        `${this.className}_with-number`,
      );
      this.scaleSegmentElem.dataset.label = this.label.toString();
    }
    if (typeof this.label === 'string') {
      this.scaleSegmentElem.classList.add(`${this.className}_with-name`);
      this.scaleSegmentElem.dataset.label = this.label;
    }
  }

  private handleClick(e: MouseEvent) {
    const option = e.target as HTMLDivElement;
    this.notify(ScaleSegmentEvent.select, Number(option.dataset.value));
  }

  private handleKeyPress(e: KeyboardEvent) {
    const option = e.target as HTMLDivElement;
    if (e.key === ' ') {
      e.preventDefault();
      this.notify(ScaleSegmentEvent.select, Number(option.dataset.value));
    }
  }

  private bindEventListeners() {
    this.scaleSegmentElem.addEventListener(
      'click',
      this.handleClick.bind(this),
    );
    this.scaleSegmentElem.addEventListener(
      'keypress',
      this.handleKeyPress.bind(this),
    );
  }

  private notify(event: string, value?: number) {
    this.eventEmitter.emit(event, value);
  }
}

export {
  ScaleSegment, IScaleSegment, TScaleSegmentConfig, ScaleSegmentNotch,
  ScaleSegmentEvent,
};
