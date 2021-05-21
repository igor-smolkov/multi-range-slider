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
    const {min, max, step, list, sign, maxLengthPx, indent = true} = config;
    const add = sign === 'numeric' ? 1 : 0;
    const resonableStep = this._calcResonableStep(max-min, step, add, maxLengthPx);
    const scale = document.createElement('datalist');
    scale.classList.add('my-jquery-slider__scale');
    if (!indent) {
      scale.style.margin = '0';
    }
    let acc;
    for(acc = min; acc <= max; acc += resonableStep) {
      const label = list.has(acc) ? list.get(acc) : '';
      const notch = acc % (10*resonableStep) === 0 ? this.makeNoth(acc, label, 'long', sign) : this.makeNoth(acc, label, 'normal', sign);
      notch.style.flexGrow = (acc + resonableStep > max) ? (max - acc).toString() : resonableStep.toString();
      scale.append(notch);
    }
    if (acc - resonableStep !== max) {
      const label = list.has(max) ? list.get(max) : '';
      scale.append(this.makeNoth(max, label, 'short', sign));
    }
    return scale;
  }
  makeNoth(value :number, label: string = '', length :string = 'normal', sign :string = '') {
    const notch = document.createElement('option');
    notch.classList.add('my-jquery-slider__notch');
    if (length === 'long') {
      notch.classList.add('my-jquery-slider__notch_long');
    } else if (length === 'short') {
      notch.classList.add('my-jquery-slider__notch_short');
    }
    if (sign === 'numeric') {
      notch.classList.add('my-jquery-slider__notch_with-value');
    }
    if (sign === 'named') {
      notch.classList.add('my-jquery-slider__notch_with-label');
    }
    notch.value = value.toString();
    notch.label = label;
    notch.addEventListener('click', (e)=>this.handleClick(e))
    return notch;
  }
  handleClick(e :MouseEvent) {
    const option = e.target as HTMLOptionElement;
    this.view.handleScaleClick(+option.value);
  }
  _calcResonableStep(range:number, step:number, add: number = 0, maxLengthPx: number) {
    let resonableStep = step;
    for (let i = 2; i < range; i++) {
      if ((resonableStep / range < 0.01)
        ||(range / resonableStep > maxLengthPx * 0.1)) {
        resonableStep = step * i;
      } else {
        break;
      }
    }
    for (let i = 0; i < add; i++) {
      resonableStep *= i+2;
    }
    return resonableStep;
  }
}

export default Scale;