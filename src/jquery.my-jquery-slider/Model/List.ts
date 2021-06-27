type TOrderedItems = Map<number, string>;

type TDisorderedItem = string | [number, string];
type TDisorderedItems = TDisorderedItem[];

type TList = {
    items: TDisorderedItems,
    startKey?: number,
    step?: number,
}

class List {
    private _items: TOrderedItems;
    private _step: number;
    
    constructor(options: TList = {
        items: [],
        startKey: 0,
        step: 1,
    }) {
        const config = Object.assign({}, options);
        this._step = this._setStep(config.step);
        this._items = this._orderItems(config);
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
        this._items.forEach((_, index) => {
            if (max === null || index > max){
                max = index;
            }
        })
        return max;
    }
    public getMinKey() {
        let min: number | null = null;
        this._items.forEach((_, index) => {
            if (min === null || index < min){
                min = index;
            }
        })
        return min;
    }

    // private getName(key: number) {
    //     if (!this._items.has(key)) return false;
    //     return this._items.get(key);
    // }

    private _setStep(step: number) {
        this._step = step && step !== 0 ? step : 1;
        return this._step;
    }
    private _orderItems(config: TList) {
        const items: TOrderedItems = new Map();
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

export { List, TList }