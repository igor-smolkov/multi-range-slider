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
    isFlat(): boolean;
    getClosestNameByValue(value: number): string;
}

class List implements IList {
    private _items: TOrderedItems;
    private _step: number;
    
    constructor(options: TList = {
        items: [],
        startKey: 0,
        step: 1,
    }) {
        const config = {...options};
        this._step = this._setStep(config.step);
        this._items = this._orderItems(config);
    }

    public update(options: TList) {

    }
    public getItems() {
        return this._items;
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
    public getMaxKey() {
        let max: number | null = null;
        this._items.forEach((_, key) => {
            if (max === null || key > max){
                max = key;
            }
        })
        return max;
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

    private _setStep(step: number) {
        this._step = step && step > 0 ? step : 1;
        return this._step;
    }
    private _orderItems(config: TList) {
        const items: TOrderedItems = new Map();
        if (!config.items) return items;
        let key: number = config.startKey ?? 0;
        config.items.forEach((item: TDisorderedItem) => {
            if (typeof(item) !== 'string') {
                const specKey: number = item[0];
                const value: string = item[1];
                items.set(specKey, value);
                key = specKey > key ? specKey + this._step : key;
            } else {
                items.set(key, item);
                key += this._step;
            }
        })
        return items;
    }
}

export { List, TList, IList, TOrderedItems, TDisorderedItems }