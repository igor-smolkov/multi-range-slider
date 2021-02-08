import './style.scss'
import './jquery.my-jquery-slider/jquery.my-jquery-slider'

const form :HTMLFormElement= document.querySelector('.add-slider-form');
form.ok.addEventListener('click', () => {
    const elem = document.createElement('div');
    elem.classList.add(form.divClassName.value);
    document.body.append(elem);
    $('.'+form.divClassName.value).myJquerySlider({
        minValue: +form.minValue.value,
        maxValue: +form.maxValue.value,
        curValue: +form.curValue.value,
        step: +form.step.value,
    });
});
