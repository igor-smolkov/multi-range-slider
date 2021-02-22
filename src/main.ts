import './style.scss'
import './jquery.my-jquery-slider/jquery.my-jquery-slider'

const inOutControl :HTMLElement = document.querySelector('.in-out-control');
const input :HTMLElement = inOutControl.querySelector('.input');
const output :HTMLElement = inOutControl.querySelector('.output');

const form :HTMLFormElement= input.querySelector('.add-slider-form');
form.switchToInterval.addEventListener('change', ()=>{
    form.curValue.disabled = !form.curValue.disabled;
    form.minInterval.disabled = !form.minInterval.disabled;
    form.maxInterval.disabled = !form.maxInterval.disabled;
});
form.ok.addEventListener('click', () => {
    const sliderElem = document.createElement('div');

    if (form.divClassName.value[0] === '#') { sliderElem.id = form.divClassName.value.substring(1); }
    else if (form.divClassName.value[0] === '.') { sliderElem.classList.add(form.divClassName.value.substring(1)); }
    else { sliderElem.classList.add(form.divClassName.value); }
    
    document.body.append(sliderElem);
    $(sliderElem).myJquerySlider({
        minValue: +form.minValue.value,
        maxValue: +form.maxValue.value,
        curValue: +form.curValue.value,
        isInterval: form.switchToInterval.checked,
        minInterval: +form.minInterval.value,
        maxInterval: +form.maxInterval.value,
        step: +form.step.value,
        orientation: form.orientation.value,
    });
    $(sliderElem).on('my-jquery-slider.input', ()=>{
        showInfo(sliderElem);
    })
});

function showInfo(sliderElem :HTMLElement) {
    output.innerHTML = '';

    const info = createElem('ul', 'info');
    output.append(info);

    info.append(createElem('li', 'info__option info__option_id', `ID: ${sliderElem.id}`));
    info.append(createElem('li', 'info__option info__option_class', `Class: ${sliderElem.className}`));
    info.append(createElem('li', 'info__option info__option_maxValue', `Максимальное значение: ${$(sliderElem).data().maxValue}`));
    info.append(createElem('li', 'info__option info__option_minValue', `Минимальное значение: ${$(sliderElem).data().minValue}`));
    info.append(createElem('li', 'info__option info__option_curValue', `Текущее значение: ${$(sliderElem).data().curValue}`));
    info.append(createElem('li', 'info__option info__option_isInterval', `Это диапазон?: ${$(sliderElem).data().isInterval}`));
    info.append(createElem('li', 'info__option info__option_minInterval', `Интервал от: ${$(sliderElem).data().minInterval}`));
    info.append(createElem('li', 'info__option info__option_maxInterval', `Интервал до: ${$(sliderElem).data().maxInterval}`));
    info.append(createElem('li', 'info__option info__option_step', `Шаг: ${$(sliderElem).data().step}`));
    info.append(createElem('li', 'info__option info__option_orientation', `Ориентация: ${$(sliderElem).data().orientation}`));

    function createElem(tag :string,className :string, text :string = null) {
        const elem :HTMLElement = document.createElement(tag);
        if (text !== null) { elem.innerText = text; }
        elem.className = className;
        return elem;
    }
}