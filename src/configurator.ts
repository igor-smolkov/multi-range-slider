$('#test-slider').myJquerySlider();
$('#config-in').text('default');
updatePanel();

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
}

function updateTest() {
  const config = {
    value: isValueUse ? +$('#value-field').val() : undefined,
    min: isMinUse ? +$('#min-field').val() : undefined,
    max: isMaxUse ? +$('#max-field').val() : undefined,
    scale: isScaleUse ? $('input[name="scale"]').is(':checked') ? $('input[name="scale"]:checked').val() : undefined : undefined,
  }
  $('#test-slider').myJquerySlider(config);
  $('#config-in').text(JSON.stringify(config, null, 2));
  $('#config-now').text(JSON.stringify($('#test-slider').data(), null, 2));
}

let isValueUse = false;
$('#value-toggle').on('change', (e)=>{
  const check = e.target as HTMLInputElement;
  isValueUse = check.checked
  updateTest();
});
$('#value-slider').on('my-jquery-slider-value', ()=>{
  $('#value-field').val($('#value-slider').data().value);
  if (isValueUse) {
    updateTest();
  }
});
$('#value-field').on('change', ()=>{
  if (isValueUse) {
    updateTest();
  }
});

let isMinUse = false;
$('#min-toggle').on('change', (e)=>{
  const check = e.target as HTMLInputElement;
  isMinUse = check.checked
  updateTest();
});
$('#min-slider').on('my-jquery-slider-value', ()=>{
  $('#min-field').val($('#min-slider').data().value);
  if (isMinUse) {
    updateTest();
  }
});
$('#min-field').on('change', ()=>{
  if (isMinUse) {
    updateTest();
  }
});

let isMaxUse = false;
$('#max-toggle').on('change', (e)=>{
  const check = e.target as HTMLInputElement;
  isMaxUse = check.checked
  updateTest();
});
$('#max-slider').on('my-jquery-slider-value', ()=>{
  $('#max-field').val($('#max-slider').data().value);
  if (isMaxUse) {
    updateTest();
  }
});
$('#max-field').on('change', ()=>{
  if (isMaxUse) {
    updateTest();
  }
});

let isScaleUse = false;
$('#scale-toggle').on('change', (e)=>{
  const check = e.target as HTMLInputElement;
  isScaleUse = check.checked
  $('input[name="scale"][value="basic"]').prop('checked', check.checked);
  updateTest();
});
$('#scale-basic').on('change', ()=>{
  if (isScaleUse) {
    updateTest();
  }
});
$('#scale-numeric').on('change', ()=>{
  if (isScaleUse) {
    updateTest();
  }
});
$('#scale-named').on('change', ()=>{
  if (isScaleUse) {
    updateTest();
  }
});