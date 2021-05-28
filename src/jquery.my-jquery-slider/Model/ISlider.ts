import {Range} from './Range'

interface ISlider {
    ranges: Range[];
    active?: number;
    step?: number;
}

export {ISlider};