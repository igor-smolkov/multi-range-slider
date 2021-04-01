interface IModel {
    //
    limits ?:Array<number>;
    actuals ?:Array<number>;
    current ?:number;
    min ?:number;
    max ?:number;
    minInterval ?:number;
    maxInterval ?:number;
    list ?:Array<string | Array<number | string>>;
    //основные
    values ?:Array<number>;
    step ?:number;
    //дополнительные
    // min ?:number;
    // max ?:number;
    // current ?:number;
    currentIndex ?:number;
    // minInterval ?:number;
    // maxInterval ?:number;
    //совместимость
    isInterval ?: boolean;
    maxValue ?:number;
    minValue ?:number;
    curValue ?:number;
}

export default IModel;