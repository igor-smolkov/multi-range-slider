type TOrderedLabels = Map<number, string>;

type TDisorderedLabel = string | [number, string];
type TDisorderedLabels = TDisorderedLabel[];

type LabelsListConfig = {
  labelsList: TDisorderedLabels;
  startKey: number;
  step: number;
};

interface ILabelsList {
  update(options: Partial<LabelsListConfig>): void;
  getLabels(): TOrderedLabels;
  getMinKey(): number | null;
  getMaxKey(): number | null;
  getClosestNameByValue(value: number, range: number): string;
  isFlat(): boolean;
}

class LabelsList implements ILabelsList {
  private labels: TOrderedLabels = new Map();

  private step = 1;

  private startKey = 0;

  constructor(options?: Partial<LabelsListConfig>) {
    this.configure({ ...options });
  }

  public update(options: Partial<LabelsListConfig>): void {
    this.configure(options);
  }

  public getLabels(): TOrderedLabels {
    return this.labels;
  }

  public getMinKey(): number | null {
    let min: number | null = null;
    this.labels.forEach((_, key) => {
      const isLess = min === null || key < min;
      if (isLess) min = key;
    });
    return min;
  }

  public getMaxKey(): number | null {
    let max: number | null = null;
    this.labels.forEach((_, key) => {
      const isMore = max === null || key > max;
      if (isMore) max = key;
    });
    return max;
  }

  public getClosestNameByValue(value: number, range: number): string {
    let name: string | undefined = this.labels.get(value);
    if (name) return name;
    let smallestDistance = range;
    let closest = null;
    this.labels.forEach((_, key) => {
      const current = value;
      const distance = key > current ? key - current : current - key;
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closest = key;
      }
    });
    name = closest !== null ? this.labels.get(closest) : name;
    return name as string;
  }

  public isFlat(): boolean {
    let isFlat = true;
    let lastIndex: number | null = null;
    this.labels.forEach((_, index) => {
      const isDistant = lastIndex !== null
        && lastIndex !== index - this.step;
      if (isDistant) isFlat = false;
      lastIndex = index;
    });
    return isFlat;
  }

  private configure(options: Partial<LabelsListConfig>) {
    const config = { ...options };
    this.startKey = config.startKey ?? 0;
    this.step = this.setStep(config.step);
    this.labels = this.orderLabels(config.labelsList);
  }

  private setStep(step?: number) {
    const isValid = step && step > 0;
    this.step = isValid ? step as number : 1;
    return this.step;
  }

  private orderLabels(labels?: TDisorderedLabels) {
    const orderedLabels: TOrderedLabels = new Map();
    const isEmpty = labels === undefined || !labels.length;
    if (isEmpty) return orderedLabels;
    let key: number = this.startKey;
    labels?.forEach((label: TDisorderedLabel) => {
      if (typeof label !== 'string') {
        const specKey: number = label[0];
        const value: string = label[1];
        orderedLabels.set(specKey, value);
        key = specKey > key ? specKey + this.step : key;
      } else {
        orderedLabels.set(key, label);
        key += this.step;
      }
    });
    return orderedLabels;
  }
}

export {
  LabelsList, LabelsListConfig, ILabelsList, TOrderedLabels, TDisorderedLabels,
};
