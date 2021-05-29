import {Range} from './Range'

interface ISlider {
    ranges: Range[];
    active?: number;
    step?: number;
    actuals?: number[];
}

export {ISlider};