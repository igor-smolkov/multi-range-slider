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
    const scale = document.createElement('datalist');
    scale.classList.add('my-jquery-slider__scale');
    for(let acc = min; acc <= max; acc += resonableStep) {
      const notch = acc % (10*resonableStep) === 0 ? this.makeNoth(acc, true) : this.makeNoth(acc);
      notch.style.flexGrow = acc + resonableStep > max ? (max - acc).toString() : resonableStep.toString();
      scale.append(notch);
    }
    return scale;
  }
  makeNoth(value :number, long :boolean = false) {
    const notch = document.createElement('option');
    notch.classList.add('my-jquery-slider__notch');
    if (long) {
      notch.classList.add('my-jquery-slider__notch_long');
    }
    notch.value = value.toString();
    notch.addEventListener('click', (e)=>this.handleClick(e))
    return notch;
  }
  handleClick(e :MouseEvent) {
    const option = e.target as HTMLOptionElement;
    this.view.handleScaleClick(+option.value);
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