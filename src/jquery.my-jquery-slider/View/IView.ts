interface IView {
    perValues ?:Array<number>;
    current ?:number;
    min ?:number;
    max ?:number;
    step ?:number;
    list ?:Map<number, string>;
    scale ?:boolean | string;
    vertical ?:boolean;
    lengthPx ?:number;
    indent ?:boolean;
}

export default IView;