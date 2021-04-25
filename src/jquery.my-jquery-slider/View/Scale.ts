import IScale from "./IScale";
import View from "./View";

class Scale {
  view: View;
  elem :HTMLDataListElement;
  constructor(config :IScale, view :View) {
    this.view = view;
    this.elem = this.makeScale(config);
  }
  makeScale(config :IScale) {
    const {min, max, step} = config;
    const resonableStep = this._calcResonableStep(max-min, step);
    console.log('resonableStep', resonableStep)
    const scale = document.createElement('datalist');
    scale.classList.add('my-jquery-slider__scale');
    for(let i = min; i <= max; i += resonableStep) {
      const notch = i % 10*resonableStep === 0 ? this.makeNoth(i, true) : this.makeNoth(i);
      scale.append(notch);
    }
    // scale.append(this.makeNoth(max));
    return scale;
  }
  makeNoth(value :number, long :boolean = false) {
    const notch = document.createElement('option');
    notch.classList.add('my-jquery-slider__notch');
    if (long) {
      notch.classList.add('my-jquery-slider__notch_long');
    }
    notch.value = value.toString();
    return notch;
  }
  _calcResonableStep(range:number, step:number) {
    let resonableStep = step;
    for (let i = 2; i < range; i++) {
      if (resonableStep / range < 0.01) {
        resonableStep = step * i;
      } else {
        break;
      }
    }
    return resonableStep;
  }
}

export default Scale;