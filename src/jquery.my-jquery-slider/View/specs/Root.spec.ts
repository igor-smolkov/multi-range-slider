/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable lines-between-class-members */
/* eslint-disable no-useless-return */
/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */

import { IRoot, RootIndent, TRootConfig } from '../Root/Root';
import HorizontalRoot from '../Root/HorizontalRoot';
import VerticalRoot from '../Root/VerticalRoot';
import { IBarsSlot } from '../BarsSlot/BarsSlot';
import { IScale } from '../Scale';

const rootConfig: TRootConfig = {
  className: 'my-jquery-slider',
  indent: RootIndent.normal,
  lengthPx: null,
};
describe('Настройка корневого элемента', () => {
  let testScaleElem: HTMLDivElement;
  let testBarsSlotLength: number;
  class BarsSlotStab implements IBarsSlot {
    on(): void {}
    update(): void {}
    getElem(): HTMLDivElement { return document.createElement('div'); }
    calcLengthPX(): number { return testBarsSlotLength; }
  }
  class ScaleStab implements IScale {
    update(): void {}
    getElem(): HTMLDivElement { return testScaleElem; }
    setScaleSegments(): void {}
    calcReasonableStep(): number { return 0; }
  }
  let rootElem: HTMLElement;
  let barsSlotStab: IBarsSlot;
  describe('Горизонтальный вид', () => {
    it('Экземпляр должен быть создан', () => {
      rootElem = document.createElement('div');
      barsSlotStab = new BarsSlotStab();

      const root: IRoot = new HorizontalRoot(rootElem, barsSlotStab, { ...rootConfig });

      expect(root).toBeDefined();
    });
    describe('Отображение', () => {
      beforeEach(() => {
        rootElem = document.createElement('div');
        barsSlotStab = new BarsSlotStab();
      });
      it('Корневой элемент должен иметь класс заданный в опциях', () => {
        const { className: expectedClassName } = rootConfig;
        const root: IRoot = new HorizontalRoot(rootElem, barsSlotStab, { ...rootConfig });

        root.display();

        expect(rootElem.className).toBe(expectedClassName);
      });
      it('Корневой элемент должен содержать один элемент', () => {
        const expectedCount = 1;
        const root: IRoot = new HorizontalRoot(rootElem, barsSlotStab, { ...rootConfig });

        root.display();

        expect(rootElem.childNodes.length).toBe(expectedCount);
      });
      it('Корневой элемент должен содержать два элемента, при добавлении шкалы', () => {
        const expectedCount = 2;
        const root: IRoot = new HorizontalRoot(rootElem, barsSlotStab, { ...rootConfig });
        root.setScale(new ScaleStab());

        root.display();

        expect(rootElem.childNodes.length).toBe(expectedCount);
      });
      it('Стили ширины и минимальной ширины корневого элемента должны быть равны длине в опциях', () => {
        const expectedWidth = 123;
        const root: IRoot = new HorizontalRoot(
          rootElem,
          barsSlotStab,
          { ...rootConfig, lengthPx: expectedWidth },
        );

        root.display();

        expect(rootElem.style.width).toBe(`${expectedWidth}px`);
        expect(rootElem.style.minWidth).toBe(`${expectedWidth}px`);
      });
      it('Стили ширины и минимальной ширины корневого элемента должны быть равны 105px при меньшей длине в опциях', () => {
        const expectedWidth = 12;
        const root: IRoot = new HorizontalRoot(
          rootElem,
          barsSlotStab,
          { ...rootConfig, lengthPx: expectedWidth },
        );

        root.display();

        expect(rootElem.style.width).toBe('105px');
        expect(rootElem.style.minWidth).toBe('105px');
      });
      it('Корневой элемент должен иметь класс характеризующий отсутствие отступов, при обозначении отсутствия отступов в опциях', () => {
        const root: IRoot = new HorizontalRoot(
          rootElem,
          barsSlotStab,
          { ...rootConfig, indent: RootIndent.none },
        );
        const expectedClass = `${rootConfig.className}_indent_none`;

        root.display();

        expect(rootElem.classList.contains(expectedClass)).toBeTruthy();
      });
      it('Корневой элемент должен иметь класс характеризующий дополнительные отступы, при обозначении дополнительных отступов в опциях', () => {
        const root: IRoot = new HorizontalRoot(
          rootElem,
          barsSlotStab,
          { ...rootConfig, indent: RootIndent.more },
        );
        const expectedClass = `${rootConfig.className}_indent_add`;

        root.display();

        expect(rootElem.classList.contains(expectedClass)).toBeTruthy();
      });
      it('Корневой элемент не зачищается полностью при наличии флага', () => {
        const expectedCount = 3;
        const root: IRoot = new HorizontalRoot(rootElem, barsSlotStab, { ...rootConfig });
        root.display();

        rootElem.append(document.createElement('div'));
        rootElem.append(document.createElement('div'));
        root.display(true);

        expect(rootElem.childNodes.length).toBe(expectedCount);
      });
      it('При установке шкалы, старый элемент удаляется', () => {
        testScaleElem = document.createElement('div');
        const expectedCount = 1;
        const root: IRoot = new HorizontalRoot(rootElem, barsSlotStab, { ...rootConfig });
        root.setScale(new ScaleStab());
        root.display();

        root.setScale(new ScaleStab());

        expect(rootElem.childNodes.length).toBe(expectedCount);
      });
    });
    describe('Расчет внутренней длины', () => {
      beforeEach(() => {
        rootElem = document.createElement('div');
        barsSlotStab = new BarsSlotStab();
      });
      it('Должен вычитать внутренние отступы', () => {
        const expectedWidth = 123;
        const testPadding = 15;
        rootElem.getBoundingClientRect = jest.fn().mockImplementation(
          () => ({ width: expectedWidth }),
        );
        rootElem.style.padding = `${testPadding}px`;
        const root: IRoot = new HorizontalRoot(rootElem, barsSlotStab, { ...rootConfig });
        root.display();

        expect(root.calcContentLengthPx()).toBe(expectedWidth - 2 * testPadding);
      });
    });
    describe('Обновление', () => {
      beforeEach(() => {
        rootElem = document.createElement('div');
        barsSlotStab = new BarsSlotStab();
      });
      it('Корневой элемент не должен измениться, при тех же опциях', () => {
        const root: IRoot = new HorizontalRoot(rootElem, barsSlotStab, { ...rootConfig });
        root.display();
        const expectedRootElem = { ...rootElem };

        root.update({ ...rootConfig });

        expect({ ...rootElem }).toEqual(expectedRootElem);
      });
      it('Корневой элемент должен содержать класс отражающий отсутствие отступов', () => {
        const root: IRoot = new HorizontalRoot(rootElem, barsSlotStab, { ...rootConfig });
        root.display();

        root.update({ ...rootConfig, indent: RootIndent.none });

        expect(rootElem.classList.contains(`${rootConfig.className}_indent_none`)).toBeTruthy();
      });
      it('Стили ширины и минимальной ширины корневого элемента должны быть равны длине в опциях', () => {
        const root: IRoot = new HorizontalRoot(rootElem, barsSlotStab, { ...rootConfig });
        root.display();
        const expectedWidth = 1234;

        root.update({ ...rootConfig, lengthPx: expectedWidth });

        expect(rootElem.style.width).toBe(`${expectedWidth}px`);
        expect(rootElem.style.minWidth).toBe(`${expectedWidth}px`);
      });
      it('Стили ширины и минимальной ширины корневого элемента должны быть равны 100%', () => {
        testBarsSlotLength = 300;
        const root: IRoot = new HorizontalRoot(rootElem, barsSlotStab, { ...rootConfig });
        root.display();

        expect(rootElem.style.width).toBe('100%');
        expect(rootElem.style.minWidth).toBe('100%');
      });
    });
  });
  describe('Вертикальный вид', () => {
    it('Экземпляр должен быть создан', () => {
      rootElem = document.createElement('div');
      barsSlotStab = new BarsSlotStab();

      const root: IRoot = new VerticalRoot(rootElem, barsSlotStab, { ...rootConfig });

      expect(root).toBeDefined();
    });
    describe('Отображение', () => {
      beforeEach(() => {
        rootElem = document.createElement('div');
        barsSlotStab = new BarsSlotStab();
      });
      it('Корневой элемент должен измениться после отображения', () => {
        const root: IRoot = new VerticalRoot(rootElem, barsSlotStab, { ...rootConfig });
        const expectedRootElem = { ...rootElem };

        root.display();

        expect({ ...rootElem }).not.toEqual(expectedRootElem);
      });
      it('Корневой элемент должен содержать класс отражающий вертикальную ориентацию', () => {
        const root: IRoot = new VerticalRoot(rootElem, barsSlotStab, { ...rootConfig });
        const expectedClass = `${rootConfig.className}_vertical`;

        root.display();

        expect(rootElem.classList.contains(expectedClass)).toBeTruthy();
      });
      it('Стили высоты и минимальной высоты корневого элемента должны быть равны длине в опциях', () => {
        const expectedHeight = 123;
        const root: IRoot = new VerticalRoot(
          rootElem,
          barsSlotStab,
          { ...rootConfig, lengthPx: expectedHeight },
        );

        root.display();

        expect(rootElem.style.height).toBe(`${expectedHeight}px`);
        expect(rootElem.style.minHeight).toBe(`${expectedHeight}px`);
      });
      it('Стили высоты и минимальной высоты корневого элемента должны быть равны 110px при меньшей длине в опциях', () => {
        const expectedHeight = 12;
        const root: IRoot = new VerticalRoot(
          rootElem,
          barsSlotStab,
          { ...rootConfig, lengthPx: expectedHeight },
        );

        root.display();

        expect(rootElem.style.height).toBe('110px');
        expect(rootElem.style.minHeight).toBe('110px');
      });
      it('Стили высоты и минимальной высоты корневого элемента должны быть равны 100%', () => {
        testBarsSlotLength = 300;
        const root: IRoot = new VerticalRoot(rootElem, barsSlotStab, { ...rootConfig });
        root.display();

        expect(rootElem.style.height).toBe('100%');
        expect(rootElem.style.minHeight).toBe('100%');
      });
    });
    describe('Расчет внутренней длины', () => {
      beforeEach(() => {
        rootElem = document.createElement('div');
        barsSlotStab = new BarsSlotStab();
      });
      it('Должен вычитать внутренние отступы', () => {
        const expectedHeight = 123;
        const testPadding = 15;
        rootElem.getBoundingClientRect = jest.fn().mockImplementation(
          () => ({ height: expectedHeight }),
        );
        rootElem.style.padding = `${testPadding}px`;
        const root: IRoot = new VerticalRoot(rootElem, barsSlotStab, { ...rootConfig });
        root.display();

        expect(root.calcContentLengthPx()).toBe(expectedHeight - 2 * testPadding);
      });
    });
  });
});
