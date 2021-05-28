interface IModel {
    min?: number;
    max?: number;
    value?: number;
    step?: number;
    isDouble?: boolean;
    minInterval?: number;
    maxInterval?: number;
    limits?: Array<number>;
    active?: number;
    list?: Array<string | Array<number | string>>;
}

export {IModel};