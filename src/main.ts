import './style.scss'
import './jquery.my-jquery-slider/jquery.my-jquery-slider'

$('#slider').myJquerySlider({
    list: [
        [50, 'картошка'],
        [10, 'чипсы'],
        [90, 'капуста'],
        [60, 'йогурт'],
    ],
    current: 2,
});