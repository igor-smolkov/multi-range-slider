/**
 * @jest-environment jsdom
 */

import { IRoot, HorizontalRoot, VerticalRoot, TRootConfig } from "../Root";
import { IViewHandler } from "../View";
import { ISlot } from "../Slot";
import { IScale } from "../Scale";

describe('Настройка корневого элемента', () => {
  // - подготовка
  class SlotStab implements ISlot {
    update(): void {}
    getElem(): HTMLDivElement { return }
  }
  class ScaleStab implements IScale {
    getElem(): HTMLDataListElement { return }
  }
  class HandlerStab implements IViewHandler {
    handleResize(): void {}
    handleSelectRange(): void {}
    handleSelectValue(): void {}
    handleSelectPerValue(): void {}
  }
  let 
    rootElem: HTMLElement, 
    slotStab: ISlot, 
    scaleStab: IScale, 
    handlerStab: IViewHandler,
    rootConfig: TRootConfig;
  describe('Горизонтальный вид', () => {
    it('Инстанс должен быть создан', () => {
      rootElem = document.createElement('div');
      slotStab = new SlotStab();
      handlerStab = new HandlerStab();
      // - действие
      const root: IRoot = new HorizontalRoot(rootElem, slotStab, handlerStab);
      // - проверка
      expect(root).toBeDefined();
    })
    describe('Отображение', () => {
      beforeEach(() => {
        rootElem = document.createElement('div');
        slotStab = new SlotStab();
        handlerStab = new HandlerStab();
        rootConfig = { className: 'my-slider' }
      })
      it('Корневой элемент должен иметь дефолтный класс', () => {
        const expectedClassName = 'my-jquery-slider';
        const root: IRoot = new HorizontalRoot(rootElem, slotStab, handlerStab);
        // - действие
        root.display();
        // - проверка
        expect(rootElem.className).toBe(expectedClassName);
      })
      it('Корневой элемент должен иметь класс заданный в оциях', () => {
        const { className: expectedClassName } = rootConfig;
        const root: IRoot = new HorizontalRoot(rootElem, slotStab, handlerStab, rootConfig);
        // - действие
        root.display();
        // - проверка
        expect(rootElem.className).toBe(expectedClassName);
      })
      it('Корневой элемент должен содеражть один элемент', () => {
        const expectedCount = 1;
        const root: IRoot = new HorizontalRoot(rootElem, slotStab, handlerStab);
        // - действие
        root.display();
        // - проверка
        expect(rootElem.childNodes.length).toBe(expectedCount);
      })
      it('Корневой элемент должен содержать два элемента, при добавлении шкалы', () => {
        const expectedCount = 2;
        const root: IRoot = new HorizontalRoot(rootElem, slotStab, handlerStab);
        root.setScale(new ScaleStab());
        // - действие
        root.display();
        // - проверка
        expect(rootElem.childNodes.length).toBe(expectedCount);
      })
      it('Стили ширины и минимальной ширины корневого элемента должны быть равны длине в опциях', () => {
        const expectedWidth = 123;
        const root: IRoot = new HorizontalRoot(
          rootElem, 
          slotStab, 
          handlerStab, 
          {...rootConfig, lengthPx: expectedWidth}
        );
        // - действие
        root.display();
        // - проверка
        expect(rootElem.style.width).toBe(`${expectedWidth}px`);
        expect(rootElem.style.minWidth).toBe(`${expectedWidth}px`);
      })
      it('Стили ширины и минимальной ширины корневого элемента должны быть равны 99px при меньшей длине в опциях', () => {
        const expectedWidth = 12;
        const root: IRoot = new HorizontalRoot(
          rootElem, 
          slotStab, 
          handlerStab, 
          {...rootConfig, lengthPx: expectedWidth}
        );
        // - действие
        root.display();
        // - проверка
        expect(rootElem.style.width).toBe('99px');
        expect(rootElem.style.minWidth).toBe('99px');
      })
      it('Корневой элемент должен иметь класс характеризующий отсутствие отступов, при обозначении отсутсвия отступов в опциях', () => {
        const root: IRoot = new HorizontalRoot(
          rootElem, 
          slotStab, 
          handlerStab, 
          {...rootConfig, indent: 'none'}
        );
        const expectedClass = `${rootConfig.className}_indent_none`;
        // - действие
        root.display();
        // - проверка
        expect(rootElem.classList.contains(expectedClass)).toBeTruthy();
      })
      it('Корневой элемент должен иметь класс характеризующий дополнительные отступы, при обозначении дополнительных отступов в опциях', () => {
        const root: IRoot = new HorizontalRoot(
          rootElem, 
          slotStab, 
          handlerStab, 
          {...rootConfig, indent: 'more'}
        );
        const expectedClass = `${rootConfig.className}_indent_add`;
        // - действие
        root.display();
        // - проверка
        expect(rootElem.classList.contains(expectedClass)).toBeTruthy();
      })
    })
    describe('Изменение размеров', () => {
      beforeEach(() => {
        rootElem = document.createElement('div');
        slotStab = new SlotStab();
        handlerStab = new HandlerStab();
        rootConfig = { className: 'my-slider' }
      })
      it('Расчет внутренней длины должен вычитать внутренние отступы', () => {
        const expectedWidth = 123;
        const testPadding = 40;
        rootElem.getBoundingClientRect = jest.fn().mockImplementation(() => ({width: expectedWidth}))
        rootElem.style.padding = `${testPadding}px`
        const root: IRoot = new HorizontalRoot(rootElem, slotStab, handlerStab);
        root.display();
        // - действие / проверка
        expect(root.calcContentLengthPx()).toBe(expectedWidth - 2*testPadding);
      })
      // it('При изменении размеров корневого элемента, объект должен вызвать соответсвующий обработчик во вью', () => {
      //   const spy = jest.spyOn(handlerStab, 'handleResize');
      //   rootElem.getBoundingClientRect = jest.fn().mockImplementation(() => ({width: Math.random()*10}))
      //   const root: IRoot = new HorizontalRoot(rootElem, slotStab, handlerStab);
      //   root.display();
      //   // - действие
      //   // - проверка
      //   expect(spy).toHaveBeenCalled();
      // })
    })
  })
})