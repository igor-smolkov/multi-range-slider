import './style.scss'
import './jquery.my-jquery-slider/jquery.my-jquery-slider'


$('#config1').text('default');
$('#slider1').myJquerySlider();

$('#config2').text(JSON.stringify({
    min: 10,
    max: 90,
    current: 30,
}, null, 2));
$('#slider2').myJquerySlider({
    min: 10,
    max: 90,
    current: 30,
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
    current: 90,
    step: 12,
}, null, 2));
$('#slider5').myJquerySlider({
    list: ['банан', 'яблоко', 'киви', [33, 'груша'], [50, 'ананас'], 'манго', 'арбуз', [90, 'тыква']],
    min: 9,
    max: 110,
    current: 90,
    step: 12,
});

$('#config6').text(JSON.stringify({
    double: true,
}, null, 2));
$('#slider6').myJquerySlider({
    double: true,
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
    current: 1,
    step: 3,
}, null, 2));
$('#slider8').myJquerySlider({
    list: ['банан', 'яблоко', 'киви', [133, 'груша'], [150, 'ананас'], 'манго', 'арбуз', [170, 'тыква']],
    min: 120,
    max: 180,
    minInterval: 122,
    maxInterval: 178,
    current: 1,
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
    current: 2,
    step: 3,
}, null, 2));
$('#slider14').myJquerySlider({
    limits: [40, 60, 80, 110, 130, 150, 180, 200],
    list: ['банан', 'яблоко', 'киви', [133, 'груша'], [150, 'ананас'], 'манго', 'арбуз', [170, 'тыква']],
    current: 2,
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

$('#config21').text(JSON.stringify({ scale: true }, null, 2));
$('#slider21').myJquerySlider({ scale: true });

$('#config22').text(JSON.stringify({ limits: [200], scale: true }, null, 2));
$('#slider22').myJquerySlider({ limits: [200], scale: true });

$('#config23').text(JSON.stringify({ limits: [205], scale: true }, null, 2));
$('#slider23').myJquerySlider({ limits: [205], scale: true });