interface IView {
    perValues ?:Array<number>;
    current ?:number;
    min ?:number;
    max ?:number;
    step ?:number;
    scale ?:boolean;
}

export default IView;