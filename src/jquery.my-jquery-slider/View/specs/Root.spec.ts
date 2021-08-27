/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable lines-between-class-members */
/* eslint-disable no-useless-return */
/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */

import { IRoot, TRootConfig } from '../Root/Root';
import HorizontalRoot from '../Root/HorizontalRoot';
import VerticalRoot from '../Root/VerticalRoot';
import { ISlot } from '../Slot/Slot';
import { IScale } from '../Scale';

describe('Настройка корневого элемента', () => {
  // - подготовка
  class SlotStab implements ISlot {
    update(): void {}
    getElem(): HTMLDivElement { return; }
  }
  class ScaleStab implements IScale {
    update(): void {}
    getElem(): HTMLDataListElement { return; }
    setSegments(): void {}
    calcReasonableStep(): number { return; }
  }
  let rootElem: HTMLElement;
  let slotStab: ISlot;
  let rootConfig: TRootConfig;
  describe('Горизонтальный вид', () => {
    it('Экземпляр должен быть создан', () => {
      rootElem = document.createElement('div');
      slotStab = new SlotStab();
      // - действие
      const root: IRoot = new HorizontalRoot(rootElem, slotStab);
      // - проверка
      expect(root).toBeDefined();
    });
    describe('Отображение', () => {
      beforeEach(() => {
        rootElem = document.createElement('div');
        slotStab = new SlotStab();
        rootConfig = { className: 'my-slider' };
      });
      it('Корневой элемент должен иметь дефолтный класс', () => {
        const expectedClassName = 'my-jquery-slider';
        const root: IRoot = new HorizontalRoot(rootElem, slotStab);
        // - действие
        root.display();
        // - проверка
        expect(rootElem.className).toBe(expectedClassName);
      });
      it('Корневой элемент должен иметь класс заданный в опциях', () => {
        const { className: expectedClassName } = rootConfig;
        const root: IRoot = new HorizontalRoot(rootElem, slotStab, rootConfig);
        // - действие
        root.display();
        // - проверка
        expect(rootElem.className).toBe(expectedClassName);
      });
      it('Корневой элемент должен содержать один элемент', () => {
        const expectedCount = 1;
        const root: IRoot = new HorizontalRoot(rootElem, slotStab);
        // - действие
        root.display();
        // - проверка
        expect(rootElem.childNodes.length).toBe(expectedCount);
      });
      it('Корневой элемент должен содержать два элемента, при добавлении шкалы', () => {
        const expectedCount = 2;
        const root: IRoot = new HorizontalRoot(rootElem, slotStab);
        root.setScale(new ScaleStab());
        // - действие
        root.display();
        // - проверка
        expect(rootElem.childNodes.length).toBe(expectedCount);
      });
      it('Стили ширины и минимальной ширины корневого элемента должны быть равны длине в опциях', () => {
        const expectedWidth = 123;
        const root: IRoot = new HorizontalRoot(
          rootElem,
          slotStab,
          { ...rootConfig, lengthPx: expectedWidth },
        );
        // - действие
        root.display();
        // - проверка
        expect(rootElem.style.width).toBe(`${expectedWidth}px`);
        expect(rootElem.style.minWidth).toBe(`${expectedWidth}px`);
      });
      it('Стили ширины и минимальной ширины корневого элемента должны быть равны 99px при меньшей длине в опциях', () => {
        const expectedWidth = 12;
        const root: IRoot = new HorizontalRoot(
          rootElem,
          slotStab,
          { ...rootConfig, lengthPx: expectedWidth },
        );
        // - действие
        root.display();
        // - проверка
        expect(rootElem.style.width).toBe('99px');
        expect(rootElem.style.minWidth).toBe('99px');
      });
      it('Корневой элемент должен иметь класс характеризующий отсутствие отступов, при обозначении отсутствия отступов в опциях', () => {
        const root: IRoot = new HorizontalRoot(
          rootElem,
          slotStab,
          { ...rootConfig, indent: 'none' },
        );
        const expectedClass = `${rootConfig.className}_indent_none`;
        // - действие
        root.display();
        // - проверка
        expect(rootElem.classList.contains(expectedClass)).toBeTruthy();
      });
      it('Корневой элемент должен иметь класс характеризующий дополнительные отступы, при обозначении дополнительных отступов в опциях', () => {
        const root: IRoot = new HorizontalRoot(
          rootElem,
          slotStab,
          { ...rootConfig, indent: 'more' },
        );
        const expectedClass = `${rootConfig.className}_indent_add`;
        // - действие
        root.display();
        // - проверка
        expect(rootElem.classList.contains(expectedClass)).toBeTruthy();
      });
    });
    describe('Расчет внутренней длины', () => {
      beforeEach(() => {
        rootElem = document.createElement('div');
        slotStab = new SlotStab();
      });
      it('Должен вычитать внутренние отступы', () => {
        const expectedWidth = 123;
        const testPadding = 40;
        rootElem.getBoundingClientRect = jest.fn().mockImplementation(
          () => ({ width: expectedWidth }),
        );
        rootElem.style.padding = `${testPadding}px`;
        const root: IRoot = new HorizontalRoot(rootElem, slotStab);
        root.display();
        // - действие / проверка
        expect(root.calcContentLengthPx()).toBe(expectedWidth - 2 * testPadding);
      });
    });
    describe('Обновление', () => {
      beforeEach(() => {
        rootElem = document.createElement('div');
        slotStab = new SlotStab();
        rootConfig = { className: 'my-slider' };
      });
      it('Корневой элемент не должен измениться, при тех же опциях', () => {
        const root: IRoot = new HorizontalRoot(rootElem, slotStab, { ...rootConfig });
        root.display();
        const expectedRootElem = { ...rootElem };
        // - действие
        root.update({ ...rootConfig });
        // - проверка
        expect({ ...rootElem }).toEqual(expectedRootElem);
      });
      it('Корневой элемент должен содержать класс отражающий отсутствие отступов', () => {
        const root: IRoot = new HorizontalRoot(rootElem, slotStab, { ...rootConfig });
        root.display();
        // - действие
        root.update({ ...rootConfig, indent: 'none' });
        // - проверка
        expect(rootElem.classList.contains(`${rootConfig.className}_indent_none`)).toBeTruthy();
      });
      it('Стили ширины и минимальной ширины корневого элемента должны быть равны длине в опциях', () => {
        const root: IRoot = new HorizontalRoot(rootElem, slotStab, { ...rootConfig });
        root.display();
        const expectedWidth = 1234;
        // - действие
        root.update({ ...rootConfig, lengthPx: expectedWidth });
        // - проверка
        expect(rootElem.style.width).toBe(`${expectedWidth}px`);
        expect(rootElem.style.minWidth).toBe(`${expectedWidth}px`);
      });
    });
  });
  describe('Вертикальный вид', () => {
    it('Экземпляр должен быть создан', () => {
      rootElem = document.createElement('div');
      slotStab = new SlotStab();
      // - действие
      const root: IRoot = new VerticalRoot(rootElem, slotStab);
      // - проверка
      expect(root).toBeDefined();
    });
    describe('Отображение', () => {
      beforeEach(() => {
        rootElem = document.createElement('div');
        slotStab = new SlotStab();
        rootConfig = { className: 'my-slider' };
      });
      it('Корневой элемент должен измениться после отображения', () => {
        const root: IRoot = new VerticalRoot(rootElem, slotStab, { ...rootConfig });
        const expectedRootElem = { ...rootElem };
        // - действие
        root.display();
        // - проверка
        expect({ ...rootElem }).not.toEqual(expectedRootElem);
      });
      it('Корневой элемент должен содержать класс отражающий вертикальную ориентацию', () => {
        const root: IRoot = new VerticalRoot(rootElem, slotStab, { ...rootConfig });
        const expectedClass = `${rootConfig.className}_vertical`;
        // - действие
        root.display();
        // - проверка
        expect(rootElem.classList.contains(expectedClass)).toBeTruthy();
      });
      it('Стили высоты и минимальной высоты корневого элемента должны быть равны длине в опциях', () => {
        const expectedHeight = 123;
        const root: IRoot = new VerticalRoot(
          rootElem,
          slotStab,
          { ...rootConfig, lengthPx: expectedHeight },
        );
        // - действие
        root.display();
        // - проверка
        expect(rootElem.style.height).toBe(`${expectedHeight}px`);
        expect(rootElem.style.minHeight).toBe(`${expectedHeight}px`);
      });
      it('Стили высоты и минимальной высоты корневого элемента должны быть равны 80px при меньшей длине в опциях', () => {
        const expectedHeight = 12;
        const root: IRoot = new VerticalRoot(
          rootElem,
          slotStab,
          { ...rootConfig, lengthPx: expectedHeight },
        );
        // - действие
        root.display();
        // - проверка
        expect(rootElem.style.height).toBe('80px');
        expect(rootElem.style.minHeight).toBe('80px');
      });
    });
    describe('Расчет внутренней длины', () => {
      beforeEach(() => {
        rootElem = document.createElement('div');
        slotStab = new SlotStab();
      });
      it('Должен вычитать внутренние отступы', () => {
        const expectedHeight = 123;
        const testPadding = 40;
        rootElem.getBoundingClientRect = jest.fn().mockImplementation(
          () => ({ height: expectedHeight }),
        );
        rootElem.style.padding = `${testPadding}px`;
        const root: IRoot = new VerticalRoot(rootElem, slotStab);
        root.display();
        // - действие / проверка
        expect(root.calcContentLengthPx()).toBe(expectedHeight - 2 * testPadding);
      });
    });
  });
});
