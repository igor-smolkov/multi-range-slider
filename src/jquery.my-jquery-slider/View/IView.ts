interface IView {
    perValues ?:Array<number>;
    current ?:number;
    min ?:number;
    max ?:number;
    step ?:number;
    scale ?:boolean;
    vertical ?:boolean;
    lengthPx ?:number;
    indent ?:boolean;
}

export default IView;