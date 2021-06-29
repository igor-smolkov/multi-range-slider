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
    describe('Установка абсолютного минимума значений', () => {
      describe('При единственном дефолтном диапазоне', ()=>{
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
  
      describe('Двойной слайдер c одинаковыми дефолтными диапазонами', ()=>{
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
        test('Абсолютный минимум устанавливаем в 200, но это больше максимальной границы всех дипазонов и ничего не меняется', ()=>{
          expect(slider.setMin(200)).toBe(0);
          expect(slider.isDouble()).toBeTruthy();
        });
        test('Абсолютный минимум устанавлен в 100, все значения диапазонов равны 100', ()=>{
          expect(slider.setMin(100)).toBe(100);
          expect(range1.getMin()).toBe(100);
          expect(range1.getMax()).toBe(100);
          expect(range1.getCurrent()).toBe(100);
          expect(range2.getMin()).toBe(100);
          expect(range2.getMax()).toBe(100);
          expect(range2.getCurrent()).toBe(100);
          expect(slider.isDouble()).toBeTruthy();
        });
      });
  
      describe('Двойного слайдер, где максимальная граница одного диапазона больше другого', ()=>{
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
  
        test('Абсолютный минимум равен -100', ()=>{
          expect(slider.setMin(-100)).toBe(-100);
        });
        test('Абсолютный минимум устанавливаем в 200, это больше максимальной границы левого дипазона но меньше правого, слайдер сокращается до одного диапазона с минимумом в 200', ()=>{
          expect(slider.setMin(200)).toBe(200);
          expect(range1.getMin()).toBe(200);
          expect(slider.isDouble()).toBeFalsy();
        });
        test('Абсолютный минимум установлен в 100, левый диапазон ужимается в 100, у правого минимальная граница 100, максимальная 300', ()=>{
          expect(slider.setMin(100)).toBe(100);
          expect(range1.getMin()).toBe(100);
          expect(range1.getMax()).toBe(300);
          expect(range2.getMin()).toBe(100);
          expect(range2.getMax()).toBe(100);
          expect(slider.isDouble()).toBeTruthy();
        });
      });
  
      describe('Четыре последовательных диапазона', ()=>{
        let slider: ISlider, range1: IRange, range2: IRange, range3: IRange, range4: IRange;
        beforeEach(()=>{
          range1 = new Range({
            min: 0,
            max: 20,
          });
          range2 = new Range({
            min: 10,
            max: 30,
          });
          range3 = new Range({
            min: 20,
            max: 40,
          });
          range4 = new Range({
            min: 30,
            max: 50,
          });
          slider = new Slider({
            ranges: [range1, range2, range3, range4]
          });
        });
  
        test('Это НЕ двойной слайдер', ()=>{
          expect(slider.isDouble()).toBeFalsy();
        });
  
        test('Абсолютный минимум устанавливаем в 35, это больше максимальной границы двух левых диапазонов но меньше двух правых, слайдер сокращается до двойного с минимумом в 35', ()=>{
          expect(slider.setMin(35)).toBe(35);
          expect(range3.getMin()).toBe(35);
          expect(range4.getMin()).toBe(35);
          expect(slider.isDouble()).toBeTruthy();
        });
      });
    });

    describe('Установка абсолютного максимума значений', () => {
      describe('При единственном дефолтном диапазоне', ()=>{
        let slider: ISlider, range: IRange;
        beforeEach(()=>{
          range = new Range();
          slider = new Slider({
            ranges: [range]
          });
        });
  
        test('Абсолютный максимум равен 200', ()=>{
          slider.setMax(200);
          expect(slider.getMax()).toBe(200);
        });
        test('Абсолютный максимум установлен в 200 и возвращен', ()=>{
          expect(slider.setMax(200)).toBe(200);
        });
        test('Абсолютный максимум установлен в 200 и равен максимальной границе диапазона', ()=>{
          expect(slider.setMax(200)).toBe(range.getMax());
        });
        test('Абсолютный максимум устанавливаем в -100, но это меньше минимальной границы дипазона и максимум остается равным 100', ()=>{
          expect(slider.setMax(-100)).toBe(100);
        });
        test('Абсолютный максимум устанавлен в 0, все значения диапазона равны 0', ()=>{
          expect(slider.setMax(0)).toBe(0);

          expect(range.getMin()).toBe(0);
          expect(range.getMax()).toBe(0);
          expect(range.getCurrent()).toBe(0);
        });
      });
  
      describe('Двойной слайдер c одинаковыми дефолтными диапазонами', ()=>{
        let slider: ISlider, range1: IRange, range2: IRange;
        beforeEach(()=>{
          range1 = new Range();
          range2 = new Range();
          slider = new Slider({
            ranges: [range1, range2]
          });
        });
  
        test('Абсолютный максимум равен 200', ()=>{
          expect(slider.setMax(200)).toBe(200);
        });
        test('Абсолютный максимум устанавливаем в -100, но это меньше минимальной границы всех дипазонов и ничего не меняется', ()=>{
          expect(slider.setMax(-100)).toBe(100);
          expect(slider.isDouble()).toBeTruthy();
        });
        test('Абсолютный максимум устанавлен в 0, все значения диапазонов равны 0', ()=>{
          expect(slider.setMax(0)).toBe(0);

          expect(range1.getMin()).toBe(0);
          expect(range1.getMax()).toBe(0);
          expect(range1.getCurrent()).toBe(0);
          expect(range2.getMin()).toBe(0);
          expect(range2.getMax()).toBe(0);
          expect(range2.getCurrent()).toBe(0);
          expect(slider.isDouble()).toBeTruthy();
        });
      });
  
      describe('Двойного слайдер, где минимальная граница одного диапазона меньше другого', ()=>{
        let slider: ISlider, range1: IRange, range2: IRange;
        beforeEach(()=>{
          range1 = new Range();
          range2 = new Range({
            min: -300,
            max: 100,
          });
          slider = new Slider({
            ranges: [range1, range2]
          });
        });
  
        test('Абсолютный максимум равен 200', ()=>{
          expect(slider.setMax(200)).toBe(200);
        });
        test('Абсолютный максимум устанавливаем в -100, это меньше минимальной границы правого дипазона но больше левого, слайдер сокращается до одного диапазона с максимумом в -100', ()=>{
          expect(slider.setMax(-100)).toBe(-100);
          expect(range2.getMax()).toBe(-100);
          expect(slider.isDouble()).toBeFalsy();
        });
        test('Абсолютный максимум установлен в 0, правый диапазон ужимается в 0, у левого минимальная граница -300, максимальная 0', ()=>{
          expect(slider.setMax(0)).toBe(0);
          expect(range1.getMin()).toBe(0);
          expect(range1.getMax()).toBe(0);
          expect(range2.getMin()).toBe(-300);
          expect(range2.getMax()).toBe(0);
          expect(slider.isDouble()).toBeTruthy();
        });
      });
  
      describe('Четыре последовательных диапазона', ()=>{
        let slider: ISlider, range1: IRange, range2: IRange, range3: IRange, range4: IRange;
        beforeEach(()=>{
          range1 = new Range({
            min: 0,
            max: 20,
          });
          range2 = new Range({
            min: 10,
            max: 30,
          });
          range3 = new Range({
            min: 20,
            max: 40,
          });
          range4 = new Range({
            min: 30,
            max: 50,
          });
          slider = new Slider({
            ranges: [range1, range2, range3, range4]
          });
        });
  
        test('Это НЕ двойной слайдер', ()=>{
          expect(slider.isDouble()).toBeFalsy();
        });
  
        test('Абсолютный максимум устанавливаем в 15, это меньше минимальной границы двух правых диапазонов но больше двух левых, слайдер сокращается до двойного с максимумом в 15', ()=>{
          expect(slider.setMax(15)).toBe(15);
          expect(range1.getMax()).toBe(15);
          expect(range2.getMax()).toBe(15);
          expect(slider.isDouble()).toBeTruthy();
        });
      });
    });

    describe('Установка и получение активного диапазона', () => {
      describe('При четырех диапазонах', ()=>{
        let slider: ISlider;
        beforeEach(()=>{
          slider = new Slider({
            ranges: [new Range(), new Range(), new Range(), new Range()]
          });
        });

        test('Индекс активного диапазона установлен в 2', ()=>{
          slider.setActive(2);
          expect(slider.getActive()).toBe(2);
        });
        test('Индекс активного диапазона установлен в 2 и возвращен', ()=>{
          expect(slider.setActive(2)).toBe(2);
        });
        test('Индекс активного диапазона установлен в 0', ()=>{
          expect(slider.setActive(0)).toBe(0);
        });
        test('Индекс активного диапазона установливаем в 4, но это больше числа диапазонов, возвращается текущий активный по-умолчанию: 0', ()=>{
          expect(slider.setActive(4)).toBe(0);
        });
        test('Индекс активного диапазона установлен в 1, затем установливаем в -1, но это некорректный, возвращается текущий активный: 1', ()=>{
          slider.setActive(1);
          expect(slider.setActive(-1)).toBe(1);
        });
      });
    });

    describe('Установка значения активного диапазона', () => {
      describe('При единственном дефолтном диапазоне', ()=>{
        let slider: ISlider, range: IRange;
        beforeEach(()=>{
          range = new Range();
          slider = new Slider({
            ranges: [range]
          });
        });

        test('Значение установлено в 70', ()=>{
          slider.setValue(70);
          expect(slider.getValue()).toBe(70);
        });
        test('Значение установлено в 70 и возвращено', ()=>{
          expect(slider.setValue(70)).toBe(70);
        });
        test('Значение установлено в 70 и равено текущему значению диапазона', ()=>{
          expect(slider.setValue(70)).toBe(range.getCurrent());
        });
        test('Значение установлено в 170, значение равно максимальной границе диапазона 100', ()=>{
          expect(slider.setValue(170)).toBe(100);
          expect(slider.getValue()).toBe(range.getMax());
        });
        test('Значение установлено в -170, значение равно минимальной границе диапазона 0', ()=>{
          expect(slider.setValue(-170)).toBe(0);
          expect(slider.getValue()).toBe(range.getMin());
        });
      });

      describe('При двойном слайдере', ()=>{
        let slider: ISlider, range1: IRange, range2: IRange;
        beforeEach(()=>{
          range1 = new Range();
          range2 = new Range();
          slider = new Slider({
            ranges: [range1, range2]
          });
        });

        test('Значение установлено в 70 и равено текущему значению первого диапазона', ()=>{
          expect(slider.setValue(70)).toBe(range1.getCurrent());
        });
        test('Устанавливаем индекс активного диапазона в 1 и значение в 70, значение слайдера должно быть 70 и равно значению второго диапазона', ()=>{
          slider.setActive(1);
          expect(slider.setValue(70)).toBe(range2.getCurrent());
        });
      });
    });
    
    
    
  });
});