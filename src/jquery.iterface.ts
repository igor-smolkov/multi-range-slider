interface JQuery {
    myJquerySlider: any;
}

interface ImyJquerySlider {
    minValue?: number;
    maxValue?: number;
    curValue?: number;
    step?: number;
    orientation?: string;
    [key: string]: number | string;
}