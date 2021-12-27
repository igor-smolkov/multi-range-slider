import { IViewHandler } from './IView';

enum SegmentNotch {
  short = 'short',
  normal = 'normal',
  long = 'long',
}

type TSegmentConfig = {
  className: string;
  value: number;
  notch: SegmentNotch;
  label: number | string | null;
  grow: number;
  isLast: boolean;
  withNotch: boolean;
};

interface ISegment {
  update(options: TSegmentConfig): void;
  getElem(): HTMLDivElement;
}

class Segment implements ISegment {
  private viewHandler: IViewHandler;

  private segmentElem: HTMLDivElement;

  private className?: string;

  private value?: number;

  private notch?: SegmentNotch;

  private label?: number | string;

  private grow?: number;

  private isLast?: boolean;

  private withNotch?: boolean;

  constructor(viewHandler: IViewHandler, options: TSegmentConfig) {
    this.viewHandler = viewHandler;
    this.applyOptions(options);
    this.segmentElem = Segment.createElem();
    this.configureElem();
    this.bindEventListeners();
  }

  public update(options: TSegmentConfig): void {
    this.applyOptions(options);
    this.configureElem();
  }

  public getElem(): HTMLDivElement {
    return this.segmentElem;
  }

  private static createElem() {
    const segmentElem = document.createElement('div');
    segmentElem.setAttribute('tabindex', '0');
    return segmentElem;
  }

  private applyOptions(options: TSegmentConfig) {
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
    this.segmentElem.className = this.className as string;
    this.defineNotchModifier();
    this.defineLabelModifier();
    if (this.value || this.value === 0) {
      this.segmentElem.dataset.value = this.value.toString();
    }
    if (this.grow || this.grow === 0) {
      this.segmentElem.style.flexGrow = this.grow.toString();
    }
    if (this.isLast) {
      this.segmentElem.classList.add(`${this.className}_last`);
    }
  }

  private defineNotchModifier() {
    if (this.withNotch) this.defineNotchLengthModifier();
    else {
      this.segmentElem.classList.add(
        `${this.className}_notch_none`,
      );
    }
  }

  private defineNotchLengthModifier() {
    if (this.notch === SegmentNotch.long) {
      this.segmentElem.classList.add(`${this.className}_long`);
    } else if (this.notch === SegmentNotch.short) {
      this.segmentElem.classList.add(`${this.className}_short`);
    }
  }

  private defineLabelModifier() {
    if (typeof this.label === 'number') {
      this.segmentElem.classList.add(
        `${this.className}_with-number`,
      );
      this.segmentElem.dataset.label = this.label.toString();
    }
    if (typeof this.label === 'string') {
      this.segmentElem.classList.add(`${this.className}_with-name`);
      this.segmentElem.dataset.label = this.label;
    }
  }

  private handleClick(e: MouseEvent) {
    const option = e.target as HTMLDivElement;
    this.viewHandler.handleSelectValue(Number(option.dataset.value));
  }

  private handleKeyPress(e: KeyboardEvent) {
    const option = e.target as HTMLDivElement;
    if (e.key === ' ') {
      e.preventDefault();
      this.viewHandler.handleSelectValue(Number(option.dataset.value));
    }
  }

  private bindEventListeners() {
    this.segmentElem.addEventListener(
      'click',
      this.handleClick.bind(this),
    );
    this.segmentElem.addEventListener(
      'keypress',
      this.handleKeyPress.bind(this),
    );
  }
}

export {
  Segment, ISegment, TSegmentConfig, SegmentNotch,
};
