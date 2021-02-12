import './style.scss'
import './jquery.my-jquery-slider/jquery.my-jquery-slider'

$('.test-slider').myJquerySlider();
$('.test-slider2').myJquerySlider();
$('.test-slider2').myJquerySlider({curValue:10});
console.log($('.test-slider2').myJquerySlider())

// const form :HTMLFormElement= document.querySelector('.add-slider-form');
// form.ok.addEventListener('click', () => {
//     const sliderElem = document.createElement('div');
//     sliderElem.classList.add(form.divClassName.value);
//     document.body.append(sliderElem);
//     $(sliderElem).myJquerySlider({
//         minValue: +form.minValue.value,
//         maxValue: +form.maxValue.value,
//         curValue: +form.curValue.value,
//         step: +form.step.value,
//     });
//     $(sliderElem).on('my-jquery-slider.change', ()=>{
//         // console.log($(sliderElem).myJquerySlider());
//         // showInfo(sliderElem);
//     })
// });

// function showInfo(sliderElem :HTMLElement) {
//     const infoElem :HTMLElement = document.querySelector('.current-value-info');
//     infoElem.innerText = $(sliderElem).val()+'';
// }
