/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-useless-return */
/* eslint-disable lines-between-class-members */
/* eslint-disable class-methods-use-this */

import {
  IScale, Scale, TScaleCalcReasonableStep, TScaleConfig,
} from '../Scale';

const scaleConfig: TScaleConfig = {
  className: 'scale',
  withIndent: true,
};
describe('Контейнер сегментов шкалы', () => {
  class SegmentStab {
    getElem(): HTMLOptionElement { return; }
    update(): void {}
  }
  it('Экземпляр должен быть создан', () => {
    const scale: IScale = new Scale({ ...scaleConfig });

    expect(scale).toBeDefined();
  });
  it('Элемент должен быть создан', () => {
    const scale: IScale = new Scale({ ...scaleConfig });

    expect(scale.getElem()).toBeDefined();
  });
  it('Элемент должен содержать класс переданный в опциях', () => {
    const testClassName = 'my-scale';

    const scale: IScale = new Scale({ ...scaleConfig, className: testClassName });

    expect(scale.getElem().classList.contains(testClassName)).toBeTruthy();
  });
  it('У элемента должны отсутствовать отступы при соответствующем флаге в опциях', () => {
    const scale: IScale = new Scale({ className: 'stab', withIndent: false });

    expect(scale.getElem().style.margin).toBe('0px 2px');
  });
  it('Элемент должен содержать два элемента', () => {
    const scale: IScale = new Scale({ ...scaleConfig });

    scale.setSegments([new SegmentStab(), new SegmentStab()]);

    expect(scale.getElem().childNodes.length).toBe(2);
  });
  it('У элемента должны отсутствовать отступы при соответствующем флаге в опциях обновления', () => {
    const scale: IScale = new Scale({ ...scaleConfig });

    scale.update({ className: 'stab', withIndent: false });

    expect(scale.getElem().style.margin).toBe('0px 2px');
  });
  describe('Расчет разумного шага', () => {
    it('Должен быть 1', () => {
      const options: TScaleCalcReasonableStep = {
        min: 0,
        max: 100,
        step: 1,
        maxLengthPx: 1000,
        isVertical: false,
        type: 'basic',
      };

      expect(Scale.calcReasonableStep(options)).toBe(1);
    });
    it('Должен быть 10', () => {
      const options: TScaleCalcReasonableStep = {
        min: 0,
        max: 1000,
        step: 1,
        maxLengthPx: 1000,
        isVertical: false,
        type: 'basic',
      };

      expect(Scale.calcReasonableStep(options)).toBe(10);
    });
    it('Должен быть 12', () => {
      const options: TScaleCalcReasonableStep = {
        min: 0,
        max: 1000,
        step: 4,
        maxLengthPx: 1000,
        isVertical: false,
        type: 'basic',
      };

      expect(Scale.calcReasonableStep(options)).toBe(12);
    });
    it('Должен быть 1', () => {
      const options: TScaleCalcReasonableStep = {
        min: 0,
        max: 100,
        step: 0.001,
        maxLengthPx: 1000,
        isVertical: false,
        type: 'basic',
      };

      expect(Scale.calcReasonableStep(options)).toBe(1);
    });
    it('Должен быть 10', () => {
      const options: TScaleCalcReasonableStep = {
        min: 0,
        max: 100,
        step: 10,
        maxLengthPx: 100,
        isVertical: false,
        type: 'basic',
      };

      expect(Scale.calcReasonableStep(options)).toBe(10);
    });
    it('Должен быть 10', () => {
      const options: TScaleCalcReasonableStep = {
        min: 0,
        max: 100,
        step: 10,
        maxLengthPx: 100,
        isVertical: true,
        type: 'basic',
      };

      expect(Scale.calcReasonableStep(options)).toBe(10);
    });
    it('Должен быть 20', () => {
      const options: TScaleCalcReasonableStep = {
        min: 0,
        max: 100,
        step: 10,
        maxLengthPx: 100,
        isVertical: true,
        type: 'numeric',
      };

      expect(Scale.calcReasonableStep(options)).toBe(20);
    });
    it('Должен быть 30', () => {
      const options: TScaleCalcReasonableStep = {
        min: 0,
        max: 100,
        step: 10,
        maxLengthPx: 100,
        isVertical: false,
        type: 'numeric',
      };

      expect(Scale.calcReasonableStep(options)).toBe(30);
    });
    it('Должен быть 100', () => {
      const options: TScaleCalcReasonableStep = {
        min: 0,
        max: 100,
        step: 100,
        maxLengthPx: 100,
        isVertical: false,
        type: 'basic',
      };

      expect(Scale.calcReasonableStep(options)).toBe(100);
    });
    it('Должен быть 50', () => {
      const options: TScaleCalcReasonableStep = {
        min: 0,
        max: 100,
        step: 1,
        maxLengthPx: 100,
        isVertical: false,
        type: 'basic',
        count: 2,
      };

      expect(Scale.calcReasonableStep(options)).toBe(50);
    });
    it('Должен быть 40', () => {
      const options: TScaleCalcReasonableStep = {
        min: 0,
        max: 100,
        step: 1,
        maxLengthPx: 100,
        isVertical: false,
        type: 'basic',
        count: 2.5,
      };

      expect(Scale.calcReasonableStep(options)).toBe(40);
    });
  });
});
