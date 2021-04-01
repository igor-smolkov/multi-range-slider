import Range from './Range'

class NamedRange extends Range {
    namedList :Array<string>;
    constructor(namedList :Array<string>, currentIndex ?:number) {
        super({
            min: 0,
            max: namedList.length-1,
            value: currentIndex ? currentIndex : 0
        })
        this.namedList = namedList;
    }
    setName(name :string, index :number) {
        this.namedList[index] = name;
        return this.namedList;
    }
    getName(index :number) {
        return this.namedList[super.setValue(index)];
    }
    getNamedList() {
        return this.namedList;
    }
}

export default NamedRange;