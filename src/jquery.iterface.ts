interface JQuery {
    myJquerySlider: any;
}

interface IMyJquerySlider {
    min?: number;
    max?: number;
    value?: number;
    step?: number;    
    orientation?: 'vertical' | 'horizontal';
    isDouble?: boolean;
    minInterval?: number;
    maxInterval?: number;
    limits?: Array<number>;
    active?: number;
    withLabel?: boolean;
    scale?: 'basic' | 'numeric' | 'named';
    list?: string[] | [number, string][];
    // list?: Array<string | Array<number | string>>;
    actuals?: Array<number>; //?
    lengthPx?: number;
    withIndent?: boolean;
}