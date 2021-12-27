/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */

import {
  ISegment, Segment, SegmentNotch, TSegmentConfig,
} from '../Segment';
import { IViewHandler } from '../IView';

const segmentConfig: TSegmentConfig = {
  className: 'segment',
  value: 0,
  notch: SegmentNotch.normal,
  label: null,
  grow: 1,
  isLast: false,
  withNotch: true,
};
describe('Сегмент шкалы', () => {
  class ViewHandlerStab implements IViewHandler {
    handleSelectRange(): void {}
    handleSelectValue(): void {}
    handleSelectPerValue(): void {}
    handleStepForward(): void {}
    handleStepBackward(): void {}
    handleFocus(): void {}
  }
  it('Экземпляр должен быть создан', () => {
    const segment: ISegment = new Segment(new ViewHandlerStab(), { ...segmentConfig });

    expect(segment).toBeDefined();
  });
  it('Элемент должен быть создан', () => {
    const segment: ISegment = new Segment(new ViewHandlerStab(), { ...segmentConfig });

    expect(segment.getElem()).toBeDefined();
  });
  it('Элемент должен иметь класс заданный в опциях', () => {
    const testClassName = 'my-segment';
    const options: TSegmentConfig = {
      ...segmentConfig,
      className: testClassName,
      value: 0,
      notch: SegmentNotch.normal,
    };

    const segment: ISegment = new Segment(new ViewHandlerStab(), options);

    expect(segment.getElem().classList.contains(testClassName)).toBeTruthy();
  });
  it('Элемент должен иметь класс с модификатором отсутствия засечек', () => {
    const blockName = 'my-segment';
    const options: TSegmentConfig = {
      ...segmentConfig,
      className: blockName,
      value: 0,
      notch: SegmentNotch.normal,
      withNotch: false,
    };
    const expectedClassName = `${blockName}_notch_none`;

    const segment: ISegment = new Segment(new ViewHandlerStab(), options);

    expect(segment.getElem().classList.contains(expectedClassName)).toBeTruthy();
  });
  it('Элемент должен иметь класс с модификатором длинной засечки', () => {
    const blockName = 'my-segment';
    const options: TSegmentConfig = {
      ...segmentConfig,
      className: blockName,
      value: 0,
      notch: SegmentNotch.long,
    };
    const expectedClassName = `${blockName}_long`;

    const segment: ISegment = new Segment(new ViewHandlerStab(), options);

    expect(segment.getElem().classList.contains(expectedClassName)).toBeTruthy();
  });
  it('Элемент должен иметь класс с модификатором короткой засечки', () => {
    const blockName = 'my-segment';
    const options: TSegmentConfig = {
      ...segmentConfig,
      className: blockName,
      value: 0,
      notch: SegmentNotch.short,
    };
    const expectedClassName = `${blockName}_short`;

    const segment: ISegment = new Segment(new ViewHandlerStab(), options);

    expect(segment.getElem().classList.contains(expectedClassName)).toBeTruthy();
  });
  it('Элемент должен хранить переданное значение', () => {
    const blockName = 'my-segment';
    const testValue = 11;
    const options: TSegmentConfig = {
      ...segmentConfig,
      className: blockName,
      value: testValue,
      notch: SegmentNotch.normal,
    };

    const segment: ISegment = new Segment(new ViewHandlerStab(), options);

    expect(segment.getElem().dataset.value).toBe(testValue.toString());
  });
  it('Элемент должен иметь подпись при передаче ее в опциях', () => {
    const expectedLabel = 'подпись';
    const options: TSegmentConfig = {
      ...segmentConfig,
      value: 0,
      notch: SegmentNotch.normal,
      label: expectedLabel,
    };

    const segment: ISegment = new Segment(new ViewHandlerStab(), options);

    expect(segment.getElem().dataset.label).toBe(expectedLabel);
  });
  it('Элемент должен иметь модификатор класса, отражающий именованный тип подписи, при передаче строки', () => {
    const blockName = 'my-segment';
    const label = 'подпись';
    const options: TSegmentConfig = {
      ...segmentConfig,
      className: blockName,
      value: 0,
      notch: SegmentNotch.normal,
      label,
    };
    const expectedClassName = `${blockName}_with-name`;

    const segment: ISegment = new Segment(new ViewHandlerStab(), options);

    expect(segment.getElem().classList.contains(expectedClassName)).toBeTruthy();
  });
  it('Элемент должен иметь модификатор класса, отражающий числовой тип подписи, при передаче числа', () => {
    const blockName = 'my-segment';
    const label = 12;
    const options: TSegmentConfig = {
      ...segmentConfig,
      className: blockName,
      value: 0,
      notch: SegmentNotch.normal,
      label,
    };
    const expectedClassName = `${blockName}_with-number`;

    const segment: ISegment = new Segment(new ViewHandlerStab(), options);

    expect(segment.getElem().classList.contains(expectedClassName)).toBeTruthy();
  });
  it('Элемент должен иметь модификатор класса, сообщающий о том что это последний такой элемент, при соответствующем флаге в опциях', () => {
    const blockName = 'my-segment';
    const options: TSegmentConfig = {
      ...segmentConfig,
      className: blockName,
      value: 0,
      notch: SegmentNotch.normal,
      isLast: true,
    };
    const expectedClassName = `${blockName}_last`;

    const segment: ISegment = new Segment(new ViewHandlerStab(), options);

    expect(segment.getElem().classList.contains(expectedClassName)).toBeTruthy();
  });
  it('Элемент должен иметь коэффициент роста равный 10 после обновления с соответствующими опциями', () => {
    const segment: ISegment = new Segment(new ViewHandlerStab(), { ...segmentConfig });
    const testGrow = 10;

    segment.update({
      ...segmentConfig,
      value: 0,
      notch: SegmentNotch.normal,
      grow: testGrow,
    });

    expect(segment.getElem().style.flexGrow).toBe(testGrow.toString());
  });
  it('В обработчик вью должно быть передано значение, при клике на элементе', () => {
    const viewHandlerStab = new ViewHandlerStab();
    const spy = jest.spyOn(viewHandlerStab, 'handleSelectValue');
    const testValue = 14;
    const options: TSegmentConfig = {
      ...segmentConfig,
      value: testValue,
      notch: SegmentNotch.normal,
    };
    const segment: ISegment = new Segment(viewHandlerStab, options);

    segment.getElem().dispatchEvent(new Event('click'));

    expect(spy).toHaveBeenCalledWith(testValue);
  });
  it('Обработчик вью не должен быть вызван, при нажатии клавиши на элементе', () => {
    const viewHandlerStab = new ViewHandlerStab();
    const spy = jest.spyOn(viewHandlerStab, 'handleSelectValue');
    const segment: ISegment = new Segment(viewHandlerStab, { ...segmentConfig });

    segment.getElem().dispatchEvent(new Event('keypress'));

    expect(spy).not.toHaveBeenCalled();
  });
  it('В обработчик вью должно быть передано значение, при нажатии клавиши пробел', () => {
    const viewHandlerStab = new ViewHandlerStab();
    const spy = jest.spyOn(viewHandlerStab, 'handleSelectValue');
    const testValue = 14;
    const options: TSegmentConfig = {
      ...segmentConfig,
      value: testValue,
      notch: SegmentNotch.normal,
    };
    const segment: ISegment = new Segment(viewHandlerStab, options);

    segment.getElem().dispatchEvent(new KeyboardEvent('keypress', { key: ' ' }));

    expect(spy).toHaveBeenCalledWith(testValue);
  });
});
