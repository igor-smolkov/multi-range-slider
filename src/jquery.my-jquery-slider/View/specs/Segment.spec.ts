/**
 * @jest-environment jsdom
 */

import { ISegment, Segment, TSegmentConfig } from "../Segment";
import { IViewHandler } from "../View";

describe('Сегмент шкалы', () => {
  // - подготовка
  class ViewHandlerStab implements IViewHandler {
    handleSelectRange(): void {}
    handleSelectValue(): void {}
    handleSelectPerValue(): void {}
  }
  it('Инстанс должен быть создан', () => {
    // - действие
    const segment: ISegment = new Segment(new ViewHandlerStab());
    // - проверка
    expect(segment).toBeDefined();
  })
  it('Элемент должен быть создан', () => {
    // - действие
    const segment: ISegment = new Segment(new ViewHandlerStab());
    // - проверка
    expect(segment.getElem()).toBeDefined();
  })
  it('Элемент должен иметь дефолтный класс', () => {
    const expectedClassName = 'segment';
    // - действие
    const segment: ISegment = new Segment(new ViewHandlerStab());
    // - проверка
    expect(segment.getElem().classList.contains(expectedClassName)).toBeTruthy();
  })
  it('Элемент должен иметь класс заданный в опциях', () => {
    const testClassName = 'my-segment';
    const options: TSegmentConfig = {
      className: testClassName,
      value: 0,
      notch: 'normal'
    }
    // - действие
    const segment: ISegment = new Segment(new ViewHandlerStab(),options);
    // - проверка
    expect(segment.getElem().classList.contains(testClassName)).toBeTruthy();
  })
  it('Элемент должен иметь класс с модификатором длинной засечки', () => {
    const blockName = 'my-segment';
    const options: TSegmentConfig = {
      className: blockName,
      value: 0,
      notch: 'long'
    }
    const expectedClassName = `${blockName}_long`;
    // - действие
    const segment: ISegment = new Segment(new ViewHandlerStab(),options);
    // - проверка
    expect(segment.getElem().classList.contains(expectedClassName)).toBeTruthy();
  })
  it('Элемент должен иметь класс с модификатором короткой засечки', () => {
    const blockName = 'my-segment';
    const options: TSegmentConfig = {
      className: blockName,
      value: 0,
      notch: 'short'
    }
    const expectedClassName = `${blockName}_short`;
    // - действие
    const segment: ISegment = new Segment(new ViewHandlerStab(),options);
    // - проверка
    expect(segment.getElem().classList.contains(expectedClassName)).toBeTruthy();
  })
  it('Элемент должен хранить переданное значение', () => {
    const blockName = 'my-segment';
    const testValue = 11;
    const options: TSegmentConfig = {
      className: blockName,
      value: testValue,
      notch: 'normal'
    }
    // - действие
    const segment: ISegment = new Segment(new ViewHandlerStab(),options);
    // - проверка
    expect(segment.getElem().value).toBe(testValue.toString());
  })
  it('Элемент должен иметь коэффициент роста равный 1 по-умолчанию', () => {
    // - действие
    const segment: ISegment = new Segment(new ViewHandlerStab());
    // - проверка
    expect(segment.getElem().style.flexGrow).toBe('1');
  })
  it('Элемент должен иметь подпись при передаче ее в опциях', () => {
    const expectedLabel = 'подпись';
    const options: TSegmentConfig = {
      className: 'stab',
      value: 0,
      notch: 'normal',
      label: expectedLabel
    }
    // - действие
    const segment: ISegment = new Segment(new ViewHandlerStab(), options);
    // - проверка
    expect(segment.getElem().label).toBe(expectedLabel);
  })
  it('Элемент должен иметь модификатор класса, отражающий именованый тип подписи, при передаче строки', () => {
    const blockName = 'my-segment';
    const label = 'подпись';
    const options: TSegmentConfig = {
      className: blockName,
      value: 0,
      notch: 'normal',
      label: label
    }
    const expectedClassName = `${blockName}_with-name`;
    // - действие
    const segment: ISegment = new Segment(new ViewHandlerStab(), options);
    // - проверка
    expect(segment.getElem().classList.contains(expectedClassName)).toBeTruthy();
  })
  it('Элемент должен иметь модификатор класса, отражающий числовой тип подписи, при передаче числа', () => {
    const blockName = 'my-segment';
    const label = 12;
    const options: TSegmentConfig = {
      className: blockName,
      value: 0,
      notch: 'normal',
      label: label
    }
    const expectedClassName = `${blockName}_with-number`;
    // - действие
    const segment: ISegment = new Segment(new ViewHandlerStab(), options);
    // - проверка
    expect(segment.getElem().classList.contains(expectedClassName)).toBeTruthy();
  })
  it('Элемент должен иметь модификатор класса, сообщающий о том что это последний такой элемент, при соответсвующего флага в опциях', () => {
    const blockName = 'my-segment';
    const options: TSegmentConfig = {
      className: blockName,
      value: 0,
      notch: 'normal',
      isLast: true
    }
    const expectedClassName = `${blockName}_last`;
    // - действие
    const segment: ISegment = new Segment(new ViewHandlerStab(), options);
    // - проверка
    expect(segment.getElem().classList.contains(expectedClassName)).toBeTruthy();
  })
  it('Элемент должен иметь коэффициент роста равный 10 после обновления с соответсвующими опциями', () => {
    const segment: ISegment = new Segment(new ViewHandlerStab());
    const testGrow = 10;
    // - действие
    segment.update({
      className: 'stab',
      value: 0,
      notch: 'normal',
      grow: testGrow,
    })
    // - проверка
    expect(segment.getElem().style.flexGrow).toBe(testGrow.toString());
  })
  it('В обработчик вью должно быть передано значение, при клике на элементе', () => {
    const viewHandlerStab = new ViewHandlerStab();
    const spy = jest.spyOn(viewHandlerStab, 'handleSelectValue');
    const testValue = 14;
    const options: TSegmentConfig = {
      className: 'stab',
      value: testValue,
      notch: 'normal'
    }
    const segment: ISegment = new Segment(viewHandlerStab, options);
    // - действие
    segment.getElem().dispatchEvent(new Event('click'));
    // - проверка
    expect(spy).toHaveBeenCalledWith(testValue);
  })
})