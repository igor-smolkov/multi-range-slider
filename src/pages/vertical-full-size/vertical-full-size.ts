import $ from 'jquery';

import myJQuerySliderFactory from '../../jquery.my-jquery-slider/jquery.my-jquery-slider';
import './vertical-full-size.scss';

myJQuerySliderFactory($);
$('.js-slider').myJQuerySlider({ orientation: 'vertical' });
