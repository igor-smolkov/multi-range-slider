class List {
    private _items: Map<number, string>;
    
    constructor(items: Map<number, string> = new Map()) {
        this._items = items;
    }

    public getItems() {
        return this._items;
    }
    public isFlat(step: number) {
        let isFlat = true;
        let lastIndex: number | null = null;
        this._items.forEach((_, index) => {
            if (lastIndex !== null && lastIndex !== index - step) {
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

    private getName(key: number) {
        if (!this._items.has(key)) return false;
        return this._items.get(key);
    }
}

export {List}