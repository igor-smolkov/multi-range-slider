import $ from 'jquery';
import './jquery.my-jquery-slider/jquery.my-jquery-slider';

import './style.scss';

import OutputScreen from './components/output-screen/output-screen';
import InputScreen from './components/input-screen/input-screen';
import DemoSettings from './components/demo-settings/demo-settings';
import { Toggler } from './components/toggler/toggler';
import ConfigPanel from './components/config-panel/config-panel';

function start() {
  let $slider = $('.js-slider');
  const configPanel = new ConfigPanel();
  const toggler = new Toggler();
  const demoSettings = new DemoSettings();
  const inputScreen = new InputScreen();
  const outputScreen = new OutputScreen();

  const handleSliderChange = () => outputScreen.show($slider.data());
  const handleSliderInit = () => {
    demoSettings.blinkInit();
    handleSliderChange();
  };
  const handleSliderUpdate = () => {
    demoSettings.blinkUpdate();
    handleSliderChange();
  };

  const bindSliderListeners = ($bindableSlider: JQuery<HTMLElement>) => {
    $bindableSlider.on('my-jquery-slider-init', handleSliderInit);
    $bindableSlider.on('my-jquery-slider-update', handleSliderUpdate);
  };

  const reCreateSlider = ($oldSlider: JQuery<HTMLElement>): JQuery<HTMLElement> => {
    $oldSlider.remove();
    const $newSlider = $('<div class=".js-slider"></div>');
    $('.js-page__slider').append($newSlider);
    bindSliderListeners($newSlider);
    return $newSlider;
  };

  const render = () => {
    if (demoSettings.checkDemoMode() === 'init') {
      $slider = reCreateSlider($slider);
      inputScreen.setTitle('Инициализация');
    } else {
      inputScreen.setTitle('Обновление');
    }
    if (demoSettings.checkOptions()) {
      toggler.enable();
      configPanel.enable();
      const options = configPanel.getOptions(toggler);
      inputScreen.showOptions(options);
      $slider.myJQuerySlider(options);
    } else {
      toggler.disable();
      configPanel.disable();
      inputScreen.showDefaults();
      $slider.myJQuerySlider();
    }
  };

  const handleToggler = (event: string, name: string) => {
    if (event === 'enable') configPanel.show(name);
    else if (event === 'disable') configPanel.hide(name);
    render();
  };
  toggler.subscribe(handleToggler);

  configPanel.subscribe(render);
  demoSettings.onOptions(render);
  demoSettings.onDemoMode(render);

  bindSliderListeners($slider);
  render();
}
window.addEventListener('load', start);
