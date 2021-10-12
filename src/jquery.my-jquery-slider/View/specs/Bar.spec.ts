/**
 * @jest-environment jsdom
 */
/* eslint-disable no-useless-return */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */
/* eslint-disable max-classes-per-file */

import { IBar, TBarConfig } from '../Bar/Bar';
import HorizontalBar from '../Bar/HorizontalBar';
import VerticalBar from '../Bar/VerticalBar';
import { IThumb } from '../Thumb';

describe('Бар', () => {
  class ThumbStab implements IThumb {
    update(): void {}
    getElem(): HTMLDivElement { return; }
    isProcessed(): boolean { return; }
    activate(): void {}
  }
  describe('Горизонтальный вид', () => {
    it('Экземпляр должен быть создан', () => {
      const bar: IBar = new HorizontalBar(new ThumbStab());

      expect(bar).toBeDefined();
    });
    it('Элемент должен быть создан', () => {
      const bar: IBar = new HorizontalBar(new ThumbStab());

      expect(bar.getElem()).toBeDefined();
    });
    it('Элемент должен содержать один элемент', () => {
      const bar: IBar = new HorizontalBar(new ThumbStab());

      expect(bar.getElem().childNodes.length).toBe(1);
    });
    it('Элемент должен содержать дефолтный класс', () => {
      const bar: IBar = new HorizontalBar(new ThumbStab());

      expect(bar.getElem().classList.contains('bar')).toBeTruthy();
    });
    it('Элемент должен содержать класс переданный в опциях', () => {
      const expectedClassName = 'my-bar';
      const options: TBarConfig = {
        className: expectedClassName,
        id: 0,
        lengthPer: 60,
        indentPer: 10,
        isActive: false,
        isActual: false,
        isEven: false,
      };

      const bar: IBar = new HorizontalBar(new ThumbStab(), options);

      expect(bar.getElem().classList.contains(expectedClassName)).toBeTruthy();
    });
    it('Элемент должен содержать класс отражающий актуальность бара', () => {
      const testBlockName = 'my-bar';
      const options: TBarConfig = {
        className: testBlockName,
        id: 0,
        lengthPer: 60,
        indentPer: 10,
        isActive: false,
        isActual: true,
        isEven: false,
      };
      const expectedClassName = `${testBlockName}_actual`;

      const bar: IBar = new HorizontalBar(new ThumbStab(), options);

      expect(bar.getElem().classList.contains(expectedClassName)).toBeTruthy();
    });
    it('Элемент должен содержать класс отражающий четность бара, при наличии флага четности и актуальности', () => {
      const testBlockName = 'my-bar';
      const options: TBarConfig = {
        className: testBlockName,
        id: 0,
        lengthPer: 60,
        indentPer: 10,
        isActive: false,
        isActual: true,
        isEven: true,
      };
      const expectedClassName = `${testBlockName}_even`;

      const bar: IBar = new HorizontalBar(new ThumbStab(), options);

      expect(bar.getElem().classList.contains(expectedClassName)).toBeTruthy();
    });
    it('Элемент не должен содержать классы отражающие активность и четность бара, при наличии флагов активности и четности, и отсутствий флага актуальности', () => {
      const testBlockName = 'my-bar';
      const options: TBarConfig = {
        className: testBlockName,
        id: 0,
        lengthPer: 60,
        indentPer: 10,
        isActive: true,
        isActual: false,
        isEven: true,
      };
      const expectedActiveClass = `${testBlockName}_active`;
      const expectedEvenClass = `${testBlockName}_even`;

      const bar: IBar = new HorizontalBar(new ThumbStab(), options);

      expect(bar.getElem().classList.contains(expectedActiveClass)).toBeFalsy();
      expect(bar.getElem().classList.contains(expectedEvenClass)).toBeFalsy();
    });
    it('Ширина элемента в процентах должна соответствовать заданной в опциях', () => {
      const testBlockName = 'my-bar';
      const expectedWidth = 60;
      const options: TBarConfig = {
        className: testBlockName,
        id: 0,
        lengthPer: expectedWidth,
        indentPer: 10,
        isActive: false,
        isActual: false,
        isEven: false,
      };

      const bar: IBar = new HorizontalBar(new ThumbStab(), options);

      expect(bar.getElem().style.width).toBe(`${expectedWidth}%`);
    });
    it('Должен возвращать флаг отражающий необработанное состояние, при опускании указателя на элементе бара', () => {
      const bar: IBar = new HorizontalBar(new ThumbStab());
      const barElem = bar.getElem();

      barElem.dispatchEvent(new Event('pointerdown'));

      expect(bar.isProcessed()).toBeFalsy();
    });
    it('Палец должен быть активирован, при опускании указателя на элементе бара, если он в обработанном состоянии', () => {
      class ProcessedThumbStab extends ThumbStab {
        isProcessed(): boolean { return true; }
      }
      const thumb = new ProcessedThumbStab();
      const spy = jest.spyOn(thumb, 'activate');
      const bar: IBar = new HorizontalBar(thumb);
      const barElem = bar.getElem();

      barElem.dispatchEvent(new Event('pointerdown'));

      expect(spy).toHaveBeenCalled();
    });
    it('Палец не должен быть активирован, при опускании указателя на элементе бара, если он в процессе обработки', () => {
      class ProcessedThumbStab extends ThumbStab {
        isProcessed(): boolean { return false; }
      }
      const thumb = new ProcessedThumbStab();
      const spy = jest.spyOn(thumb, 'activate');
      const bar: IBar = new HorizontalBar(thumb);
      const barElem = bar.getElem();

      barElem.dispatchEvent(new Event('pointerdown'));

      expect(spy).not.toHaveBeenCalled();
    });
    it('Элемент должен содержать класс отражающий активность бара, при опускании указателя на элементе бара и наличии флага актуальности в опциях', () => {
      const testBlockName = 'my-bar';
      const options: TBarConfig = {
        className: testBlockName,
        id: 0,
        lengthPer: 1000,
        indentPer: 10,
        isActive: false,
        isActual: true,
        isEven: false,
      };
      const expectedClassName = `${testBlockName}_active`;
      const bar: IBar = new HorizontalBar(new ThumbStab(), options);
      const barElem = bar.getElem();

      barElem.dispatchEvent(new Event('pointerdown'));

      expect(bar.getElem().classList.contains(expectedClassName)).toBeTruthy();
    });
    it('Элемент не должен содержать класс отражающий активность бара, при опускании указателя на элементе бара и отсутствия флага актуальности в опциях', () => {
      const testBlockName = 'my-bar';
      const options: TBarConfig = {
        className: testBlockName,
        id: 0,
        lengthPer: 1000,
        indentPer: 10,
        isActive: false,
        isActual: false,
        isEven: false,
      };
      const expectedClassName = `${testBlockName}_active`;
      const bar: IBar = new HorizontalBar(new ThumbStab(), options);
      const barElem = bar.getElem();

      barElem.dispatchEvent(new Event('pointerdown'));

      expect(bar.getElem().classList.contains(expectedClassName)).toBeFalsy();
    });
    it('Должен возвращать флаг отражающий обработанное состояние, при подъеме указателя на документе', () => {
      const bar: IBar = new HorizontalBar(new ThumbStab());

      document.dispatchEvent(new Event('pointerup'));

      expect(bar.isProcessed()).toBeTruthy();
    });
    it('Элемент не должен содержать класса отражающего активность, после опускания указателя на элементе и подъеме указателя на документе', () => {
      const bar: IBar = new HorizontalBar(new ThumbStab());
      const barElem = bar.getElem();
      barElem.dispatchEvent(new Event('pointerdown'));
      const expectedClassName = 'bar_active';

      document.dispatchEvent(new Event('pointerup'));

      expect(bar.getElem().classList.contains(expectedClassName)).toBeFalsy();
    });
    it('Должен возвращать флаг отражающий необработанное состояние, при активации', () => {
      const bar: IBar = new HorizontalBar(new ThumbStab());

      bar.activate();

      expect(bar.isProcessed()).toBeFalsy();
    });
    it('Должен возвращать левый отступ элемента', () => {
      const expectedValue = 123;
      const bar: IBar = new HorizontalBar(new ThumbStab());
      bar.getElem().getBoundingClientRect = jest.fn().mockImplementation(
        () => ({ left: expectedValue }),
      );

      expect(bar.calcIndentPX()).toBe(expectedValue);
    });
    it('Элемент должен соответствовать переданным опциям при обновлении', () => {
      const testBlockName = 'my-bar';
      const initOptions: TBarConfig = {
        className: testBlockName,
        id: 0,
        lengthPer: 60,
        indentPer: 10,
        isActive: false,
        isActual: false,
        isEven: false,
      };
      const bar: IBar = new HorizontalBar(new ThumbStab(), initOptions);
      const expectedWidth = 30;
      const expectedActualClass = `${testBlockName}_actual`;
      const expectedActiveClass = `${testBlockName}_active`;
      const expectedEvenClass = `${testBlockName}_even`;
      const updateOptions: TBarConfig = {
        className: testBlockName,
        id: 1,
        lengthPer: expectedWidth,
        indentPer: 5,
        isActive: true,
        isActual: true,
        isEven: true,
      };

      bar.update(updateOptions);

      expect(bar.getElem().classList.contains(expectedActualClass)).toBeTruthy();
      expect(bar.getElem().classList.contains(expectedActiveClass)).toBeTruthy();
      expect(bar.getElem().classList.contains(expectedEvenClass)).toBeTruthy();
      expect(bar.getElem().style.width).toBe(`${expectedWidth}%`);
    });
  });
  describe('Вертикальный вид', () => {
    it('Экземпляр должен быть создан', () => {
      const bar: IBar = new VerticalBar(new ThumbStab());

      expect(bar).toBeDefined();
    });
    it('Элемент должен содержать класс отражающий вертикальную ориентацию', () => {
      const expectedClassName = 'bar_vertical';

      const bar: IBar = new VerticalBar(new ThumbStab());

      expect(bar.getElem().classList.contains(expectedClassName)).toBeTruthy();
    });
    it('Высота элемента в процентах должна соответствовать заданной в опциях', () => {
      const testBlockName = 'my-bar';
      const expectedHeight = 60;
      const options: TBarConfig = {
        className: testBlockName,
        id: 0,
        lengthPer: expectedHeight,
        indentPer: 10,
        isActive: false,
        isActual: false,
        isEven: false,
      };

      const bar: IBar = new VerticalBar(new ThumbStab(), options);

      expect(bar.getElem().style.height).toBe(`${expectedHeight}%`);
    });
    it('Должен возвращать верхний отступ элемента', () => {
      const expectedValue = 123;
      const bar: IBar = new VerticalBar(new ThumbStab());
      bar.getElem().getBoundingClientRect = jest.fn().mockImplementation(
        () => ({ top: expectedValue }),
      );

      expect(bar.calcIndentPX()).toBe(expectedValue);
    });
    it('Элемент должен соответствовать переданным опциям при обновлении', () => {
      const testBlockName = 'my-bar';
      const initOptions: TBarConfig = {
        className: testBlockName,
        id: 0,
        lengthPer: 60,
        indentPer: 10,
        isActive: false,
        isActual: false,
        isEven: false,
      };
      const bar: IBar = new VerticalBar(new ThumbStab(), initOptions);
      const expectedWidth = 30;
      const expectedActualClass = `${testBlockName}_actual`;
      const expectedActiveClass = `${testBlockName}_active`;
      const expectedEvenClass = `${testBlockName}_even`;
      const updateOptions: TBarConfig = {
        className: testBlockName,
        id: 1,
        lengthPer: expectedWidth,
        indentPer: 5,
        isActive: true,
        isActual: true,
        isEven: true,
      };

      bar.update(updateOptions);

      expect(bar.getElem().classList.contains(expectedActualClass)).toBeTruthy();
      expect(bar.getElem().classList.contains(expectedActiveClass)).toBeTruthy();
      expect(bar.getElem().classList.contains(expectedEvenClass)).toBeTruthy();
      expect(bar.getElem().style.height).toBe(`${expectedWidth}%`);
    });
  });
});
