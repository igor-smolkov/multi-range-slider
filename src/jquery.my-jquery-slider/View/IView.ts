interface IView {
    root ?:HTMLElement;
    pairsValuePerValue ?:Array< Array<number> >;
    currentIndex ?:number;
}

export default IView;