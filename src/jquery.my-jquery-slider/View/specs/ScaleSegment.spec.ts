/**
 * @jest-environment jsdom
 */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */

import { IEventEmitter } from '../../EventEmitter';
import {
  IScaleSegment, ScaleSegment, ScaleSegmentEvent, ScaleSegmentNotch, TScaleSegmentConfig,
} from '../ScaleSegment';

const eventEmitterCallback = jest.fn();
class EventEmitterStab implements IEventEmitter {
  subscribe(): void {}
  unsubscribe(): void {}
  emit(eventName: string, args?: unknown): void {
    eventEmitterCallback(eventName, args);
  }
}
jest.mock('../../EventEmitter', () => ({ EventEmitter: jest.fn().mockImplementation(() => new EventEmitterStab()) }));

const scaleSegmentConfig: TScaleSegmentConfig = {
  className: 'scale-segment',
  value: 0,
  notch: ScaleSegmentNotch.normal,
  label: null,
  grow: 1,
  isLast: false,
  withNotch: true,
};

describe('Сегмент шкалы', () => {
  it('Экземпляр должен быть создан', () => {
    const scaleSegment: IScaleSegment = new ScaleSegment({ ...scaleSegmentConfig });

    expect(scaleSegment).toBeDefined();
  });
  it('Элемент должен быть создан', () => {
    const scaleSegment: IScaleSegment = new ScaleSegment({ ...scaleSegmentConfig });

    expect(scaleSegment.getElem()).toBeDefined();
  });
  it('Элемент должен иметь класс заданный в опциях', () => {
    const testClassName = 'my-scale-segment';
    const options: TScaleSegmentConfig = {
      ...scaleSegmentConfig,
      className: testClassName,
      value: 0,
      notch: ScaleSegmentNotch.normal,
    };

    const scaleSegment: IScaleSegment = new ScaleSegment(options);

    expect(scaleSegment.getElem().classList.contains(testClassName)).toBeTruthy();
  });
  it('Элемент должен иметь класс с модификатором отсутствия засечек', () => {
    const blockName = 'my-scale-segment';
    const options: TScaleSegmentConfig = {
      ...scaleSegmentConfig,
      className: blockName,
      value: 0,
      notch: ScaleSegmentNotch.normal,
      withNotch: false,
    };
    const expectedClassName = `${blockName}_notch_none`;

    const scaleSegment: IScaleSegment = new ScaleSegment(options);

    expect(scaleSegment.getElem().classList.contains(expectedClassName)).toBeTruthy();
  });
  it('Элемент должен иметь класс с модификатором длинной засечки', () => {
    const blockName = 'my-scale-segment';
    const options: TScaleSegmentConfig = {
      ...scaleSegmentConfig,
      className: blockName,
      value: 0,
      notch: ScaleSegmentNotch.long,
    };
    const expectedClassName = `${blockName}_long`;

    const scaleSegment: IScaleSegment = new ScaleSegment(options);

    expect(scaleSegment.getElem().classList.contains(expectedClassName)).toBeTruthy();
  });
  it('Элемент должен иметь класс с модификатором короткой засечки', () => {
    const blockName = 'my-scale-segment';
    const options: TScaleSegmentConfig = {
      ...scaleSegmentConfig,
      className: blockName,
      value: 0,
      notch: ScaleSegmentNotch.short,
    };
    const expectedClassName = `${blockName}_short`;

    const scaleSegment: IScaleSegment = new ScaleSegment(options);

    expect(scaleSegment.getElem().classList.contains(expectedClassName)).toBeTruthy();
  });
  it('Элемент должен хранить переданное значение', () => {
    const blockName = 'my-scale-segment';
    const testValue = 11;
    const options: TScaleSegmentConfig = {
      ...scaleSegmentConfig,
      className: blockName,
      value: testValue,
      notch: ScaleSegmentNotch.normal,
    };

    const scaleSegment: IScaleSegment = new ScaleSegment(options);

    expect(scaleSegment.getElem().dataset.value).toBe(testValue.toString());
  });
  it('Элемент должен иметь подпись при передаче ее в опциях', () => {
    const expectedLabel = 'подпись';
    const options: TScaleSegmentConfig = {
      ...scaleSegmentConfig,
      value: 0,
      notch: ScaleSegmentNotch.normal,
      label: expectedLabel,
    };

    const segment: IScaleSegment = new ScaleSegment(options);

    expect(segment.getElem().dataset.label).toBe(expectedLabel);
  });
  it('Элемент должен иметь модификатор класса, отражающий именованный тип подписи, при передаче строки', () => {
    const blockName = 'my-scale-segment';
    const label = 'подпись';
    const options: TScaleSegmentConfig = {
      ...scaleSegmentConfig,
      className: blockName,
      value: 0,
      notch: ScaleSegmentNotch.normal,
      label,
    };
    const expectedClassName = `${blockName}_with-name`;

    const scaleSegment: IScaleSegment = new ScaleSegment(options);

    expect(scaleSegment.getElem().classList.contains(expectedClassName)).toBeTruthy();
  });
  it('Элемент должен иметь модификатор класса, отражающий числовой тип подписи, при передаче числа', () => {
    const blockName = 'my-scale-segment';
    const label = 12;
    const options: TScaleSegmentConfig = {
      ...scaleSegmentConfig,
      className: blockName,
      value: 0,
      notch: ScaleSegmentNotch.normal,
      label,
    };
    const expectedClassName = `${blockName}_with-number`;

    const scaleSegment: IScaleSegment = new ScaleSegment(options);

    expect(scaleSegment.getElem().classList.contains(expectedClassName)).toBeTruthy();
  });
  it('Элемент должен иметь модификатор класса, сообщающий о том что это последний такой элемент, при соответствующем флаге в опциях', () => {
    const blockName = 'my-scale-segment';
    const options: TScaleSegmentConfig = {
      ...scaleSegmentConfig,
      className: blockName,
      value: 0,
      notch: ScaleSegmentNotch.normal,
      isLast: true,
    };
    const expectedClassName = `${blockName}_last`;

    const scaleSegment: IScaleSegment = new ScaleSegment(options);

    expect(scaleSegment.getElem().classList.contains(expectedClassName)).toBeTruthy();
  });
  it('Элемент должен иметь коэффициент роста равный 10 после обновления с соответствующими опциями', () => {
    const scaleSegment: IScaleSegment = new ScaleSegment({ ...scaleSegmentConfig });
    const testGrow = 10;

    scaleSegment.update({
      ...scaleSegmentConfig,
      value: 0,
      notch: ScaleSegmentNotch.normal,
      grow: testGrow,
    });

    expect(scaleSegment.getElem().style.flexGrow).toBe(testGrow.toString());
  });
  it('Вместе с событием select должно быть передано значение, при клике на элементе', () => {
    const testValue = 14;
    const options: TScaleSegmentConfig = {
      ...scaleSegmentConfig,
      value: testValue,
      notch: ScaleSegmentNotch.normal,
    };
    const scaleSegment: IScaleSegment = new ScaleSegment(options);
    eventEmitterCallback.mockClear();

    scaleSegment.getElem().dispatchEvent(new Event('click'));

    expect(eventEmitterCallback).toBeCalledWith(ScaleSegmentEvent.select, { value: testValue });
  });
  it('События не должно произойти, при нажатии клавиши на элементе', () => {
    const scaleSegment: IScaleSegment = new ScaleSegment({ ...scaleSegmentConfig });
    eventEmitterCallback.mockClear();

    scaleSegment.getElem().dispatchEvent(new Event('keypress'));

    expect(eventEmitterCallback).not.toHaveBeenCalled();
  });
  it('Вместе с событием select должно быть передано значение, при нажатии клавиши пробел', () => {
    const testValue = 14;
    const options: TScaleSegmentConfig = {
      ...scaleSegmentConfig,
      value: testValue,
      notch: ScaleSegmentNotch.normal,
    };
    const scaleSegment: IScaleSegment = new ScaleSegment(options);
    eventEmitterCallback.mockClear();

    scaleSegment.getElem().dispatchEvent(new KeyboardEvent('keypress', { key: ' ' }));

    expect(eventEmitterCallback).toBeCalledWith(ScaleSegmentEvent.select, { value: testValue });
  });
  it('На событие select должна быть оформлена подписка с переданной функцией обратного вызова', () => {
    const scaleSegment: IScaleSegment = new ScaleSegment({ ...scaleSegmentConfig });
    const event = ScaleSegmentEvent.select;
    const callback = () => {};
    const spy = jest.spyOn(EventEmitterStab.prototype, 'subscribe');

    scaleSegment.on(event, callback);

    expect(spy).toBeCalledWith(event, callback);
  });
});
