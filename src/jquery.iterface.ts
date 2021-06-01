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
    limits?: number[];
    active?: number;
    withLabel?: boolean;
    scale?: 'basic' | 'numeric' | 'named';
    list?: string[] | [number, string][];
    actuals?: number[];
    lengthPx?: number;
    withIndent?: boolean;
}