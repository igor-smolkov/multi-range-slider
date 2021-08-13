/**
 * @jest-environment jsdom
 */

import $ from 'jquery';
import { IPresenter, Presenter } from "../Presenter";
import { TMyJQuerySlider } from "../TMyJQuerySlider";

// - подготовка
jest.mock('../View/View');

describe('Презентер', () => {
  let 
    rootElem: HTMLElement, 
    $rootElem: JQuery<HTMLElement>,
    fullOptions: TMyJQuerySlider;
  beforeAll(() => {
    fullOptions = {
      min: 10,
      max: 90,
      value: 40,
      step: 2,    
      orientation: 'vertical',
      isDouble: true,
      minInterval: 40,
      maxInterval: 60,
      limits: [10, 40, 60, 90],
      active: 0,
      withLabel: true,
      label: 'name',
      scale: 'numeric',
      list: [[10, 'яблоко'],[90, 'арбуз']],
      actuals: [1],
      lengthPx: 1000,
      withIndent: false,
    }
  })
  beforeEach(() => {
    rootElem = document.createElement('div');
    $rootElem = $(rootElem);
  })
  it('Инстанс должен быть создан', () => {
    let presenter: IPresenter;
    // - действие
    presenter = new Presenter(rootElem);
    // - проверка
    expect(presenter).toBeDefined();
  })
  it('На элементе jQuery должно отработать событие инициализации', () => {
    let presenter: IPresenter;
    const initCallback: jest.Mock = jest.fn();
    $rootElem.on('my-jquery-slider-init', initCallback);
    // - действие
    presenter = new Presenter(rootElem);
    // - проверка
    expect(initCallback).toBeCalledTimes(1);
  })
  it('На элементе jQuery должно отработать событие обновления', () => {
    const presenter: IPresenter = new Presenter(rootElem);
    const updateCallback: jest.Mock = jest.fn();
    $rootElem.on('my-jquery-slider-update', updateCallback);
    // - действие
    presenter.update();
    // - проверка
    expect(updateCallback).toBeCalledTimes(1);
  })
  it('Поле данных элемента jQuery должено содержать все поля типа слайдера после его инициализации', () => {
    let presenter: IPresenter;
    const keysOfSlider: string[] = Object.keys(fullOptions);
    // - действие
    presenter = new Presenter(rootElem);
    // - проверка
    const keysOfRootData = Object.keys($rootElem.data());
    keysOfSlider.forEach(key => {
      expect(keysOfRootData).toContain(key);
    })
  })
  it('Поле данных элемента jQuery должено содержать все поля типа слайдера после его обновления', () => {
    const presenter: IPresenter = new Presenter(rootElem);
    const keysOfSlider: string[] = Object.keys(fullOptions);
    // - действие
    presenter.update();
    // - проверка
    const keysOfRootData = Object.keys($rootElem.data());
    keysOfSlider.forEach(key => {
      expect(keysOfRootData).toContain(key);
    })
  })
})