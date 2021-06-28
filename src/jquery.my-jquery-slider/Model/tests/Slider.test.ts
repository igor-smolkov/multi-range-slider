import { Range, IRange } from "../Range";
import { Slider, ISlider, TSlider } from "../Slider";

describe('Слайдер', ()=>{ 
  describe('Инициализация', ()=>{

    describe('Без параметров - значение по-умолчанию', ()=>{
      let slider: ISlider, range: IRange;
      beforeAll(()=>{
        range = new Range();
        slider = new Slider();
      });
      test('Значение слайдера равно текущему значению диапазона по-умолчанию', ()=>{
        expect(slider.getValue()).toEqual(range.getCurrent());
      });
      test('Абсолютный максимум равен максимальной границе диапазона по-умолчанию', ()=>{
        expect(slider.getMax()).toEqual(range.getMax());
      });
      test('Абсолютный минимум равен минимальной границе диапазона по-умолчанию', ()=>{
        expect(slider.getMin()).toEqual(range.getMin());
      });
      test('Активный диапазон - единственный, с индексом 0', ()=>{
        expect(slider.getActive()).toBe(0);
      });
      test('Шаг равен 1', ()=>{
        expect(slider.getStep()).toBe(1);
      });
      test('В массиве актуальных диапазонов - единственный индекс: 0', ()=>{
        expect(slider.getActuals()).toEqual([0]);
      });
    });

    describe('C параметрами', ()=>{
      let config: TSlider, configCopy: TSlider, slider: ISlider;
      beforeAll(()=>{
        config = {
          ranges: [new Range(), new Range(), new Range()],
          active: 1,
          step: 15,
          actuals: [0, 2],
        }
        configCopy = Object.assign({}, config);
        slider = new Slider(config);
      });
      test ('Класс не изменяет объект переданный в параметрах', () => {
        expect(config).toEqual(configCopy);
      });
    });

    describe('Диапазон: {min: -10, max: 150, current: 0.5}, Шаг: 0.1', ()=>{
      let slider: ISlider, config: TSlider, range: IRange;
      beforeAll(()=>{
        range = new Range({
          min: -10,
          max: 150,
          current: 0.5,
        });
        config = {
          ranges: [new Range({
            min: -10,
            max: 150,
            current: 0.5,
          })],
          step: 0.1,
        }
        slider = new Slider(config);
      });
      test('Значение слайдера равно текущему значению диапазона', ()=>{
        expect(slider.getValue()).toEqual(range.getCurrent());
      });
      test('Абсолютный максимум равен максимальной границе диапазона', ()=>{
        expect(slider.getMax()).toEqual(range.getMax());
      });
      test('Абсолютный минимум равен минимальной границе диапазона', ()=>{
        expect(slider.getMin()).toEqual(range.getMin());
      });
      test('Активный диапазон - единственный, с индексом 0', ()=>{
        expect(slider.getActive()).toBe(0);
      });
      test('Шаг равен 0.1', ()=>{
        expect(slider.getStep()).toBe(0.1);
      });
      test('В массиве актуальных диапазонов - единственный индекс: 0', ()=>{
        expect(slider.getActuals()).toEqual([0]);
      });
    });

    describe('Два одинаковых диапазона', ()=>{
      let slider: ISlider, config: TSlider, range1: IRange, range2: IRange;
      beforeAll(()=>{
        range1 = new Range();
        range2 = new Range();
        config = { ranges: [range1, range2] };
        slider = new Slider(config);
      });
      test('Это двойной слайдер', ()=>{
        expect(slider.isDouble()).toBeTruthy();
      });
    });

    describe('Два не пересекающихся диапазона', ()=>{
      let slider: ISlider, config: TSlider, range1: IRange, range2: IRange;
      beforeAll(()=>{
        range1 = new Range({
          min: 0,
          max: 10,
        });
        range2 = new Range({
          min: 90,
          max: 100,
        });
        config = { ranges: [range1, range2] };
        slider = new Slider(config);
      });
      test('Это НЕ двойной слайдер', ()=>{
        expect(slider.isDouble()).toBeFalsy();
      });
    });

    describe('Два не последовательно пересекающихся диапазона', ()=>{
      let slider: ISlider, config: TSlider, range1: IRange, range2: IRange;
      beforeAll(()=>{
        range1 = new Range({
          min: 30,
          max: 100,
        });
        range2 = new Range({
          min: 0,
          max: 40,
        });
        config = { ranges: [range1, range2] };
        slider = new Slider(config);
      });
      test('Это двойной слайдер', ()=>{
        expect(slider.isDouble()).toBeTruthy();
      });
    });

    describe('Два пересекающихся диапазона', ()=>{
      let slider: ISlider, config: TSlider, range1: IRange, range2: IRange;
      beforeAll(()=>{
        range1 = new Range({
          min: 0,
          max: 40,
        });
        range2 = new Range({
          min: 30,
          max: 100,
        });
        config = { ranges: [range1, range2] };
        slider = new Slider(config);
      });
      test('Это двойной слайдер', ()=>{
        expect(slider.isDouble()).toBeTruthy();
      });
      test('Значение слайдера равно текущему значению активного диапазона - первого', ()=>{
        expect(slider.getValue()).toEqual(range1.getCurrent());
      });
      test('Абсолютный максимум равен максимальной границе второго диапазона', ()=>{
        expect(slider.getMax()).toEqual(range2.getMax());
      });
      test('Абсолютный минимум равен минимальной границе первого диапазона', ()=>{
        expect(slider.getMin()).toEqual(range1.getMin());
      });
      test('Активный диапазон по-умолчанию с индексом 0', ()=>{
        expect(slider.getActive()).toBe(0);
      });
      test('Актуальный диапазон по-умолчанию с индексом 1', ()=>{
        expect(slider.getActuals()).toEqual([1]);
      });
    });

    describe('Три перескающихся диапазона', ()=>{
      let slider: ISlider, config: TSlider, range1: IRange, range2: IRange, range3: IRange;
      beforeAll(()=>{
        range1 = new Range({
          min: 0,
          max: 40,
        });
        range2 = new Range({
          min: 30,
          max: 100,
        });
        range3 = new Range({
          min: 60,
          max: 100,
        });
        config = { ranges: [range1, range2, range3] };
        slider = new Slider(config);
      });
      test('Это НЕ двойной слайдер', ()=>{
        expect(slider.isDouble()).toBeFalsy();
      });
      test('Значение слайдера равно текущему значению активного диапазона - первого', ()=>{
        expect(slider.getValue()).toEqual(range1.getCurrent());
      });
      test('Абсолютный максимум равен максимальной границе последнего диапазона', ()=>{
        expect(slider.getMax()).toEqual(range3.getMax());
      });
      test('Абсолютный минимум равен минимальной границе первого диапазона', ()=>{
        expect(slider.getMin()).toEqual(range1.getMin());
      });
      test('Активный диапазон по-умолчанию с индексом 0', ()=>{
        expect(slider.getActive()).toBe(0);
      });
      test('Актуальные диапазоны по-умолчанию с индексами 1 и 2', ()=>{
        expect(slider.getActuals()).toEqual([1, 2]);
      });
    });

    describe('Четыре пересекающихся диапазона, активный: 3, актуальные: 0 и 1', ()=>{
      let slider: ISlider, config: TSlider, range1: IRange, range2: IRange, range3: IRange, range4: IRange;
      beforeAll(()=>{
        range1 = new Range({
          min: 0,
          max: 50,
        });
        range2 = new Range({
          current: 50,
          min: 30,
          max: 100,
        });
        range3 = new Range({
          current: 100,
          min: 30,
          max: 100,
        });
        range4 = new Range({
          current: 100,
          min: 100,
          max: 200,
        });
        config = { 
          ranges: [range1, range2, range3, range4],
          active: 3,
          actuals: [0, 1],
        };
        slider = new Slider(config);
      });
      test('Это НЕ двойной слайдер', ()=>{
        expect(slider.isDouble()).toBeFalsy();
      });
      test('Значение слайдера равно текущему значению активного диапазона - третьего', ()=>{
        expect(slider.getValue()).toEqual(range3.getCurrent());
      });
      test('Абсолютный максимум равен максимальной границе последнего диапазона', ()=>{
        expect(slider.getMax()).toEqual(range4.getMax());
      });
      test('Абсолютный минимум равен минимальной границе первого диапазона', ()=>{
        expect(slider.getMin()).toEqual(range1.getMin());
      });
      test('Активный диапазон с индексом 3', ()=>{
        expect(slider.getActive()).toBe(3);
      });
      test('Актуальные диапазоны с индексами 0 и 1', ()=>{
        expect(slider.getActuals()).toEqual([0, 1]);
      });
    });
  });

  describe('Методы', ()=>{
    describe('Установка абсолютного минимума значений при единственном дефолтном диапазоне', ()=>{
      let slider: ISlider, range: IRange;
      beforeEach(()=>{
        range = new Range();
        slider = new Slider({
          ranges: [range]
        });
      });

      test('Абсолютный минимум равен -100', ()=>{
        slider.setMin(-100);
        expect(slider.getMin()).toBe(-100);
      });
      test('Абсолютный минимум установлен в -100 и возвращен', ()=>{
        expect(slider.setMin(-100)).toBe(-100);
      });
      test('Абсолютный минимум установлен в -100 и равен минимальной границе первого диапазона', ()=>{
        expect(slider.setMin(-100)).toBe(range.getMin());
      });
      test('Абсолютный минимум устанавливаем в 200, но это больше максимальной границы дипазона и минимум остается равным 0', ()=>{
        expect(slider.setMin(200)).toBe(0);
      });
      test('Абсолютный минимум устанавлен в 100, все значения диапазона равны 100', ()=>{
        expect(slider.setMin(100)).toBe(100);
        expect(range.getMin()).toBe(100);
        expect(range.getMax()).toBe(100);
        expect(range.getCurrent()).toBe(100);
      });
    });

    describe('Установка абсолютного минимума значений двойного слайдера', ()=>{
      let slider: ISlider, range1: IRange, range2: IRange;
      beforeEach(()=>{
        range1 = new Range();
        range2 = new Range();
        slider = new Slider({
          ranges: [range1, range2]
        });
      });

      test('Абсолютный минимум равен -100', ()=>{
        expect(slider.setMin(-100)).toBe(-100);
      });
      test('Абсолютный минимум устанавливаем в 200, но это больше максимальной границы первого дипазона и минимум остается равным 0', ()=>{
        expect(slider.setMin(200)).toBe(0);
      });
      test('Абсолютный минимум устанавлен в 100, все значения диапазонов равны 100', ()=>{
        expect(slider.setMin(100)).toBe(100);
        expect(range1.getMin()).toBe(100);
        expect(range1.getMax()).toBe(100);
        expect(range1.getCurrent()).toBe(100);
        expect(range2.getMin()).toBe(100);
        expect(range2.getMax()).toBe(100);
        expect(range2.getCurrent()).toBe(100);
      });
    });

    describe('Установка абсолютного минимума значений двойного слайдера', ()=>{
      let slider: ISlider, range1: IRange, range2: IRange;
      beforeEach(()=>{
        range1 = new Range({
          min: 0,
          max: 300,
        });
        range2 = new Range();
        slider = new Slider({
          ranges: [range1, range2]
        });
      });

      test('Максимум 300', ()=>{
        expect(slider.getMax()).toBe(300);
      });
      test('Это двойной сладйер', ()=>{
        expect(slider.isDouble()).toBeTruthy();
      });

      test('Абсолютный минимум равен -100', ()=>{
        expect(slider.setMin(-100)).toBe(-100);
      });
      test('Абсолютный минимум устанавливаем в 200, но это больше максимальной границы левого дипазона и минимум остается равным 0', ()=>{
        expect(slider.setMin(200)).toBe(0);
      });
      test('Абсолютный минимум устанавлен в 100, все значения диапазонов равны 100', ()=>{
        expect(slider.setMin(100)).toBe(100);
        expect(range1.getMin()).toBe(100);
        expect(range1.getMax()).toBe(300);
        expect(range1.getCurrent()).toBe(100);
        expect(range2.getMin()).toBe(100);
        expect(range2.getMax()).toBe(100);
        expect(range2.getCurrent()).toBe(100);
      });
    });
  });
});