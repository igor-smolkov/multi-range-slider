/**
 * @jest-environment jsdom
 */

import { Thumb, IThumb } from "../Thumb";
import { View, IViewHandler, TView } from "../View";

const viewOptions: TView = {
  root: document.createElement('div'),
  perValues: [],
}

describe('Палец', () => {

  describe('Инициализация', () => {

    describe('Без параметров', () => {
      let thumb: IThumb;
      beforeAll(() => {
        thumb = new Thumb();
      })

      test('Элемент создан', ()=>{
        expect(thumb.getElem()).toBeDefined();
      });

      test('Класс элемента - thumb', ()=>{
        expect(thumb.getElem().className).toBe('thumb');
      });
    });
    describe('C параметрами', () => {
      let thumb: IThumb;
      beforeAll(() => {
        thumb = new Thumb({
          viewHandler: new View(viewOptions),
          id: 0,
          className: 'block__thumb',
        });
      })

      test('Элемент создан', ()=>{
        expect(thumb.getElem()).toBeDefined();
      });

      test('Класс элемента - block__thumb', ()=>{
        expect(thumb.getElem().className).toBe('block__thumb');
      });
    });
  });
  describe('Взаимодействие', () => {

    describe('Без параметров', () => {

      describe('Обработка клика', () => {
        let thumb: IThumb, spy: jest.SpyInstance;
        beforeAll(() => {
          thumb = new Thumb();
          spy = jest.spyOn(thumb.getElem(), 'dispatchEvent');
          thumb.getElem().dispatchEvent(new Event('click'));
        })

        test('Один клик обработан один раз', ()=>{
          expect(spy).toHaveBeenCalledTimes(1);
        });

        test('Объект в состоянии "обработан" - по-умолчанию', ()=>{
          expect(thumb.isProcessed()).toBeTruthy();
        });
      });

      describe('Обработка нажатия указателя', () => {
        let thumb: IThumb, spy: jest.SpyInstance;
        beforeAll(() => {
          thumb = new Thumb();
          spy = jest.spyOn(thumb.getElem(), 'dispatchEvent');
          thumb.getElem().dispatchEvent(new Event('pointerdown'));
        })

        test('Одно нажатие обработано один раз', ()=>{
          expect(spy).toHaveBeenCalledTimes(1);
        });

        test('Объект в состоянии "в процессе обработки"', ()=>{
          expect(thumb.isProcessed()).toBeFalsy();
        });
      });
    });

    describe('С параметрами', () => {

      describe('Обработка клика', () => {
        let thumb: IThumb, spy: jest.SpyInstance;
        beforeAll(() => {
          thumb = new Thumb({
            viewHandler: new View(viewOptions),
            id: 0,
            className: 'block__thumb',
          });
          spy = jest.spyOn(thumb.getElem(), 'dispatchEvent');
          thumb.getElem().dispatchEvent(new Event('click'));
        })

        test('Один клик обработан один раз', ()=>{
          expect(spy).toHaveBeenCalledTimes(1);
        });

        test('Объект в состоянии "обработан" - по-умолчанию', ()=>{
          expect(thumb.isProcessed()).toBeTruthy();
        });
      });

      describe('Обработка нажатия указателя', () => {
        let thumb: IThumb, viewHandler: IViewHandler, spy: jest.SpyInstance;
        beforeAll(() => {
          viewHandler = new View(viewOptions);
          viewHandler.handleThumbProcessed = jest.fn();
          thumb = new Thumb({
            viewHandler: viewHandler,
            id: 0,
            className: 'block__thumb',
          });
          spy = jest.spyOn(thumb.getElem(), 'dispatchEvent');
          thumb.getElem().dispatchEvent(new Event('pointerdown'));
        })

        test('Одно нажатие обработано один раз', ()=>{
          expect(spy).toHaveBeenCalledTimes(1);
        });
        
        test('Объект в состоянии "в процессе обработки"', ()=>{
          expect(thumb.isProcessed()).toBeFalsy();
        });

        test('Вызван обработчик вью с параметром равным 0', ()=>{
          expect(viewHandler.handleThumbProcessed).toHaveBeenCalledTimes(1);
          expect(viewHandler.handleThumbProcessed).toHaveBeenCalledWith(0);
        });
      });
    });
  });

  describe('Методы', () => {

    describe('Активация', () => {
      let thumb: IThumb;
      beforeAll(() => {
        thumb = new Thumb();
      })

      test('Объект в состоянии "обработан" - по-умолчанию', ()=>{
        expect(thumb.isProcessed()).toBeTruthy();
      });

      test('Объект в состоянии "в процессе обработки"', ()=>{
        thumb.activate();
        expect(thumb.isProcessed()).toBeFalsy();
      });
    });

    describe('Деактивация', () => {
      let thumb: IThumb;
      beforeAll(() => {
        thumb = new Thumb();
      })

      test('Объект в состоянии "в процессе обработки"', ()=>{
        thumb.activate();
        expect(thumb.isProcessed()).toBeFalsy();
      });

      test('Объект в состоянии "обработан"', ()=>{
        thumb.release();
        expect(thumb.isProcessed()).toBeTruthy();
      });
    });
  });
});