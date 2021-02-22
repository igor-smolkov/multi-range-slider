interface JQuery {
    myJquerySlider: any;
}

interface ImyJquerySlider {
    minValue?: number;
    maxValue?: number;
    curValue?: number;
    isInterval?: boolean;
    minInterval?: number;
    maxInterval?: number;
    step?: number;
    orientation?: string;
    [key: string]: number | string | boolean;
}