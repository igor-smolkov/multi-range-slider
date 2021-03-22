interface IView {
    root ?:HTMLElement;
    values ?:Array<number>;
    limits ?:Array<number>;
    currentIndex ?:number;
}

export default IView;