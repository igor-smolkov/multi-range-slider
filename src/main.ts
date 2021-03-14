import './style.scss'
import './jquery.my-jquery-slider/jquery.my-jquery-slider'

$('#slider1').myJquerySlider({
    curValue : 75,
});

$('#slider2').myJquerySlider({
    curValue : 25,
});

$('#slider1').on('my-jquery-slider-change', ()=>{
    $('#slider2').myJquerySlider({
        curValue : $('#slider1').val(),
    });
    $('#slider2').width(`${$('#slider1').val()}%`)
})