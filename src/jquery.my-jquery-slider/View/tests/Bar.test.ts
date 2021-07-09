/**
 * @jest-environment jsdom
 */

import { Bar, TBar, IBar } from "../Bar";
import { Thumb, IThumb } from "../Thumb";

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

      test('Внутри бара должен быть палец', ()=>{
        expect(bar.getElem().querySelector('.thumb')).toBeTruthy();
      });
    });

    describe('C параметрами', () => {
      let bar: IBar, thumb: IThumb;
      beforeAll(() => {
        thumb = new Thumb();
        bar = new Bar({
          thumb,
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

      test('Внутри бара должен быть палец', ()=>{
        expect(bar.getElem().querySelector('.thumb')).toEqual(thumb.getElem());
      });
    });

    describe('Cо всеми модификаторами', () => {
      let bar: IBar;
      beforeAll(() => {
        bar = new Bar({
          thumb: new Thumb(),
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
      let bar: IBar, callback: (clientCoord: number, id: number) => void, spy: jest.SpyInstance;
      beforeAll(() => {
        callback = jest.fn();
        bar = new Bar({
          thumb: new Thumb(),
          id: 0,
          className: 'block__bar',
          length: 200,
          isActive: true,
          isActual: false,
          isEven: true,
          isVertical: true,
          onProcess: callback,
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

      test('Вызван обработчик процесса', ()=>{
        expect(callback).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Методы', () => {

    describe('Активация', () => {
      let bar: IBar;
      beforeAll(() => {
        bar = new Bar();
      })

      test('Объект в состоянии "обработан" - по-умолчанию', ()=>{
        expect(bar.isProcessed()).toBeTruthy();
      });

      test('Объект в состоянии "в процессе обработки"', ()=>{
        bar.activate();
        expect(bar.isProcessed()).toBeFalsy();
      });
    });

    describe('Деактивация', () => {
      let bar: IBar;
      beforeAll(() => {
        bar = new Bar();
      })

      test('Объект в состоянии "в процессе обработки"', ()=>{
        bar.activate();
        expect(bar.isProcessed()).toBeFalsy();
      });

      test('Объект в состоянии "обработан"', ()=>{
        bar.release();
        expect(bar.isProcessed()).toBeTruthy();
      });
    });

    describe('Отображение активного состояния актуального бара (по-умолчанию)', () => {
      let bar: IBar;
      beforeAll(() => {
        bar = new Bar();
      })

      test('У элемента нет класса bar_active', ()=>{
        expect(bar.getElem().classList.contains('bar_active')).toBeFalsy();
      });

      test('У элемента есть класс bar_active', ()=>{
        bar.activate();
        expect(bar.getElem().classList.contains('bar_active')).toBeTruthy();
      });

      test('У элемента нет класса bar_active', ()=>{
        bar.release();
        expect(bar.getElem().classList.contains('bar_active')).toBeFalsy();
      });
    });

    describe('Отображение активного состояния неактуального бара', () => {
      let bar: IBar;
      beforeAll(() => {
        bar = new Bar({
          thumb: new Thumb(),
          id: 0,
          className: 'bar',
          length: 200,
          isActive: false,
          isActual: false,
          isEven: false,
          isVertical: false,
        });
      })

      test('У элемента нет класса bar_active', ()=>{
        expect(bar.getElem().classList.contains('bar_active')).toBeFalsy();
      });

      test('У элемента нет класса bar_active', ()=>{
        bar.activate();
        expect(bar.getElem().classList.contains('bar_active')).toBeFalsy();
      });

      test('У элемента нет класса bar_active', ()=>{
        bar.release();
        expect(bar.getElem().classList.contains('bar_active')).toBeFalsy();
      });
    });

    describe('Установка длины бара', () => {

      test('Устанавливаем длину горизонтального (по-умолчанию) бара в 60%, width элемента должен быть 60%', ()=>{
        let bar = new Bar();
        bar.setLengthPer(60);
        expect(bar.getElem().style.width).toBe('60%');
      });

      test('Устанавливаем длину вертикального бара в 40%, height элемента должен быть 40%', ()=>{
        let bar = new Bar({
          thumb: new Thumb(),
          id: 0,
          className: 'bar',
          length: 200,
          isActive: false,
          isActual: false,
          isEven: false,
          isVertical: true,
        });
        bar.setLengthPer(40);
        expect(bar.getElem().style.height).toBe('40%');
      });
    });

    describe('Установка отступа бара', () => {

      test('Устанавливаем отступ горизонтального (по-умолчанию) бара в 60%, left элемента должен быть 60%', ()=>{
        let bar = new Bar();
        bar.setIndentPer(60);
        expect(bar.getElem().style.left).toBe('60%');
      });

      test('Устанавливаем длину вертикального бара в 40%, top элемента должен быть 40%', ()=>{
        let bar = new Bar({
          thumb: new Thumb(),
          id: 0,
          className: 'bar',
          length: 200,
          isActive: false,
          isActual: false,
          isEven: false,
          isVertical: true,
        });
        bar.setIndentPer(40);
        expect(bar.getElem().style.top).toBe('40%');
      });
    });
  });
});