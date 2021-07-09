/**
 * @jest-environment jsdom
 */

import { Slot, ISlot } from "../Slot";
import { Bar } from "../Bar";

describe('Слот', () => {

  describe('Инициализация', () => {

    describe('Без параметров', () => {
      let slot: ISlot;
      beforeAll(() => {
        slot = new Slot();
      })

      test('Элемент создан', ()=>{
        expect(slot.getElem()).toBeDefined();
      });

      test('У элемента есть класс slot', ()=>{
        expect(slot.getElem().classList.contains('slot')).toBeTruthy();
      });

      test('Внутри слота должен быть бар', ()=>{
        expect(slot.getElem().querySelector('.bar')).toBeTruthy();
      });
    });
  });

  describe('C параметрами', () => {
    let slot: ISlot;
    beforeAll(() => {
      slot = new Slot({
        bars: [new Bar(), new Bar()],
        className: 'block__slot',
        isVertical: true,
        withIndent: false,
      });
    });

    test('Элемент создан', ()=>{
      expect(slot.getElem()).toBeDefined();
    });

    test('У элемента есть класс block__slot', ()=>{
      expect(slot.getElem().classList.contains('block__slot')).toBeTruthy();
    });

    test('Внутри слота должено быть два бара', ()=>{
      expect(slot.getElem().querySelectorAll('.bar').length).toBe(2);
    });

    test('У элемента есть класс block__slot_vertical', ()=>{
      expect(slot.getElem().classList.contains('block__slot_vertical')).toBeTruthy();
    });

    test('У элемента нет внешних отступов', ()=>{
      expect(slot.getElem().style.margin).toBe('0px');
    });
  });

  describe('Взаимодействие', () => {

    describe('Без параметров', () => {

      describe('Обработка нажатия указателя', () => {
        let slot: ISlot, spy: jest.SpyInstance;
        beforeAll(() => {
          slot = new Slot();
          spy = jest.spyOn(slot.getElem(), 'dispatchEvent');
          slot.getElem().dispatchEvent(new Event('pointerdown'));
        })

        test('Одно нажатие обработано один раз', ()=>{
          expect(spy).toHaveBeenCalledTimes(1);
        });

        test('Объект в состоянии "в процессе обработки"', ()=>{
          expect(slot.isProcessed()).toBeFalsy();
        });
      });
    });
  });

  describe('С параметрами', () => {

    describe('Обработка нажатия указателя', () => {
      let slot: ISlot, callback: (clientCoord: number) => void, spy: jest.SpyInstance;
      beforeAll(() => {
        callback = jest.fn();
        slot = new Slot({
          bars: [new Bar(), new Bar()],
          className: 'block__slot',
          isVertical: true,
          withIndent: false,
          onProcess: callback,
        });
        spy = jest.spyOn(slot.getElem(), 'dispatchEvent');
        slot.getElem().dispatchEvent(new Event('pointerdown'));
      })

      test('Одно нажатие обработано один раз', ()=>{
        expect(spy).toHaveBeenCalledTimes(1);
      });
      
      test('Объект в состоянии "в процессе обработки"', ()=>{
        expect(slot.isProcessed()).toBeFalsy();
      });

      test('Вызван обработчик процесса', ()=>{
        expect(callback).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Методы', () => {

    describe('Активация', () => {
      let slot: ISlot;
      beforeAll(() => {
        slot = new Slot();
      })

      test('Объект в состоянии "обработан" - по-умолчанию', ()=>{
        expect(slot.isProcessed()).toBeTruthy();
      });

      test('Объект в состоянии "в процессе обработки"', ()=>{
        slot.activate();
        expect(slot.isProcessed()).toBeFalsy();
      });
    });

    describe('Деактивация', () => {
      let slot: ISlot;
      beforeAll(() => {
        slot = new Slot();
      })

      test('Объект в состоянии "в процессе обработки"', ()=>{
        slot.activate();
        expect(slot.isProcessed()).toBeFalsy();
      });

      test('Объект в состоянии "обработан"', ()=>{
        slot.release();
        expect(slot.isProcessed()).toBeTruthy();
      });
    });
  });
});