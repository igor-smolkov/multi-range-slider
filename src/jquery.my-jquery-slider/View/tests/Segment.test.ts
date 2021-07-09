/**
 * @jest-environment jsdom
 */

import { Segment, ISegment } from "../Segment";

describe('Сегмент', () => {

  describe('Инициализация', () => {

    describe('Без параметров', () => {
      let segment: ISegment;
      beforeAll(() => {
        segment = new Segment();
      })

      test('Элемент создан', ()=>{
        expect(segment.getElem()).toBeDefined();
      });

      test('У элемента есть класс segment', ()=>{
        expect(segment.getElem().classList.contains('segment')).toBeTruthy();
      });

      test('У элемента есть класс segment_with-number', ()=>{
        expect(segment.getElem().classList.contains('segment_with-number')).toBeTruthy();
      });
    });

    describe('С параметрами', () => {
      let segment: ISegment;
      beforeAll(() => {
        segment = new Segment({
          className: 'block__segment',
          value: 1,
          label: 'яблоко',
          notch: 'long',
        });
      })

      test('Элемент создан', ()=>{
        expect(segment.getElem()).toBeDefined();
      });

      test('У элемента есть класс block__segment', ()=>{
        expect(segment.getElem().classList.contains('block__segment')).toBeTruthy();
      });

      test('У элемента есть класс block__segment_with-name', ()=>{
        expect(segment.getElem().classList.contains('block__segment_with-name')).toBeTruthy();
      });

      test('У элемента есть класс block__segment_long', ()=>{
        expect(segment.getElem().classList.contains('block__segment_long')).toBeTruthy();
      });
    });

    describe('С параметром notch: short', () => {
      let segment: ISegment;
      beforeAll(() => {
        segment = new Segment({
          className: 'block__segment',
          value: 1,
          label: 'яблоко',
          notch: 'short',
        });
      })

      test('У элемента есть класс block__segment_short', ()=>{
        expect(segment.getElem().classList.contains('block__segment_short')).toBeTruthy();
      });
    });
  });

  describe('Взаимодействие', () => {

    describe('Без параметров', () => {

      describe('Обработка клика', () => {
        let segment: ISegment, spy: jest.SpyInstance;
        beforeAll(() => {
          segment = new Segment();
          spy = jest.spyOn(segment.getElem(), 'dispatchEvent');
          segment.getElem().dispatchEvent(new Event('click'));
        })

        test('Один клик обработан один раз', ()=>{
          expect(spy).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('С параметрами', () => {

      describe('Обработка клика', () => {
        let segment: ISegment, callback: (value: number) => void, spy: jest.SpyInstance;
        beforeAll(() => {
          callback = jest.fn();
          segment = new Segment({
            className: 'block__segment',
            value: 4,
            label: 'яблоко',
            notch: 'short',
            onClick: callback,
          });
          spy = jest.spyOn(segment.getElem(), 'dispatchEvent');
          segment.getElem().dispatchEvent(new Event('click'));
        })
  
        test('Один клик обработан один раз', ()=>{
          expect(spy).toHaveBeenCalledTimes(1);
        });
  
        test('Вызван внешний обработчик со значением 4', ()=>{
          expect(callback).toHaveBeenCalledTimes(1);
          expect(callback).toHaveBeenCalledWith(4);
        });
      });
    });
  });

  describe('Методы', () => {

    describe('Установить коэффициент роста', () => {
      let segment: ISegment;
      beforeAll(() => {
        segment = new Segment();
      })

      test('Устанавливаем 5, flex-grow элемента должен быть "5"', ()=>{
        segment.setGrow(5);
        expect(segment.getElem().style.flexGrow).toBe('5');
      });
    });

    describe('Пометить как последний', () => {
      let segment: ISegment;
      beforeAll(() => {
        segment = new Segment();
      })

      test('У элемента нет класса segment_last', ()=>{
        expect(segment.getElem().classList.contains('segment_last')).toBeFalsy();
      });

      test('Помечаем сегмент как последний, у элемента есть класс segment_last', ()=>{
        segment.markAsLast();
        expect(segment.getElem().classList.contains('segment_last')).toBeTruthy();
      });

      test('Снимаем отметку сегмента как последнего, у элемента нет класса segment_last', ()=>{
        segment.unmarkAsLast();
        expect(segment.getElem().classList.contains('segment_last')).toBeFalsy();
      });
    });
  });
});