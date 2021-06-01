import './style.scss'
import './jquery.my-jquery-slider/jquery.my-jquery-slider'

// текущ
$('#value-slider').myJquerySlider({ value: 50 });
$('#value-slider').on('my-jquery-slider-value', updateTest);
$('#value-field').on('input', () => {
    $('#test-slider').myJquerySlider({ value: +$('#value-field').val() });
})
$('#test-slider').on('my-jquery-slider-value', () => {
    const value = $('#test-slider').data().value;
    $('#value-field').val(value);
    $('#value-slider').myJquerySlider({ value: value });
});
//мин
$('#min-slider').myJquerySlider({ 
    value: $('#value-slider').data().min,
    max: $('#value-slider').data().value,
});
$('#min-slider').on('my-jquery-slider-value', updateTest);
$('#min-field').on('input', () => {
    $('#test-slider').myJquerySlider({ min: +$('#min-field').val() });
})
//макс
$('#max-slider').myJquerySlider({ 
    value: $('#value-slider').data().max,
    min: $('#value-slider').data().value,
});
$('#max-slider').on('my-jquery-slider-value', updateTest);
$('#max-field').on('input', () => {
    $('#test-slider').myJquerySlider({ min: +$('#max-field').val() });
})
updateTest();
function updateTest() {
    const value = $('#value-slider').data().value;
    $('#value-field').val(value);
    const min = $('#min-slider').data().value;
    $('#min-field').val(min);
    const max = $('#max-slider').data().value;
    $('#max-field').val(max);
    const check1: HTMLInputElement = document.querySelector('#scale-toggle');
    let scale: 'basic' | 'numeric' | 'named' = check1.checked ? 'basic' : undefined;
    const check2: HTMLInputElement = document.querySelector('#scale-numeric');
    scale = check2.checked ? 'numeric' : scale;
    const check3: HTMLInputElement = document.querySelector('#scale-named');
    scale = check3.checked ? 'named' : scale;

    const config: IMyJquerySlider = {
        value: value,
        min: min,
        max: max,
    }
    if (scale !== null) {
        config.scale = scale;
    }
    $('#test-slider').myJquerySlider(config);
}
//шкала
$('#scale-toggle').on('change', (e) => {
    const check = e.target as HTMLInputElement;
    $('#test-slider').myJquerySlider({ scale: check.checked ? 'basic' : undefined });
    const numericCheck = document.querySelector('#scale-numeric') as HTMLInputElement;
    numericCheck.checked = false;
    const namedCheck = document.querySelector('#scale-named') as HTMLInputElement;
    namedCheck.checked = false;
})
$('#scale-numeric').on('change', (e) => {
    const check = e.target as HTMLInputElement;
    $('#test-slider').myJquerySlider({ scale: check.checked ? 'numeric' : 'basic' });
    const noneCheck = document.querySelector('#scale-toggle') as HTMLInputElement;
    noneCheck.checked = true;
    const namedCheck = document.querySelector('#scale-named') as HTMLInputElement;
    namedCheck.checked = false;
})
$('#scale-named').on('change', (e) => {
    const check = e.target as HTMLInputElement;
    $('#test-slider').myJquerySlider({ scale: check.checked ? 'named' : 'basic' });
    const noneCheck = document.querySelector('#scale-toggle') as HTMLInputElement;
    noneCheck.checked = true;
    const numericCheck = document.querySelector('#scale-numeric') as HTMLInputElement;
    numericCheck.checked = false;
})


$('#config1').text('default');
$('#slider1').myJquerySlider();

$('#config2').text(JSON.stringify({
    min: 10,
    max: 90,
    value: 30,
}, null, 2));
$('#slider2').myJquerySlider({
    min: 10,
    max: 90,
    value: 30,
});

$('#config3').text(JSON.stringify({
    list: ['банан', 'яблоко', 'киви', 'груша', 'ананас', 'манго', 'арбуз', 'тыква'],
}, null, 2));
$('#slider3').myJquerySlider({
    list: ['банан', 'яблоко', 'киви', 'груша', 'ананас', 'манго', 'арбуз', 'тыква'],
});

$('#config4').text(JSON.stringify({
    list: [[10, 'банан'], [14, 'яблоко'], [21, 'киви'], [33, 'груша'], [50, 'ананас'], [70, 'манго'], [85, 'арбуз'], [90, 'тыква']],
}, null, 2));
$('#slider4').myJquerySlider({
    list: [[10, 'банан'], [14, 'яблоко'], [21, 'киви'], [33, 'груша'], [50, 'ананас'], [70, 'манго'], [85, 'арбуз'], [90, 'тыква']],
});

$('#config5').text(JSON.stringify({
    list: ['банан', 'яблоко', 'киви', [33, 'груша'], [50, 'ананас'], 'манго', 'арбуз', [90, 'тыква']],
    min: 9,
    max: 110,
    value: 90,
    step: 12,
}, null, 2));
$('#slider5').myJquerySlider({
    list: ['банан', 'яблоко', 'киви', [33, 'груша'], [50, 'ананас'], 'манго', 'арбуз', [90, 'тыква']],
    min: 9,
    max: 110,
    value: 90,
    step: 12,
});

$('#config6').text(JSON.stringify({
    isDouble: true,
}, null, 2));
$('#slider6').myJquerySlider({
    isDouble: true,
});

$('#config7').text(JSON.stringify({
    minInterval: 22,
    maxInterval: 78,
}, null, 2));
$('#slider7').myJquerySlider({
    minInterval: 22,
    maxInterval: 78,
});

$('#config8').text(JSON.stringify({
    list: ['банан', 'яблоко', 'киви', [133, 'груша'], [150, 'ананас'], 'манго', 'арбуз', [170, 'тыква']],
    min: 120,
    max: 180,
    minInterval: 122,
    maxInterval: 178,
    active: 1,
    step: 3,
}, null, 2));
$('#slider8').myJquerySlider({
    list: ['банан', 'яблоко', 'киви', [133, 'груша'], [150, 'ананас'], 'манго', 'арбуз', [170, 'тыква']],
    min: 120,
    max: 180,
    minInterval: 122,
    maxInterval: 178,
    active: 1,
    step: 3,
});

$('#config9').text(JSON.stringify({
    limits: [40],
}, null, 2));
$('#slider9').myJquerySlider({
    limits: [40],
});

$('#config10').text(JSON.stringify({
    limits: [40, 60],
}, null, 2));
$('#slider10').myJquerySlider({
    limits: [40, 60],
});

$('#config11').text(JSON.stringify({
    limits: [40, 60, 80],
}, null, 2));
$('#slider11').myJquerySlider({
    limits: [40, 60, 80],
});

$('#config12').text(JSON.stringify({
    limits: [40, 60, 80, 110],
}, null, 2));
$('#slider12').myJquerySlider({
    limits: [40, 60, 80, 110],
});

$('#config13').text(JSON.stringify({
    limits: [40, 60, 80, 110, 130, 150, 180, 200],
}, null, 2));
$('#slider13').myJquerySlider({
    limits: [40, 60, 80, 110, 130, 150, 180, 200],
});

$('#config14').text(JSON.stringify({
    limits: [40, 60, 80, 110, 130, 150, 180, 200],
    list: ['банан', 'яблоко', 'киви', [133, 'груша'], [150, 'ананас'], 'манго', 'арбуз', [170, 'тыква']],
    active: 2,
    step: 3,
}, null, 2));
$('#slider14').myJquerySlider({
    limits: [40, 60, 80, 110, 130, 150, 180, 200],
    list: ['банан', 'яблоко', 'киви', [133, 'груша'], [150, 'ананас'], 'манго', 'арбуз', [170, 'тыква']],
    active: 2,
    step: 3,
});

$('#config15').text(JSON.stringify({ limits: [1, 2, 3, 4, 5] }, null, 2));
$('#slider15').myJquerySlider({ limits: [1, 2, 3, 4, 5] });

$('#config16').text(JSON.stringify({ limits: [1, 2, 3, 4, 5, 6] }, null, 2));
$('#slider16').myJquerySlider({ limits: [1, 2, 3, 4, 5, 6] });

$('#config17').text(JSON.stringify({ limits: [1, 2, 3, 4, 5, 6, 7] }, null, 2));
$('#slider17').myJquerySlider({ limits: [1, 2, 3, 4, 5, 6, 7] });

$('#config18').text(JSON.stringify({ limits: [1, 2, 3, 4, 5, 6, 7, 8] }, null, 2));
$('#slider18').myJquerySlider({ limits: [1, 2, 3, 4, 5, 6, 7, 8] });

$('#config19').text(JSON.stringify({ limits: [1, 2, 3, 4, 5, 6, 7, 8, 9] }, null, 2));
$('#slider19').myJquerySlider({ limits: [1, 2, 3, 4, 5, 6, 7, 8, 9] });

$('#config20').text(JSON.stringify({ limits: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, null, 2));
$('#slider20').myJquerySlider({ limits: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] });

$('#config21').text(JSON.stringify({ scale: 'basic' }, null, 2));
$('#slider21').myJquerySlider({ scale: 'basic' });

$('#config22').text(JSON.stringify({ limits: [200], scale: 'basic' }, null, 2));
$('#slider22').myJquerySlider({ limits: [200], scale: 'basic' });

$('#config23').text(JSON.stringify({ limits: [205], scale: 'basic' }, null, 2));
$('#slider23').myJquerySlider({ limits: [205], scale: 'basic' });

$('#config24').text(JSON.stringify({ isDouble: true, scale: 'basic' }, null, 2));
$('#slider24').myJquerySlider({ isDouble: true, scale: 'basic' });

$('#config25').text(JSON.stringify({ limits: [100, 200, 300, 400, 500, 600], scale: 'basic' }, null, 2));
$('#slider25').myJquerySlider({ limits: [100, 200, 300, 400, 500, 600], scale: 'basic' });

$('#config26').text(JSON.stringify({
    limits: [40, 60, 80, 110, 130, 150, 180, 200],
    list: ['банан', 'яблоко', 'киви', [133, 'груша'], [150, 'ананас'], 'манго', 'арбуз', [170, 'тыква']],
    active: 2,
    step: 3,
    scale: 'basic',
}, null, 2));
$('#slider26').myJquerySlider({
    limits: [40, 60, 80, 110, 130, 150, 180, 200],
    list: ['банан', 'яблоко', 'киви', [133, 'груша'], [150, 'ананас'], 'манго', 'арбуз', [170, 'тыква']],
    active: 2,
    step: 3,
    scale: 'basic',
});

$('#config27').text(JSON.stringify({orientation: 'vertical'}, null, 2));
$('#slider27').myJquerySlider({orientation: 'vertical'});

$('#config28').text(JSON.stringify({ limits: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], orientation: 'vertical' }, null, 2));
$('#slider28').myJquerySlider({ limits: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], orientation: 'vertical' });

$('#config29').text(JSON.stringify({orientation: 'vertical', scale: 'basic'}, null, 2));
$('#slider29').myJquerySlider({orientation: 'vertical', scale: 'basic'});

$('#config30').text(JSON.stringify({
  limits: [40, 60, 80, 110, 130, 150, 180, 200],
  list: ['банан', 'яблоко', 'киви', [133, 'груша'], [150, 'ананас'], 'манго', 'арбуз', [170, 'тыква']],
  active: 2,
  step: 3,
  scale: 'basic',
  orientation: 'vertical',
}, null, 2));
$('#slider30').myJquerySlider({
  limits: [40, 60, 80, 110, 130, 150, 180, 200],
  list: ['банан', 'яблоко', 'киви', [133, 'груша'], [150, 'ананас'], 'манго', 'арбуз', [170, 'тыква']],
  active: 2,
  step: 3,
  scale: 'basic',
  orientation: 'vertical',
});

$('#config31').text(JSON.stringify({ limits: [205], scale: 'basic', orientation: 'vertical' }, null, 2));
$('#slider31').myJquerySlider({ limits: [205], scale: 'basic', orientation: 'vertical' });

$('#config32').text(JSON.stringify({ scale: 'basic', orientation: 'vertical', lengthPx: 200, withIndent: false }, null, 2));
$('#slider32').myJquerySlider({ scale: 'basic', orientation: 'vertical', lengthPx: 200, withIndent: false });

$('#config33').text(JSON.stringify({ limits: [10], scale: 'basic', orientation: 'vertical', lengthPx: 90 }, null, 2));
$('#slider33').myJquerySlider({ limits: [10], scale: 'basic', orientation: 'vertical', lengthPx: 90 });

$('#config34').text(JSON.stringify({ scale: 'basic', withIndent: false }, null, 2));
$('#slider34').myJquerySlider({ scale: 'basic', withIndent: false });

$('#config35').text(JSON.stringify({ scale: 'basic', lengthPx: 1000 }, null, 2));
// $('#slider35').myJquerySlider({ scale: 'basic', lengthPx: 1000 });

$('#config36').text(JSON.stringify({ scale: 'numeric' }, null, 2));
$('#slider36').myJquerySlider({ scale: 'numeric' });

$('#config37').text(JSON.stringify({ scale: 'numeric', orientation: 'vertical' }, null, 2));
$('#slider37').myJquerySlider({ scale: 'numeric', orientation: 'vertical' });

$('#config38').text(JSON.stringify({ scale: 'numeric', orientation: 'vertical', lengthPx: 800 }, null, 2));
$('#slider38').myJquerySlider({ scale: 'numeric', orientation: 'vertical', lengthPx: 800 });

$('#config39').text(JSON.stringify({ 
    list: ['банан', 'яблоко', 'киви', 'груша', 'ананас', 'манго', 'арбуз', 'тыква'],
    scale: 'named',
}, null, 2));
$('#slider39').myJquerySlider({ 
    list: ['банан', 'яблоко', 'киви', 'груша', 'ананас', 'манго', 'арбуз', 'тыква'],
    scale: 'named',
});

$('#config40').text(JSON.stringify({ 
    list: ['банан', 'яблоко', 'киви', 'груша', 'ананас', 'манго', 'арбуз', 'тыква'],
    scale: 'named',
    orientation: 'vertical',
}, null, 2));
$('#slider40').myJquerySlider({ 
    list: ['банан', 'яблоко', 'киви', 'груша', 'ананас', 'манго', 'арбуз', 'тыква'],
    scale: 'named',
    orientation: 'vertical',
});

$('#config41').text(JSON.stringify({
    list: ['банан', 'яблоко', 'киви', [133, 'груша'], [150, 'ананас'], 'манго', 'арбуз', [170, 'тыква']],
    min: 120,
    max: 180,
    minInterval: 122,
    maxInterval: 178,
    active: 1,
    step: 3,
    scale: 'numeric',
}, null, 2));
$('#slider41').myJquerySlider({
    list: ['банан', 'яблоко', 'киви', [133, 'груша'], [150, 'ананас'], 'манго', 'арбуз', [170, 'тыква']],
    min: 120,
    max: 180,
    minInterval: 122,
    maxInterval: 178,
    active: 1,
    step: 3,
    scale: 'numeric',
});

$('#config42').text(JSON.stringify({
    list: ['банан', 'яблоко', 'киви', [133, 'груша'], [150, 'ананас'], 'манго', 'арбуз', [170, 'тыква']],
    min: 120,
    max: 180,
    minInterval: 122,
    maxInterval: 178,
    active: 1,
    step: 3,
    scale: 'named',
}, null, 2));
$('#slider42').myJquerySlider({
    list: ['банан', 'яблоко', 'киви', [133, 'груша'], [150, 'ананас'], 'манго', 'арбуз', [170, 'тыква']],
    min: 120,
    max: 180,
    minInterval: 122,
    maxInterval: 178,
    active: 1,
    step: 3,
    scale: 'named',
});

$('#config43').text(JSON.stringify({
    list: ['банан', 'яблоко', 'киви', [133, 'груша'], [150, 'ананас'], 'манго', 'арбуз', [170, 'тыква']],
    min: 120,
    max: 180,
    minInterval: 122,
    maxInterval: 178,
    active: 1,
    step: 3,
    scale: 'numeric',
    orientation: 'vertical',
}, null, 2));
$('#slider43').myJquerySlider({
    list: ['банан', 'яблоко', 'киви', [133, 'груша'], [150, 'ананас'], 'манго', 'арбуз', [170, 'тыква']],
    min: 120,
    max: 180,
    minInterval: 122,
    maxInterval: 178,
    active: 1,
    step: 3,
    scale: 'numeric',
    orientation: 'vertical',
});

$('#config44').text(JSON.stringify({
    list: ['банан', 'яблоко', 'киви', [133, 'груша'], [150, 'ананас'], 'манго', 'арбуз', [170, 'тыква']],
    min: 120,
    max: 180,
    minInterval: 122,
    maxInterval: 178,
    active: 1,
    step: 3,
    scale: 'named',
    orientation: 'vertical',
}, null, 2));
$('#slider44').myJquerySlider({
    list: ['банан', 'яблоко', 'киви', [133, 'груша'], [150, 'ананас'], 'манго', 'арбуз', [170, 'тыква']],
    min: 120,
    max: 180,
    minInterval: 122,
    maxInterval: 178,
    active: 1,
    step: 3,
    scale: 'named',
    orientation: 'vertical',
});

$('#config45').text(JSON.stringify({ withLabel: true }, null, 2));
$('#slider45').myJquerySlider({ withLabel: true });

//--------------------------------

$('#config46').text(JSON.stringify({}, null, 2));
$('#slider46').myJquerySlider();
$('#config46-1').text(JSON.stringify($('#slider46').data(), null, 2));
$('#slider46').myJquerySlider({
    list: ['банан', 'яблоко', 'киви', [133, 'груша'], [150, 'ананас'], 'манго', 'арбуз', [170, 'тыква']],
    min: 120,
    max: 180,
    minInterval: 122,
    maxInterval: 178,
    active: 1,
    step: 3,
    scale: 'named',
    orientation: 'vertical',
});
$('#config46-2').text(JSON.stringify($('#slider46').data(), null, 2));