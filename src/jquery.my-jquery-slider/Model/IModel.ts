interface IModel {
    limits ?:Array<number>;
    actuals ?:Array<number>;
    current ?:number;
    min ?:number;
    max ?:number;
    minInterval ?:number;
    maxInterval ?:number;
    list ?:Array<string | Array<number | string>>;
    double ?:boolean;
    step ?:number;
}

export default IModel;