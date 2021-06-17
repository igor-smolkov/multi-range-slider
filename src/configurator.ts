$('#test-slider').myJquerySlider();
$('#config-in').text('default');

$('#test-slider').on('my-jquery-slider-value', updatePanel);

function updatePanel() {
  const configNow = $('#test-slider').data();
  $('#config-now').text(JSON.stringify(configNow, null, 2));

  $('#value-slider').myJquerySlider({ value: configNow.value });
  $('#value-field').val(configNow.value);

  $('#min-slider').myJquerySlider({ 
    max: configNow.value,
    value: configNow.min,
  });
  $('#min-field').val(configNow.min);

  $('#max-slider').myJquerySlider({ 
    min: configNow.value,
    value: configNow.max,
  });
  $('#max-field').val(configNow.max);

  $('#step-slider').myJquerySlider({
    value: configNow.step,
  });
  $('#step-field').val(configNow.step);

  if (configNow.orientation === 'horizontal') {
    $('input[name="orientation"][value="horizontal"]').prop('checked', true);
  } else {
    $('input[name="orientation"][value="vertical"]').prop('checked', true);
  }

  $('#min-interval-slider').myJquerySlider({
    value: configNow.minInterval,
    max: configNow.maxInterval,
  });
  $('#min-interval-field').val(configNow.minInterval);
  $('#max-interval-slider').myJquerySlider({
    value: configNow.maxInterval,
    min: configNow.minInterval,
  });
  $('#max-interval-field').val(configNow.maxInterval);

  configNow.limits.forEach((value: number, index: number) => {
    $(`#limits-field-${index}`).val(value);
  });

  $('#active-field').val(configNow.active);

  configNow.actuals.forEach((value: number, index: number) => {
    $(`#actuals-field-${index}`).val(value);
  });
}

function updateTest(from: string = 'other') {
  const limits = [];
  for(let i = 0; i < limitsCount; i++) {
    limits.push(+$(`#limits-field-${i}`).val());
  }
  const list = [];
  for(let i = 0; i < listCount; i++) {
    if ($(`#list-field-${i}`).val() !== '') {
      list.push([+$(`#list-pos-field-${i}`).val(), $(`#list-name-field-${i}`).val()])
    } else {
      list.push($(`#list-text-field-${i}`).val());
    }
  }
  const actuals = [];
  for(let i = 0; i < actualsCount; i++) {
    actuals.push(+$(`#actuals-field-${i}`).val());
  }
  const config = {
    value: $('#value-toggle').is(':checked') ? +$('#value-field').val() : undefined,
    min: $('#min-toggle').is(':checked') ? +$('#min-field').val() : undefined,
    max: $('#max-toggle').is(':checked') ? +$('#max-field').val() : undefined,
    step: $('#step-toggle').is(':checked') ? +$('#step-field').val() : undefined,
    orientation: $('#orientation-toggle').is(':checked') ? $('input[name="orientation"]').is(':checked') ? $('input[name="orientation"]:checked').val() : undefined : undefined,
    isDouble: $('#double-toggle').is(':checked') ? true : undefined,
    minInterval: $('#min-interval-toggle').is(':checked') ? +$('#min-interval-field').val() : undefined,
    maxInterval: $('#max-interval-toggle').is(':checked') ? +$('#max-interval-field').val() : undefined,
    limits: $('#limits-toggle').is(':checked') ? limits : undefined,
    active: $('#active-toggle').is(':checked') ? +$('#active-field').val() : undefined,
    withLabel: $('#label-toggle').is(':checked') ? true : undefined,
    scale: $('#scale-toggle').is(':checked') ? $('input[name="scale"]').is(':checked') ? $('input[name="scale"]:checked').val() : undefined : undefined,
    list: $('#list-toggle').is(':checked') ? list : undefined,
    actuals: $('#actuals-toggle').is(':checked') ? actuals : undefined,
    lengthPx: $('#length-toggle').is(':checked') ? +$('#length-field').val() : undefined,
    withIndent: $('#indent-toggle').is(':checked') ? false : undefined,
  }
  $('#test-slider').myJquerySlider(config);
  $('#config-in').text(JSON.stringify(config, null, 2));

  const configNow = $('#test-slider').data();
  $('#config-now').text(JSON.stringify(configNow, null, 2));


  if (from !== 'value') {
    $('#value-slider').myJquerySlider({ 
      min: configNow.min,
      max: configNow.max,
      step: configNow.step,
    });
  }
  if (from !== 'min') {
    $('#min-slider').myJquerySlider({ 
      max: configNow.value,
      step: configNow.step,
    });
  }
  if (from !== 'max') {
    $('#max-slider').myJquerySlider({ 
      min: configNow.value,
      step: configNow.step,
    });
  }
  if (from !== 'min-interval') {
    $('#min-interval-slider').myJquerySlider({ 
      max: configNow.maxInterval,
      step: configNow.step,
    });
  }
  if (from !== 'max-interval') {
    $('#max-interval-slider').myJquerySlider({ 
      min: configNow.minInterval,
      step: configNow.step,
    });
  }
  if (from !== 'limits') {
    configNow.limits.forEach((value: number, index: number) => {
      if (limitsCount <= index) {
        addLimit();
      }
      $(`#limits-field-${index}`).val(value);
    });
  }
  if (from !== 'limits') {
    configNow.list.forEach((value: number, index: number) => {
      if (listCount <= index) {
        addListItem();
      }
      $(`#limits-name-field-${index}`).val(value);
    });
  }
  if (from !== 'actuals') {
    configNow.actuals.forEach((value: number, index: number) => {
      if (actualsCount <= index) {
        addActual();
      }
      $(`#actuals-field-${index}`).val(value);
    });
  }
}

$('#value-toggle').on('change', ()=>updateTest('value'));
$('#value-slider').on('my-jquery-slider-value', ()=>{
  $('#value-field').val($('#value-slider').data().value);
  if ($('#value-toggle').is(':checked')) {
    updateTest('value');
  }
});
$('#value-field').on('change', ()=>{
  if ($('#value-toggle').is(':checked')) {
    updateTest('value');
  }
});

$('#min-toggle').on('change', ()=>updateTest('min'));
$('#min-slider').on('my-jquery-slider-value', ()=>{
  $('#min-field').val($('#min-slider').data().value);
  if ($('#min-toggle').is(':checked')) {
    updateTest('min');
  }
});
$('#min-field').on('change', ()=>{
  if ($('#min-toggle').is(':checked')) {
    updateTest('min');
  }
});

$('#max-toggle').on('change', ()=>updateTest('max'));
$('#max-slider').on('my-jquery-slider-value', ()=>{
  $('#max-field').val($('#max-slider').data().value);
  if ($('#max-toggle').is(':checked')) {
    updateTest('max');
  }
});
$('#max-field').on('change', ()=>{
  if ($('#max-toggle').is(':checked')) {
    updateTest('max');
  }
});

$('#step-toggle').on('change', ()=>updateTest());
$('#step-slider').on('my-jquery-slider-value', ()=>{
  $('#step-field').val($('#step-slider').data().value);
  if ($('#step-toggle').is(':checked')) {
    updateTest();
  }
});
$('#step-field').on('change', ()=>{
  if ($('#step-toggle').is(':checked')) {
    updateTest();
  }
});

$('#orientation-toggle').on('change', ()=>updateTest());
$('#orientation-horizontal').on('change', ()=>{
  if ($('#orientation-toggle').is(':checked')) {
    updateTest();
  }
});
$('#orientation-vertical').on('change', ()=>{
  if ($('#orientation-toggle').is(':checked')) {
    updateTest();
  }
});

$('#double-toggle').on('change', ()=>updateTest());

$('#min-interval-toggle').on('change', ()=>updateTest('min-interval'));
$('#min-interval-slider').on('my-jquery-slider-value', ()=>{
  $('#min-interval-field').val($('#min-interval-slider').data().value);
  if ($('#min-interval-toggle').is(':checked')) {
    updateTest('min-interval');
  }
});
$('#min-interval-field').on('change', ()=>{
  if ($('#min-interval-toggle').is(':checked')) {
    updateTest('min-interval');
  }
});

$('#max-interval-toggle').on('change', ()=>updateTest('max-interval'));
$('#max-interval-slider').on('my-jquery-slider-value', ()=>{
  $('#max-interval-field').val($('#max-interval-slider').data().value);
  if ($('#max-interval-toggle').is(':checked')) {
    updateTest('max-interval');
  }
});
$('#max-interval-field').on('change', ()=>{
  if ($('#max-interval-toggle').is(':checked')) {
    updateTest('max-interval');
  }
});

$('#limits-toggle').on('change', ()=>updateTest('limits'));
$('#limits-add').on('click', (e)=>addLimit(e));
$('#limits-del').on('click', (e)=>delLimit(e));
let limitsCount = 0;
addLimit();
addLimit();
addLimit();
function addLimit(e: any = null) {
  if (e !== null) { e.preventDefault(); }
  const field = $(`<input id="limits-field-${limitsCount}" type="number">`);
  field.on('change', ()=>{
    if ($('#limits-toggle').is(':checked')) {
      updateTest('limits');
    }
  });
  $('#limits-fields').append(field);
  limitsCount++;
}
function delLimit(e: any = null) {
  if (e !== null) { e.preventDefault(); }
  limitsCount--;
  $(`#limits-field-${limitsCount}`).detach();
  updateTest('limits');
}

$('#active-toggle').on('change', ()=>updateTest());
$('#active-field').on('change', ()=>{
  if ($('#active-toggle').is(':checked')) {
    updateTest();
  }
});

$('#label-toggle').on('change', ()=>updateTest());

$('#scale-toggle').on('change', ()=>{
  $('input[name="scale"][value="basic"]').prop('checked', $('#scale-toggle').is(':checked'));
  updateTest();
});
$('#scale-basic').on('change', ()=>{
  if ($('#scale-toggle').is(':checked')) {
    updateTest();
  }
});
$('#scale-numeric').on('change', ()=>{
  if ($('#scale-toggle').is(':checked')) {
    updateTest();
  }
});
$('#scale-named').on('change', ()=>{
  if ($('#scale-toggle').is(':checked')) {
    updateTest();
  }
});

$('#list-toggle').on('change', ()=>updateTest('list'));
$('#list-add').on('click', (e)=>addListItem(e));
$('#list-del').on('click', (e)=>delListItem(e));
let listCount = 0;
function addListItem(e: any = null) {
  if (e !== null) { e.preventDefault(); }
  const posField = $(`<input id="list-pos-field-${listCount}" type="number">`);
  posField.on('change', ()=>{
    if ($('#list-toggle').is(':checked')) {
      updateTest('list');
    }
  });
  $('#list-fields').append(posField);
  const nameField = $(`<input id="list-name-field-${listCount}" type="text">`);
  nameField.on('change', ()=>{
    if ($('#list-toggle').is(':checked')) {
      updateTest('list');
    }
  });
  $('#list-fields').append(nameField);
  listCount++;
}
function delListItem(e: any = null) {
  if (e !== null) { e.preventDefault(); }
  listCount--;
  $(`#list-pos-field-${listCount}`).detach();
  $(`#list-name-field-${listCount}`).detach();
  updateTest('list');
}

$('#actuals-toggle').on('change', ()=>updateTest('actuals'));
$('#actuals-add').on('click', (e)=>addActual(e));
$('#actuals-del').on('click', (e)=>delActual(e));
let actualsCount = 0;
addActual();
function addActual(e: any = null) {
  if (e !== null) { e.preventDefault(); }
  const field = $(`<input id="actuals-field-${actualsCount}" type="number">`);
  field.on('change', ()=>{
    if ($('#actuals-toggle').is(':checked')) {
      updateTest('limits');
    }
  });
  $('#actuals-fields').append(field);
  actualsCount++;
}
function delActual(e: any = null) {
  if (e !== null) { e.preventDefault(); }
  actualsCount--;
  $(`#actuals-field-${actualsCount}`).detach();
  updateTest('actuals');
}

$('#length-toggle').on('change', ()=>updateTest());
$('#length-field').on('change', ()=>{
  if ($('#length-toggle').is(':checked')) {
    updateTest();
  }
});

$('#indent-toggle').on('change', ()=>updateTest());

updatePanel();

const testBox: HTMLDivElement = document.querySelector('.test-box');
const testBoxSizes =  testBox.getBoundingClientRect();

$('#box-width-slider').myJquerySlider({limits: [0,testBoxSizes.width,testBoxSizes.width]});
$('#box-width-field').val($('#box-width-slider').data().value);
$('#box-width-slider').on('my-jquery-slider-value', ()=>{
  const width = $('#box-width-slider').data().value;
  $('#box-width-field').val(width);
  testBox.style.width = `${width}px`;
});
$('#box-width-field').on('input', ()=>{
  const width = $('#box-width-field').val();
  $('#box-width-slider').myJquerySlider({value: width});
  testBox.style.width = `${width}px`;
});

$('#box-height-slider').myJquerySlider({limits: [0,testBoxSizes.height,testBoxSizes.width]});
$('#box-height-field').val($('#box-height-slider').data().value);
$('#box-height-slider').on('my-jquery-slider-value', ()=>{
  const height = $('#box-height-slider').data().value;
  $('#box-height-field').val(height);
  testBox.style.height = `${height}px`;
});
$('#box-height-field').on('input', ()=>{
  const height = $('#box-width-field').val();
  $('#box-height-slider').myJquerySlider({value: height});
  testBox.style.height = `${height}px`;
});