interface JQuery {
    myJquerySlider: any;
}

interface IMyJquerySlider {
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
    scale ?:boolean | string;
    label ?:boolean;
    vertical ?:boolean;
    lengthPx ?:number;
    indent ?:boolean;
}