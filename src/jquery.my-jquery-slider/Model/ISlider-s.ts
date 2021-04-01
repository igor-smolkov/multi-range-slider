import Range from './Range-s'
import List from './List'

interface ISlider {
    ranges :Array<Range>;
    current ?:number;
}

export default ISlider;