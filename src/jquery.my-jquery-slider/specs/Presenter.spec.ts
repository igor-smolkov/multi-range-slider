/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-useless-return */
/* eslint-disable lines-between-class-members */
/* eslint-disable class-methods-use-this */

import $ from 'jquery';

import { IModel, ModelEvent } from '../Model/Model';
import { TOrderedLabels } from '../Model/LabelsList';
import { IPresenter, Presenter } from '../Presenter';
import {
  TMyJQuerySlider, SliderOrientation, SliderScale, SliderLabel, SliderEvent,
} from '../TMyJQuerySlider';

const fullOptions: TMyJQuerySlider = {
  min: 10,
  max: 90,
  value: 40,
  step: 2,
  orientation: SliderOrientation.vertical,
  isDouble: true,
  minInterval: 40,
  maxInterval: 60,
  limits: [10, 40, 60, 90],
  active: 0,
  withLabel: true,
  label: SliderLabel.name,
  scale: SliderScale.numeric,
  labelsList: [[10, 'яблоко'], [90, 'арбуз']],
  actualRanges: [1],
  segments: 10,
  lengthPx: 1000,
  withIndent: false,
};
let modelChange: ()=>unknown;
class ModelStab implements IModel {
  on(event: ModelEvent, callback: ()=>unknown): void { modelChange = callback; }
  update() { modelChange(); }
  getConfig(): TMyJQuerySlider { return fullOptions; }
  getPerValues(): number[] { return []; }
  getLabelsList(): TOrderedLabels { return new Map(); }
  getValues(): number[] { return []; }
  getNames(): string[] { return []; }
  setValue(): void {}
  setPerValue(): void {}
  setActive(): void {}
  setActiveCloseOfValue(): void {}
  stepForward(): void {}
  stepBackward(): void {}
}
jest.mock('../View/View');
jest.mock('../Model/Model', () => ({
  Model: jest.fn().mockImplementation(() => new ModelStab()),
  ModelEvent: { change: 'change' },
}));
describe('Презентер', () => {
  let $rootElem: JQuery<HTMLElement>;
  beforeEach(() => { $rootElem = $(document.createElement('div')); });
  it('Экземпляр должен быть создан', () => {
    const presenter: IPresenter = new Presenter($rootElem);

    expect(presenter).toBeDefined();
  });
  describe('Обратная связь', () => {
    beforeEach(() => {
      modelChange = () => {};
      $rootElem = $(document.createElement('div'));
    });
    it('На элементе jQuery должно отработать событие инициализации', () => {
      const initCallback: jest.Mock = jest.fn();
      $rootElem.on(SliderEvent.init, initCallback);

      const presenter: IPresenter = new Presenter($rootElem);

      expect(initCallback).toBeCalledTimes(1);
    });
    it('На элементе jQuery должно отработать событие обновления', () => {
      const presenter: IPresenter = new Presenter($rootElem);
      const updateCallback: jest.Mock = jest.fn();
      $rootElem.on(SliderEvent.update, updateCallback);

      presenter.update();

      expect(updateCallback).toBeCalledTimes(1);
    });
    it('Поле данных элемента jQuery должно содержать все поля типа слайдера после его инициализации', () => {
      const keysOfSlider: string[] = Object.keys(fullOptions);

      const presenter: IPresenter = new Presenter($rootElem);

      const keysOfRootData = Object.keys($rootElem.data());
      keysOfSlider.forEach((key) => {
        expect(keysOfRootData).toContain(key);
      });
    });
    it('Поле данных элемента jQuery должно содержать все поля типа слайдера после его обновления', () => {
      const presenter: IPresenter = new Presenter($rootElem);
      const keysOfSlider: string[] = Object.keys(fullOptions);

      presenter.update();

      const keysOfRootData = Object.keys($rootElem.data());
      keysOfSlider.forEach((key) => {
        expect(keysOfRootData).toContain(key);
      });
    });
  });
});
