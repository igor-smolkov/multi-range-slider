interface IView {
    root?: HTMLElement;
    min?: number;
    max?: number;
    value?: number;
    step?: number;
    orientation?: 'vertical' | 'horizontal';
    perValues?: Array<number>;
    active?: number;
    actuals?: number[];
    withLabel?: boolean;
    scale?: 'basic' | 'numeric' | 'named';
    list?: Map<number, string>;
    lengthPx?: number;
    withIndent?: boolean;
}

export {IView};