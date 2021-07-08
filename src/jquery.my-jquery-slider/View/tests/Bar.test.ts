/**
 * @jest-environment jsdom
 */

import { Bar, TBar, IBar } from "../Bar";
import { View, IViewHandler, TView } from "../View";

const viewOptions: TView = {
  root: document.createElement('div'),
  perValues: [],
}

describe('Бар', () => {

  describe('Инициализация', () => {

    describe('Без параметров', () => {
      let bar: IBar;
      beforeAll(() => {
        bar = new Bar();
      })

      test('Элемент создан', ()=>{
        expect(bar.getElem()).toBeDefined();
      });

      test('У элемента есть класс bar', ()=>{
        expect(bar.getElem().classList.contains('bar')).toBeTruthy();
      });
    });

    describe('C параметрами', () => {
      let bar: IBar;
      beforeAll(() => {
        bar = new Bar({
          viewHandler: new View(viewOptions),
          id: 0,
          className: 'block__bar',
          length: 200,
          isActive: true,
          isActual: false,
          isEven: true,
          isVertical: true,
        });
      });

      test('Элемент создан', ()=>{
        expect(bar.getElem()).toBeDefined();
      });

      test('У элемента есть класс block__bar', ()=>{
        expect(bar.getElem().classList.contains('block__bar')).toBeTruthy();
      });
    });

    describe('Cо всеми модификаторами', () => {
      let bar: IBar;
      beforeAll(() => {
        bar = new Bar({
          viewHandler: new View(viewOptions),
          id: 0,
          className: 'block__bar',
          length: 200,
          isActive: true,
          isActual: true,
          isEven: true,
          isVertical: true,
        });
      })

      test('У элемента есть класс block__bar_active', ()=>{
        expect(bar.getElem().classList.contains('block__bar_active')).toBeTruthy();
      });

      test('У элемента есть класс block__bar_actual', ()=>{
        expect(bar.getElem().classList.contains('block__bar_actual')).toBeTruthy();
      });

      test('У элемента есть класс block__bar_even', ()=>{
        expect(bar.getElem().classList.contains('block__bar_even')).toBeTruthy();
      });

      test('У элемента есть класс block__bar_vertical', ()=>{
        expect(bar.getElem().classList.contains('block__bar_vertical')).toBeTruthy();
      });
    });
  });

  describe('Взаимодействие', () => {

    describe('Без параметров', () => {

      describe('Обработка нажатия указателя', () => {
        let bar: IBar, spy: jest.SpyInstance;
        beforeAll(() => {
          bar = new Bar();
          spy = jest.spyOn(bar.getElem(), 'dispatchEvent');
          bar.getElem().dispatchEvent(new Event('pointerdown'));
        })

        test('Одно нажатие обработано один раз', ()=>{
          expect(spy).toHaveBeenCalledTimes(1);
        });

        test('Объект в состоянии "в процессе обработки"', ()=>{
          expect(bar.isProcessed()).toBeFalsy();
        });
      });
    });
  });

  describe('С параметрами', () => {

    describe('Обработка нажатия указателя', () => {
      let bar: IBar, viewHandler: IViewHandler, spy: jest.SpyInstance;
      beforeAll(() => {
        viewHandler = new View(viewOptions);
        viewHandler.handleBarProcessed = jest.fn();
        bar = new Bar({
          viewHandler: viewHandler,
          id: 0,
          className: 'block__bar',
          length: 200,
          isActive: true,
          isActual: false,
          isEven: true,
          isVertical: true,
        });
        spy = jest.spyOn(bar.getElem(), 'dispatchEvent');
        bar.getElem().dispatchEvent(new Event('pointerdown'));
      })

      test('Одно нажатие обработано один раз', ()=>{
        expect(spy).toHaveBeenCalledTimes(1);
      });
      
      test('Объект в состоянии "в процессе обработки"', ()=>{
        expect(bar.isProcessed()).toBeFalsy();
      });

      test('Вызван обработчик вью', ()=>{
        expect(viewHandler.handleBarProcessed).toHaveBeenCalledTimes(1);
      });
    });
  });
});