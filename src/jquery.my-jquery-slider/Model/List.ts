class List {
    items :Map<number, string>;
    constructor(items :Map<number, string> = new Map()) {
        this.items = items;
    }
    getName(key :number) {
        if (!this.items.has(key)) return false;
        return this.items.get(key);
    }
}

export default List;