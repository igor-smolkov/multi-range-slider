import Range from './Range'

interface ISlider {
    minLimit :number;
    maxLimit :number;
    ranges :Array<Range>;
    currentIndex :number;
    step :number;
}

export default ISlider;