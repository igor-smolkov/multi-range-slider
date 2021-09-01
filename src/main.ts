import $ from 'jquery';
import './jquery.my-jquery-slider/jquery.my-jquery-slider';

import './style.scss';

import InputScreen from './components/input-screen/input-screen';
import DemoSettings from './components/demo-settings/demo-settings';
import { Toggler } from './components/toggler/toggler';
import ConfigPanel from './components/config-panel/config-panel';
import TMyJQuerySlider from './jquery.my-jquery-slider/TMyJQuerySlider';

const showOptions = ($element: JQuery<HTMLElement>, options: TMyJQuerySlider) => {
  $element.html(JSON.stringify(options, null, 2));
};

function start() {
  const $output = $('.js-output');
  const $slider = $('.js-slider');

  const configPanel = new ConfigPanel();
  const toggler = new Toggler();
  const demoSettings = new DemoSettings();
  const inputScreen = new InputScreen();

  const render = () => {
    if (demoSettings.checkOptions()) {
      toggler.enable();
      const options = configPanel.getOptions(toggler);
      inputScreen.show(demoSettings.checkOptions(), options);
      $slider.myJQuerySlider(options);
    } else {
      toggler.disable();
      inputScreen.showDefaults();
      $slider.myJQuerySlider();
    }
  };

  const handleToggler = (event: string, name: string) => {
    if (event === 'enable') configPanel.enable(name);
    else if (event === 'disable') configPanel.disable(name);
    render();
  };
  toggler.subscribe(handleToggler);

  configPanel.subscribe(render);
  demoSettings.onOptions(render);

  const handleSliderChange = () => showOptions($output, $slider.data());
  $slider.on('my-jquery-slider-init', handleSliderChange);
  $slider.on('my-jquery-slider-update', handleSliderChange);

  render();
}
window.addEventListener('load', start);
