import { Range, TRange } from "../Range";

describe('Диапазон', ()=>{
  describe('Инициализация', ()=>{
    describe('Без параметров - значения по-умолчанию', ()=>{
      let range: Range;
      beforeAll(()=>{
        range = new Range();
      });
      test('Минимальное значение должно быть 0', ()=>{
        expect(range.getMin()).toBe(0);
      });
      test('Максимальное значение должно быть 100', ()=>{
        expect(range.getMax()).toBe(100);
      });
      test('Текущее значение должно быть 50', ()=>{
        expect(range.getCurrent()).toBe(50);
      });
    });
    describe('min: 10, max: 20 - минимальный набор параметров', ()=>{
      let config: TRange, configCopy: TRange, range: Range;
      beforeAll(()=>{
        config = {
          min: 10,
          max: 20,
        }
        configCopy = Object.assign({}, config);
        range = new Range(config);
      });
      test ('Класс не изменяет объект переданный в параметрах', () => {
        expect(config).toEqual(configCopy);
      })
      test('Минимальное значение должно быть 10', ()=>{
        expect(range.getMin()).toBe(10);
      });
      test('Максимальное значение должно быть 20', ()=>{
        expect(range.getMax()).toBe(20);
      });
      test('Текущее значение должно равняться максимальному', ()=>{
        expect(range.getCurrent()).toBe(range.getMax());
      });
    });
    describe('min: 20, max: 10 - исправление некорректного диапазона', ()=>{
      let config: TRange, configCopy: TRange, range: Range;
      beforeAll(()=>{
        config = {
          min: 20,
          max: 10,
        }
        configCopy = Object.assign({}, config);
        range = new Range(config);
      });
      test ('Класс не изменяет объект переданный в параметрах', () => {
        expect(config).toEqual(configCopy);
      })
      test('Все значения должны быть равны', ()=>{
        expect(range.getMin()).toBe(range.getMax());
        expect(range.getCurrent()).toBe(range.getMax());
      });
      test('Значение должно быть 10', ()=>{
        expect(range.getMax()).toBe(10);
      });
    });
    describe('min: 10, max: 10 - одинаковые значения', ()=>{
      let config: TRange, configCopy: TRange, range: Range;
      beforeAll(()=>{
        config = {
          min: 10,
          max: 10,
        }
        configCopy = Object.assign({}, config);
        range = new Range(config);
      });
      test ('Класс не изменяет объект переданный в параметрах', () => {
        expect(config).toEqual(configCopy);
      })
      test('Все значения должны быть равны', ()=>{
        expect(range.getMin()).toBe(range.getMax());
        expect(range.getCurrent()).toBe(range.getMax());
      });
      test('Значение должно быть 10', ()=>{
        expect(range.getMax()).toBe(10);
      });
    });
    describe('min: -10, max: -20 - отрицательный и некорректный диапазон', ()=>{
      let config: TRange, configCopy: TRange, range: Range;
      beforeAll(()=>{
        config = {
          min: -10,
          max: -20,
        }
        configCopy = Object.assign({}, config);
        range = new Range(config);
      });
      test ('Класс не изменяет объект переданный в параметрах', () => {
        expect(config).toEqual(configCopy);
      })
      test('Все значения должны быть равны', ()=>{
        expect(range.getMin()).toBe(range.getMax());
        expect(range.getCurrent()).toBe(range.getMax());
      });
      test('Значение должно быть -20', ()=>{
        expect(range.getMax()).toBe(-20);
      });
    });
    describe('min: -10.5, max: 20.001 - числа с плавающей запятой и диапазон проходящий через ноль', ()=>{
      let config: TRange, configCopy: TRange, range: Range;
      beforeAll(()=>{
        config = {
          min: -10.5,
          max: 20.001,
        }
        configCopy = Object.assign({}, config);
        range = new Range(config);
      });
      test ('Класс не изменяет объект переданный в параметрах', () => {
        expect(config).toEqual(configCopy);
      })
      test('Минимальное значение должно быть -10.5', ()=>{
        expect(range.getMin()).toBe(-10.5);
      });
      test('Максимальное значение должно быть 20.001', ()=>{
        expect(range.getMax()).toBe(20.001);
      });
      test('Текущее значение должно равняться максимальному', ()=>{
        expect(range.getCurrent()).toBe(range.getMax());
      });
    });
    describe('min: 10, max: 20, current: 12 - максимальный набор параметров', ()=>{
      let config: TRange, configCopy: TRange, range: Range;
      beforeAll(()=>{
        config = {
          min: 10,
          max: 20,
          current: 12,
        }
        configCopy = Object.assign({}, config);
        range = new Range(config);
      });
      test ('Класс не изменяет объект переданный в параметрах', () => {
        expect(config).toEqual(configCopy);
      })
      test('Минимальное значение должно быть 10', ()=>{
        expect(range.getMin()).toBe(10);
      });
      test('Максимальное значение должно быть 20', ()=>{
        expect(range.getMax()).toBe(20);
      });
      test('Текущее значение должно быть 12', ()=>{
        expect(range.getCurrent()).toBe(12);
      });
    });
    describe('min: 10, max: 20, current: 33 - текущее значение больше максимального', ()=>{
      let config: TRange, configCopy: TRange, range: Range;
      beforeAll(()=>{
        config = {
          min: 10,
          max: 20,
          current: 33,
        }
        configCopy = Object.assign({}, config);
        range = new Range(config);
      });
      test ('Класс не изменяет объект переданный в параметрах', () => {
        expect(config).toEqual(configCopy);
      })
      test('Минимальное значение должно быть 10', ()=>{
        expect(range.getMin()).toBe(10);
      });
      test('Максимальное значение должно быть 20', ()=>{
        expect(range.getMax()).toBe(20);
      });
      test('Текущее значение должно равняться максимальному', ()=>{
        expect(range.getCurrent()).toBe(range.getMax());
      });
    });
    describe('min: 10, max: 20, current: 5 - текущее значение меньше минимального', ()=>{
      let config: TRange, configCopy: TRange, range: Range;
      beforeAll(()=>{
        config = {
          min: 10,
          max: 20,
          current: 5,
        }
        configCopy = Object.assign({}, config);
        range = new Range(config);
      });
      test ('Класс не изменяет объект переданный в параметрах', () => {
        expect(config).toEqual(configCopy);
      })
      test('Минимальное значение должно быть 10', ()=>{
        expect(range.getMin()).toBe(10);
      });
      test('Максимальное значение должно быть 20', ()=>{
        expect(range.getMax()).toBe(20);
      });
      test('Текущее значение должно равняться минимальному', ()=>{
        expect(range.getCurrent()).toBe(range.getMin());
      });
    });
    describe('min: -20.001, max: -10.5, current: -18.3 - отрицательные числа с плавающей точкой', ()=>{
      let config: TRange, configCopy: TRange, range: Range;
      beforeAll(()=>{
        config = {
          min: -20.001,
          max: -10.5,
          current: -18.3,
        }
        configCopy = Object.assign({}, config);
        range = new Range(config);
      });
      test ('Класс не изменяет объект переданный в параметрах', () => {
        expect(config).toEqual(configCopy);
      })
      test('Минимальное значение должно быть -20.001', ()=>{
        expect(range.getMin()).toBe(-20.001);
      });
      test('Максимальное значение должно быть -10.5', ()=>{
        expect(range.getMax()).toBe(-10.5);
      });
      test('Текущее значение должно быть -18.3', ()=>{
        expect(range.getCurrent()).toBe(-18.3);
      });
    });
    describe('min: -20, max: 10, current: 0 - текущее значение в нуле', ()=>{
      let config: TRange, configCopy: TRange, range: Range;
      beforeAll(()=>{
        config = {
          min: -20,
          max: 10,
          current: 0,
        }
        configCopy = Object.assign({}, config);
        range = new Range(config);
      });
      test ('Класс не изменяет объект переданный в параметрах', () => {
        expect(config).toEqual(configCopy);
      })
      test('Минимальное значение должно быть -20', ()=>{
        expect(range.getMin()).toBe(-20);
      });
      test('Максимальное значение должно быть 10', ()=>{
        expect(range.getMax()).toBe(10);
      });
      test('Текущее значение должно быть 0', ()=>{
        expect(range.getCurrent()).toBe(0);
      });
    });
    describe('min: 0, max: 0, current: 0 - все значения в нуле', () => {
      let config: TRange, configCopy: TRange, range: Range;
      beforeAll(()=>{
        config = {
          min: 0,
          max: 0,
          current: 0,
        }
        configCopy = Object.assign({}, config);
        range = new Range(config);
      });
      test('Класс не изменяет объект переданный в параметрах', () => {
        expect(config).toEqual(configCopy);
      })
      test('Все значения должны быть равны', () => {
        expect(range.getMin()).toBe(range.getMax());
        expect(range.getCurrent()).toBe(range.getMax());
      });
      test('Значение должно быть 0', () => {
        expect(range.getMax()).toBe(0);
      });
    });
  });
  describe('Установка значений', () => {
    describe('Установка минимальной границы дипазона равной 30, больше установленной по-умолчанию', () => {
      let range: Range;
      beforeAll(()=>{
        range = new Range();
        range.setMin(30);
      });
      test('Минимальное значение должно быть 30', ()=>{
        expect(range.getMin()).toBe(30);
      });
      test('Максимальное значение должно быть 100', ()=>{
        expect(range.getMax()).toBe(100);
      });
      test('Текущее значение должно быть 50', ()=>{
        expect(range.getCurrent()).toBe(50);
      });
    });
    describe('Установка минимальной границы дипазона равной -30, меньше установленной по-умолчанию', () => {
      let range: Range;
      beforeAll(()=>{
        range = new Range();
        range.setMin(-30);
      });
      test('Минимальное значение должно быть -30', ()=>{
        expect(range.getMin()).toBe(-30);
      });
      test('Максимальное значение должно быть 100', ()=>{
        expect(range.getMax()).toBe(100);
      });
      test('Текущее значение должно быть 50', ()=>{
        expect(range.getCurrent()).toBe(50);
      });
    });
    describe('Установка минимальной границы дипазона равной 70, больше текущего значения по-умолчанию', () => {
      let range: Range;
      beforeAll(()=>{
        range = new Range();
        range.setMin(70);
      });
      test('Минимальное значение должно быть 70', ()=>{
        expect(range.getMin()).toBe(70);
      });
      test('Максимальное значение должно быть 100', ()=>{
        expect(range.getMax()).toBe(100);
      });
      test('Текущее значение должно быть равно минимальному', ()=>{
        expect(range.getCurrent()).toBe(range.getMin());
      });
    });
    describe('Установка минимальной границы дипазона равной 170, больше максимальной по-умолчанию', () => {
      let range: Range;
      beforeAll(()=>{
        range = new Range();
        range.setMin(170);
      });
      test('Минимальное значение остается 0', ()=>{
        expect(range.getMin()).toBe(0);
      });
      test('Максимальное значение остается 100', ()=>{
        expect(range.getMax()).toBe(100);
      });
      test('Текущее значение остается 50', ()=>{
        expect(range.getCurrent()).toBe(50);
      });
    });
    describe('Установка максимальной границы дипазона равной 70, меньше установленной по-умолчанию', () => {
      let range: Range;
      beforeAll(()=>{
        range = new Range();
        range.setMax(70);
      });
      test('Минимальное значение должно быть 0', ()=>{
        expect(range.getMin()).toBe(0);
      });
      test('Максимальное значение должно быть 70', ()=>{
        expect(range.getMax()).toBe(70);
      });
      test('Текущее значение должно быть 50', ()=>{
        expect(range.getCurrent()).toBe(50);
      });
    });
    describe('Установка максимальной границы дипазона равной 170, больше установленной по-умолчанию', () => {
      let range: Range;
      beforeAll(()=>{
        range = new Range();
        range.setMax(170);
      });
      test('Минимальное значение должно быть 0', ()=>{
        expect(range.getMin()).toBe(0);
      });
      test('Максимальное значение должно быть 170', ()=>{
        expect(range.getMax()).toBe(170);
      });
      test('Текущее значение должно быть 50', ()=>{
        expect(range.getCurrent()).toBe(50);
      });
    });
    describe('Установка максимальной границы дипазона равной 30, меньше текущего значения по-умолчанию', () => {
      let range: Range;
      beforeAll(()=>{
        range = new Range();
        range.setMax(30);
      });
      test('Минимальное значение должно быть 0', ()=>{
        expect(range.getMin()).toBe(0);
      });
      test('Максимальное значение должно быть 30', ()=>{
        expect(range.getMax()).toBe(30);
      });
      test('Текущее значение должно быть равно максимальному', ()=>{
        expect(range.getCurrent()).toBe(range.getMax());
      });
    });
    describe('Установка максимальной границы дипазона равной -30, меньше минимальной по-умолчанию', () => {
      let range: Range;
      beforeAll(()=>{
        range = new Range();
        range.setMax(-30);
      });
      test('Минимальное значение остается 0', ()=>{
        expect(range.getMin()).toBe(0);
      });
      test('Максимальное значение остается 100', ()=>{
        expect(range.getMax()).toBe(100);
      });
      test('Текущее значение остается 50', ()=>{
        expect(range.getCurrent()).toBe(50);
      });
    });
    describe('Установка текущего значения равным 60, больше установленного по-умолчанию', () => {
      let range: Range;
      beforeAll(()=>{
        range = new Range();
        range.setCurrent(60);
      });
      test('Минимальное значение должно быть 0', ()=>{
        expect(range.getMin()).toBe(0);
      });
      test('Максимальное значение должно быть 100', ()=>{
        expect(range.getMax()).toBe(100);
      });
      test('Текущее значение должно быть 60', ()=>{
        expect(range.getCurrent()).toBe(60);
      });
    });
    describe('Установка текущего значения больше максимального и равным 160, больше максимального по-умолчанию', () => {
      let range: Range;
      beforeAll(()=>{
        range = new Range();
        range.setCurrent(160);
      });
      test('Минимальное значение должно быть 0', ()=>{
        expect(range.getMin()).toBe(0);
      });
      test('Максимальное значение должно быть 100', ()=>{
        expect(range.getMax()).toBe(100);
      });
      test('Текущее значение должно быть равно максимальному', ()=>{
        expect(range.getCurrent()).toBe(range.getMax());
      });
    });
    describe('Установка текущего значения меньше минимального и равным -160, меньше минимального по-умолчанию', () => {
      let range: Range;
      beforeAll(()=>{
        range = new Range();
        range.setCurrent(-160);
      });
      test('Минимальное значение должно быть 0', ()=>{
        expect(range.getMin()).toBe(0);
      });
      test('Максимальное значение должно быть 100', ()=>{
        expect(range.getMax()).toBe(100);
      });
      test('Текущее значение должно быть равно минимальному', ()=>{
        expect(range.getCurrent()).toBe(range.getMin());
      });
    });
    describe('Установка текущего значения равным -16.4 для {min: -30.3333, max: 90.1}', () => {
      let range: Range;
      beforeAll(()=>{
        range = new Range({
          min: -30.3333,
          max: 90.1,
        });
        range.setCurrent(-16.4);
      });
      test('Минимальное значение должно быть -30.3333', ()=>{
        expect(range.getMin()).toBe(-30.3333);
      });
      test('Максимальное значение должно быть 90.1', ()=>{
        expect(range.getMax()).toBe(90.1);
      });
      test('Текущее значение должно быть -16.4', ()=>{
        expect(range.getCurrent()).toBe(-16.4);
      });
    });
    describe('Установка минимальной границы диапазона равным -6 для {min: 0, max: 0}', () => {
      let range: Range;
      beforeAll(()=>{
        range = new Range({
          min: 0,
          max: 0,
        });
        range.setMin(-6);
      });
      test('Минимальное значение должно быть -6', ()=>{
        expect(range.getMin()).toBe(-6);
      });
      test('Максимальное значение должно быть 0', ()=>{
        expect(range.getMax()).toBe(0);
      });
      test('Текущее значение должно быть равно максимальному', ()=>{
        expect(range.getCurrent()).toBe(range.getMax());
      });
    });
  });
});