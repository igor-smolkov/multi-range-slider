type TOrderedItems = Map<number, string>;

type TDisorderedItem = string | [number, string];
type TDisorderedItems = TDisorderedItem[];

type TList = {
  items: TDisorderedItems;
  startKey?: number;
  step?: number;
};

interface IList {
  update(options: TList): void;
  getItems(): TOrderedItems;
  getMinKey(): number | null;
  getMaxKey(): number | null;
  getClosestNameByValue(value: number, range: number): string;
  isFlat(): boolean;
}

class List implements IList {
  private items: TOrderedItems = new Map();

  private step = 1;

  private startKey = 0;

  constructor(options: TList = { items: [] }) {
    this.configure(options);
  }

  public update(options: TList): void {
    this.configure(options);
  }

  public getItems(): TOrderedItems {
    return this.items;
  }

  public getMinKey(): number | null {
    let min: number | null = null;
    this.items.forEach((_, key) => {
      const isLess = min === null || key < min;
      if (isLess) min = key;
    });
    return min;
  }

  public getMaxKey(): number | null {
    let max: number | null = null;
    this.items.forEach((_, key) => {
      const isMore = max === null || key > max;
      if (isMore) max = key;
    });
    return max;
  }

  public getClosestNameByValue(value: number, range: number): string {
    let name: string | undefined = this.items.get(value);
    if (name) return name;
    let smallestDistance = range;
    let closest = null;
    this.items.forEach((_, key) => {
      const current = value;
      const distance = key > current ? key - current : current - key;
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closest = key;
      }
    });
    name = closest !== null ? this.items.get(closest) : name;
    return name as string;
  }

  public isFlat(): boolean {
    let isFlat = true;
    let lastIndex: number | null = null;
    this.items.forEach((_, index) => {
      const isDistant = lastIndex !== null
        && lastIndex !== index - this.step;
      if (isDistant) isFlat = false;
      lastIndex = index;
    });
    return isFlat;
  }

  private configure(options: TList) {
    const config = { ...options };
    this.startKey = config.startKey ?? 0;
    this.step = this.setStep(config.step);
    this.items = this.orderItems(config.items);
  }

  private setStep(step?: number) {
    const isValid = step && step > 0;
    this.step = isValid ? step as number : 1;
    return this.step;
  }

  private orderItems(items: TDisorderedItems) {
    const orderedItems: TOrderedItems = new Map();
    const isEmpty = !items || !items.length;
    if (isEmpty) return orderedItems;
    let key: number = this.startKey;
    items.forEach((item: TDisorderedItem) => {
      if (typeof item !== 'string') {
        const specKey: number = item[0];
        const value: string = item[1];
        orderedItems.set(specKey, value);
        key = specKey > key ? specKey + this.step : key;
      } else {
        orderedItems.set(key, item);
        key += this.step;
      }
    });
    return orderedItems;
  }
}

export {
  List, TList, IList, TOrderedItems, TDisorderedItems,
};
