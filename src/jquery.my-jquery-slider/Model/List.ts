type TOrderedItems = Map<number, string>;

type TDisorderedItem = string | [number, string];
type TDisorderedItems = TDisorderedItem[];

type TList = {
    items: TDisorderedItems;
    startKey?: number;
    step?: number;
}

interface IList {
    update(options: TList): void;
    getItems(): TOrderedItems;
    getMinKey(): number;
    getMaxKey(): number;
    getClosestNameByValue(value: number): string;
    isFlat(): boolean;
}

class List implements IList {
    private _items: TOrderedItems;
    private _step: number;
    private _startKey: number;
    
    constructor(options: TList = { items: [] }) {
        this._configurate(options);
    }

    public update(options: TList) {
        this._configurate(options);
    }
    public getItems() {
        return this._items;
    }
    public getMinKey() {
        let min: number | null = null;
        this._items.forEach((_, key) => {
            if (min === null || key < min){
                min = key;
            }
        })
        return min;
    }
    public getMaxKey() {
        let max: number | null = null;
        this._items.forEach((_, key) => {
            if (max === null || key > max){
                max = key;
            }
        })
        return max;
    }
    public getClosestNameByValue(value: number): string {
        let name :string = this._items.get(value);
        if (name) return name;
        let smallestDistance = this.getMaxKey()-this.getMinKey();
        let closest = null;
        this._items.forEach((_, key) => {
            const current = value;
            const distance = key > current ? key - current : current - key;
            if (distance < smallestDistance) {
                smallestDistance = distance;
                closest = key;
            }
        });
        name = closest !== null ? this._items.get(closest) : name;
        return name;
    }
    public isFlat() {
        let isFlat = true;
        let lastIndex: number | null = null;
        this._items.forEach((_, index) => {
            if (lastIndex !== null && lastIndex !== index - this._step) {
                isFlat = false;
            }
            lastIndex = index;
        })
        return isFlat;
    }

    private _configurate(options: TList) {
        const config = {...options};
        this._startKey = config.startKey ?? 0;
        this._step = this._setStep(config.step);
        this._items = this._orderItems(config.items);
    }
    private _setStep(step: number) {
        this._step = step && step > 0 ? step : 1;
        return this._step;
    }
    private _orderItems(items: TDisorderedItems) {
        const orderedItems: TOrderedItems = new Map();
        if (!items || !items.length) return orderedItems;
        let key: number = this._startKey;
        items.forEach((item: TDisorderedItem) => {
            if (typeof(item) !== 'string') {
                const specKey: number = item[0];
                const value: string = item[1];
                orderedItems.set(specKey, value);
                key = specKey > key ? specKey + this._step : key;
            } else {
                orderedItems.set(key, item);
                key += this._step;
            }
        })
        return orderedItems;
    }
}

export { List, TList, IList, TOrderedItems, TDisorderedItems }