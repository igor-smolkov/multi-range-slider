/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-useless-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */
/* eslint-disable max-classes-per-file */

import { IBar } from '../Bar/Bar';
import { ISlot } from '../Slot/Slot';
import HorizontalSlot from '../Slot/HorizontalSlot';
import VerticalSlot from '../Slot/VerticalSlot';
import { IViewHandler } from '../IView';

describe('Слот', () => {
  class BarStab implements IBar {
    update(): void {}
    getElem(): HTMLDivElement { return; }
    isProcessed(): boolean { return; }
    activate(): void {}
    calcIndentPX(): number { return; }
  }
  class ViewHandlerStab implements IViewHandler {
    handleSelectRange(): void {}
    handleSelectValue(): void {}
    handleSelectPerValue(): void {}
    handleStepForward(): void {}
    handleStepBackward(): void {}
    handleFocus(): void {}
  }
  describe('Горизонтальный вид', () => {
    it('Экземпляр должен быть создан', () => {
      const slot: ISlot = new HorizontalSlot([new BarStab()], new ViewHandlerStab());

      expect(slot).toBeDefined();
    });
    it('Элемент должен быть создан', () => {
      const slot: ISlot = new HorizontalSlot([new BarStab()], new ViewHandlerStab());

      expect(slot.getElem()).toBeDefined();
    });
    it('Элемент должен иметь дефолтный класс', () => {
      const expectedName = 'slot';

      const slot: ISlot = new HorizontalSlot([new BarStab()], new ViewHandlerStab());

      expect(slot.getElem().className).toBe(expectedName);
    });
    it('Элемент должен иметь класс заданный в опциях', () => {
      const testName = 'my-slot';

      const slot: ISlot = new HorizontalSlot(
        [new BarStab()],
        new ViewHandlerStab(),
        { className: testName },
      );

      expect(slot.getElem().className).toBe(testName);
    });
    it('Элемент должен содержать два элемента', () => {
      const testBars = [new BarStab(), new BarStab()];

      const slot: ISlot = new HorizontalSlot(testBars, new ViewHandlerStab());

      expect(slot.getElem().childNodes.length).toBe(testBars.length);
    });
    it('У элемента не должно быть отступов при соответствующем флаге в опциях', () => {
      const slot: ISlot = new HorizontalSlot(
        [new BarStab()],
        new ViewHandlerStab(),
        { className: 'stab', withIndent: false },
      );

      expect(slot.getElem().style.margin).toBe('0px');
    });
    it('В обработчик вью должно быть передано процентное значение позиции указателя внутри слота, при опускании указателя на слоте', () => {
      const viewHandlerStab = new ViewHandlerStab();
      const spy = jest.spyOn(viewHandlerStab, 'handleSelectPerValue');
      const slot: ISlot = new HorizontalSlot([new BarStab()], viewHandlerStab);
      const slotElem = slot.getElem();
      slotElem.getBoundingClientRect = jest.fn().mockImplementation(
        () => ({ width: 1000, left: 0 }),
      );
      const pointerPosition = 150;
      const event = document.createEvent('MouseEvents');
      event.initMouseEvent('pointerdown', true, true, window, 0, 0, 0, pointerPosition, 0, false, false, false, false, 0, null);

      slotElem.dispatchEvent(event);

      expect(spy).toHaveBeenCalledWith(15);
    });
    it('Последний бар должен быть активирован, при опускании указателя на слоте и отсутствии необработанных баров', () => {
      class FirstBarStab extends BarStab {
        isProcessed(): boolean { return true; }
      }
      class LastBarStab extends BarStab {
        isProcessed(): boolean { return true; }
      }
      const testBars = [new FirstBarStab(), new LastBarStab()];
      const firstBarSpy = jest.spyOn(testBars[0], 'activate');
      const lastBarSpy = jest.spyOn(testBars[1], 'activate');
      const slot: ISlot = new HorizontalSlot(testBars, new ViewHandlerStab());
      const slotElem = slot.getElem();

      slotElem.dispatchEvent(new Event('pointerdown'));

      expect(firstBarSpy).not.toHaveBeenCalled();
      expect(lastBarSpy).toHaveBeenCalled();
    });
    it('Ни один бар не должен быть активирован, при опускании указателя на слоте раньше последнего бара и наличии необработанного бара', () => {
      class FirstBarStab extends BarStab {
        isProcessed(): boolean { return false; }
        calcIndentPX(): number { return 0; }
      }
      class LastBarStab extends BarStab {
        isProcessed(): boolean { return true; }
        calcIndentPX(): number { return 50; }
      }
      const testBars = [new FirstBarStab(), new LastBarStab()];
      const firstBarSpy = jest.spyOn(testBars[0], 'activate');
      const lastBarSpy = jest.spyOn(testBars[1], 'activate');
      const slot: ISlot = new HorizontalSlot(testBars, new ViewHandlerStab());
      const slotElem = slot.getElem();
      slotElem.getBoundingClientRect = jest.fn().mockImplementation(
        () => ({ width: 100, left: 0 }),
      );
      const pointerPosition = 10;
      const event = document.createEvent('MouseEvents');
      event.initMouseEvent('pointerdown', true, true, window, 0, 0, 0, pointerPosition, 0, false, false, false, false, 0, null);

      slotElem.dispatchEvent(event);

      expect(firstBarSpy).not.toHaveBeenCalled();
      expect(lastBarSpy).not.toHaveBeenCalled();
    });
    it('Обработчик вью не должен вызываться, при перемещении указателя по документу', () => {
      const viewHandlerStab = new ViewHandlerStab();
      const spy = jest.spyOn(viewHandlerStab, 'handleSelectPerValue');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const slot: ISlot = new HorizontalSlot([new BarStab()], viewHandlerStab);

      document.dispatchEvent(new Event('pointermove'));

      expect(spy).not.toHaveBeenCalled();
    });
    it('В обработчик вью должно быть передано процентное значение внутри слота, при перемещении указателя по документу после опускания указателя на слоте', () => {
      const viewHandlerStab = new ViewHandlerStab();
      const spy = jest.spyOn(viewHandlerStab, 'handleSelectPerValue');
      const slot: ISlot = new HorizontalSlot([new BarStab()], viewHandlerStab);
      const slotElem = slot.getElem();
      slotElem.getBoundingClientRect = jest.fn().mockImplementation(
        () => ({ width: 1000, left: 0 }),
      );
      const pointerdownPosition = 150;
      const pointerdownEvent = document.createEvent('MouseEvents');
      pointerdownEvent.initMouseEvent('pointerdown', true, true, window, 0, 0, 0, pointerdownPosition, 0, false, false, false, false, 0, null);
      slotElem.dispatchEvent(pointerdownEvent);
      const pointermovePosition = 200;
      const pointermoveEvent = document.createEvent('MouseEvents');
      pointermoveEvent.initMouseEvent('pointermove', true, true, window, 0, 0, 0, pointermovePosition, 0, false, false, false, false, 0, null);

      document.dispatchEvent(pointermoveEvent);

      expect(spy.mock.calls[0]).toEqual([15]);
      expect(spy.mock.calls[1]).toEqual([20]);
    });
    it('Обработчик вью не должен вызываться, при перемещении указателя по документу после опускания указателя на слоте и подъеме указателя на документе', () => {
      const viewHandlerStab = new ViewHandlerStab();
      const slot: ISlot = new HorizontalSlot([new BarStab()], viewHandlerStab);
      slot.getElem().dispatchEvent(new Event('pointerdown'));
      document.dispatchEvent(new Event('pointerup'));
      const spy = jest.spyOn(viewHandlerStab, 'handleSelectPerValue');

      document.dispatchEvent(new Event('pointermove'));

      expect(spy).not.toHaveBeenCalled();
    });
    it('Элемент не должен обновиться при тех же опциях', () => {
      const testOptions = { className: 'my-slot' };
      const slot: ISlot = new HorizontalSlot(
        [new BarStab()], new ViewHandlerStab(), { ...testOptions },
      );
      const oldElem = slot.getElem();

      slot.update({ ...testOptions });

      expect(slot.getElem()).toEqual(oldElem);
    });
    it('У элемента не должно быть отступов при соответствующем флаге в опциях обновления', () => {
      const testOptions = { className: 'my-slot' };
      const slot: ISlot = new HorizontalSlot(
        [new BarStab()], new ViewHandlerStab(), { ...testOptions },
      );

      slot.update({ ...testOptions, withIndent: false });

      expect(slot.getElem().style.margin).toBe('0px');
    });
  });
  describe('Вертикальный вид', () => {
    it('Экземпляр должен быть создан', () => {
      const slot: ISlot = new VerticalSlot([new BarStab()], new ViewHandlerStab());

      expect(slot).toBeDefined();
    });
    it('Элемент должен содержать класс отражающий вертикальную ориентацию', () => {
      const expectedClass = 'slot_vertical';

      const slot: ISlot = new VerticalSlot([new BarStab()], new ViewHandlerStab());

      expect(slot.getElem().classList.contains(expectedClass)).toBeTruthy();
    });
    it('В обработчик вью должно быть передано процентное значение позиции указателя внутри слота, при опускании указателя на слоте', () => {
      const viewHandlerStab = new ViewHandlerStab();
      const spy = jest.spyOn(viewHandlerStab, 'handleSelectPerValue');
      const slot: ISlot = new VerticalSlot([new BarStab()], viewHandlerStab);
      const slotElem = slot.getElem();
      slotElem.getBoundingClientRect = jest.fn().mockImplementation(
        () => ({ height: 1000, top: 0 }),
      );
      const pointerPosition = 150;
      const event = document.createEvent('MouseEvents');
      event.initMouseEvent('pointerdown', true, true, window, 0, 0, 0, 0, pointerPosition, false, false, false, false, 0, null);

      slotElem.dispatchEvent(event);

      expect(spy).toHaveBeenCalledWith(100 - 15);
    });
    it('Ни один бар не должен быть активирован, при опускании указателя на слоте раньше последнего бара и наличии необработанного бара', () => {
      class FirstBarStab extends BarStab {
        isProcessed(): boolean { return false; }
        calcIndentPX(): number { return 0; }
      }
      class LastBarStab extends BarStab {
        isProcessed(): boolean { return true; }
        calcIndentPX(): number { return 50; }
      }
      const testBars = [new FirstBarStab(), new LastBarStab()];
      const firstBarSpy = jest.spyOn(testBars[0], 'activate');
      const lastBarSpy = jest.spyOn(testBars[1], 'activate');
      const slot: ISlot = new VerticalSlot(testBars, new ViewHandlerStab());
      const slotElem = slot.getElem();
      slotElem.getBoundingClientRect = jest.fn().mockImplementation(
        () => ({ height: 100, top: 0 }),
      );
      const pointerPosition = 90;
      const event = document.createEvent('MouseEvents');
      event.initMouseEvent('pointerdown', true, true, window, 0, 0, 0, 0, pointerPosition, false, false, false, false, 0, null);

      slotElem.dispatchEvent(event);

      expect(firstBarSpy).not.toHaveBeenCalled();
      expect(lastBarSpy).not.toHaveBeenCalled();
    });
    it('В обработчик вью должно быть передано процентное значение внутри слота, при перемещении указателя по документу после опускания указателя на слоте', () => {
      const viewHandlerStab = new ViewHandlerStab();
      const spy = jest.spyOn(viewHandlerStab, 'handleSelectPerValue');
      const slot: ISlot = new VerticalSlot([new BarStab()], viewHandlerStab);
      const slotElem = slot.getElem();
      slotElem.getBoundingClientRect = jest.fn().mockImplementation(
        () => ({ height: 1000, top: 0 }),
      );
      const pointerdownPosition = 150;
      const pointerdownEvent = document.createEvent('MouseEvents');
      pointerdownEvent.initMouseEvent('pointerdown', true, true, window, 0, 0, 0, 0, pointerdownPosition, false, false, false, false, 0, null);
      slotElem.dispatchEvent(pointerdownEvent);
      const pointermovePosition = 200;
      const pointermoveEvent = document.createEvent('MouseEvents');
      pointermoveEvent.initMouseEvent('pointermove', true, true, window, 0, 0, 0, 0, pointermovePosition, false, false, false, false, 0, null);

      document.dispatchEvent(pointermoveEvent);

      expect(spy.mock.calls[0]).toEqual([100 - 15]);
      expect(spy.mock.calls[1]).toEqual([100 - 20]);
    });
  });
});
