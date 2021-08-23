/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-useless-return */
/* eslint-disable lines-between-class-members */
/* eslint-disable class-methods-use-this */

import { IScale, Scale, TScaleCalcResonableStep } from '../Scale';

describe('Контейнер сегментов шкалы', () => {
  // - подготовка
  class SegmentStab {
    getElem(): HTMLOptionElement { return; }
    update(): void {}
  }
  it('Инстанс должен быть создан', () => {
    // - действие
    const scale: IScale = new Scale();
    // - проверка
    expect(scale).toBeDefined();
  });
  it('Элемент должен быть создан', () => {
    // - действие
    const scale: IScale = new Scale();
    // - проверка
    expect(scale.getElem()).toBeDefined();
  });
  it('Элемент должен содержать дефолтный класс', () => {
    const expectedClassName = 'scale';
    // - действие
    const scale: IScale = new Scale();
    // - проверка
    expect(scale.getElem().classList.contains(expectedClassName)).toBeTruthy();
  });
  it('Элемент должен содержать класс переданный в опциях', () => {
    const testClassName = 'my-scale';
    // - действие
    const scale: IScale = new Scale({ className: testClassName });
    // - проверка
    expect(scale.getElem().classList.contains(testClassName)).toBeTruthy();
  });
  it('У элемента должны отсутствовать отступы при соответсвующем флаге в опциях', () => {
    // - действие
    const scale: IScale = new Scale({ className: 'stab', withIndent: false });
    // - проверка
    expect(scale.getElem().style.margin).toBe('0px');
  });
  it('Элемент должен содержать два элемента', () => {
    const scale: IScale = new Scale();
    // - действие
    scale.setSegments([new SegmentStab(), new SegmentStab()]);
    // - проверка
    expect(scale.getElem().childNodes.length).toBe(2);
  });
  it('У элемента должны отсутствовать отступы при соответсвующем флаге в опциях обновления', () => {
    const scale: IScale = new Scale();
    // - действие
    scale.update({ className: 'stab', withIndent: false });
    // - проверка
    expect(scale.getElem().style.margin).toBe('0px');
  });
  describe('Расчет разумного шага', () => {
    it('Должен быть 1', () => {
      const options: TScaleCalcResonableStep = {
        min: 0,
        max: 100,
        step: 1,
        maxLengthPx: 1000,
        isVertical: false,
        type: 'basic',
      };
      // - действие / проверка
      expect(Scale.calcResonableStep(options)).toBe(1);
    });
    it('Должен быть 10', () => {
      const options: TScaleCalcResonableStep = {
        min: 0,
        max: 1000,
        step: 1,
        maxLengthPx: 1000,
        isVertical: false,
        type: 'basic',
      };
      // - действие / проверка
      expect(Scale.calcResonableStep(options)).toBe(10);
    });
    it('Должен быть 12', () => {
      const options: TScaleCalcResonableStep = {
        min: 0,
        max: 1000,
        step: 4,
        maxLengthPx: 1000,
        isVertical: false,
        type: 'basic',
      };
      // - действие / проверка
      expect(Scale.calcResonableStep(options)).toBe(12);
    });
    it('Должен быть 1', () => {
      const options: TScaleCalcResonableStep = {
        min: 0,
        max: 100,
        step: 0.001,
        maxLengthPx: 1000,
        isVertical: false,
        type: 'basic',
      };
      // - действие / проверка
      expect(Scale.calcResonableStep(options)).toBe(1);
    });
    it('Должен быть 10', () => {
      const options: TScaleCalcResonableStep = {
        min: 0,
        max: 100,
        step: 10,
        maxLengthPx: 100,
        isVertical: false,
        type: 'basic',
      };
      // - действие / проверка
      expect(Scale.calcResonableStep(options)).toBe(10);
    });
    it('Должен быть 10', () => {
      const options: TScaleCalcResonableStep = {
        min: 0,
        max: 100,
        step: 10,
        maxLengthPx: 100,
        isVertical: true,
        type: 'basic',
      };
      // - действие / проверка
      expect(Scale.calcResonableStep(options)).toBe(10);
    });
    it('Должен быть 20', () => {
      const options: TScaleCalcResonableStep = {
        min: 0,
        max: 100,
        step: 10,
        maxLengthPx: 100,
        isVertical: true,
        type: 'numeric',
      };
      // - действие / проверка
      expect(Scale.calcResonableStep(options)).toBe(20);
    });
    it('Должен быть 20', () => {
      const options: TScaleCalcResonableStep = {
        min: 0,
        max: 100,
        step: 10,
        maxLengthPx: 100,
        isVertical: false,
        type: 'numeric',
      };
      // - действие / проверка
      expect(Scale.calcResonableStep(options)).toBe(20);
    });
    it('Должен быть 100', () => {
      const options: TScaleCalcResonableStep = {
        min: 0,
        max: 100,
        step: 100,
        maxLengthPx: 100,
        isVertical: false,
        type: 'basic',
      };
      // - действие / проверка
      expect(Scale.calcResonableStep(options)).toBe(100);
    });
  });
});
