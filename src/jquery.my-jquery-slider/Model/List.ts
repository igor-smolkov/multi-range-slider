class List {
    items :Map<number, string>;
    constructor(items :Map<number, string> = new Map()) {
        this.items = items;
    }
    getName(key :number) {
        if (!this.items.has(key)) return false;
        return this.items.get(key);
    }
    getItems() {
        return this.items;
    }
    isFlat(step: number) {
        let isFlat = true;
        let lastIndex: number | null = null;
        this.items.forEach((_, index) => {
            if (lastIndex !== null && lastIndex !== index - step) {
                isFlat = false;
            }
            lastIndex = index;
        })
        return isFlat;
    }
    getMaxKey() {
        let max: number | null = null;
        this.items.forEach((_, index) => {
            if (max === null || index > max){
                max = index;
            }
        })
        return max;
    }
    getMinKey() {
        let min: number | null = null;
        this.items.forEach((_, index) => {
            if (min === null || index < min){
                min = index;
            }
        })
        return min;
    }
}

export default List;