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
    const {min, max, step, type, maxLengthPx, indent = true} = config;
    const withValue = type === 'numeric' ? true : false; 
    const add = withValue ? 1 : 0;
    const resonableStep = this._calcResonableStep(max-min, step, add, maxLengthPx);
    const scale = document.createElement('datalist');
    scale.classList.add('my-jquery-slider__scale');
    if (!indent) {
      scale.style.margin = '0';
    }
    let acc;
    for(acc = min; acc <= max; acc += resonableStep) {
      const notch = acc % (10*resonableStep) === 0 ? this.makeNoth(acc, 'long', withValue) : this.makeNoth(acc, 'normal', withValue);
      notch.style.flexGrow = (acc + resonableStep > max) ? (max - acc).toString() : resonableStep.toString();
      scale.append(notch);
    }
    if (acc - resonableStep !== max) {
      scale.append(this.makeNoth(max, 'short', withValue));
    }
    return scale;
  }
  makeNoth(value :number, type :string = 'normal', withValue :boolean = false) {
    const notch = document.createElement('option');
    notch.classList.add('my-jquery-slider__notch');
    if (type === 'long') {
      notch.classList.add('my-jquery-slider__notch_long');
    } else if (type === 'short') {
      notch.classList.add('my-jquery-slider__notch_short');
    }
    if (withValue) {
      notch.classList.add('my-jquery-slider__notch_with-value');
    }
    notch.value = value.toString();
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