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
  
      describe('Двойной слайдер, где максимальная граница одного диапазона больше другого', ()=>{
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

      describe('По ближайшему значению при 4 разных диапазонах', () => {
        let slider: ISlider;
        beforeEach(()=>{
          slider = new Slider({
            ranges: [
              new Range({ min: 0, current: 16, max: 20 }), 
              new Range({ min: 16, current: 24, max: 24 }), 
              new Range({ min: 24, current: 40, max: 44 }), 
              new Range({ min: 40, current: 44, max: 48 })
            ]
          });
        });

        test('Ближайший диапазон к значению 0 - первый, теперь индекс активного диапазона: 0', ()=>{
          expect(slider.setActiveCloseOfValue(0)).toBe(0);
        });

        test('Ближайший диапазон к значению 20 - первый, теперь индекс активного диапазона: 0', ()=>{
          expect(slider.setActiveCloseOfValue(20)).toBe(0);
        });

        test('Ближайший диапазон к значению 21 - второй, теперь индекс активного диапазона: 1', ()=>{
          expect(slider.setActiveCloseOfValue(21)).toBe(1);
        });

        test('Ближайший диапазон к значению 32 - второй, теперь индекс активного диапазона: 1', ()=>{
          expect(slider.setActiveCloseOfValue(32)).toBe(1);
        });

        test('Ближайший диапазон к значению 33 - третий, теперь индекс активного диапазона: 2', ()=>{
          expect(slider.setActiveCloseOfValue(33)).toBe(2);
        });

        test('Ближайший диапазон к значению 42 - третий, теперь индекс активного диапазона: 2', ()=>{
          expect(slider.setActiveCloseOfValue(42)).toBe(2);
        });
        
        test('Ближайший диапазон к значению 43 - четвертый, теперь индекс активного диапазона: 3', ()=>{
          expect(slider.setActiveCloseOfValue(43)).toBe(3);
        });

        test('Ближайший диапазон к значению 48 - четвертый, теперь индекс активного диапазона: 3', ()=>{
          expect(slider.setActiveCloseOfValue(48)).toBe(3);
        });

        test('Ближайший диапазон к значению 148 - четвертый, теперь индекс активного диапазона: 3', ()=>{
          expect(slider.setActiveCloseOfValue(148)).toBe(3);
        });
        
        test('Ближайший диапазон к значению -148 - первый, теперь индекс активного диапазона: 0', ()=>{
          expect(slider.setActiveCloseOfValue(-148)).toBe(0);
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
        test('Значение установлено в 70 и равно текущему значению диапазона', ()=>{
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

        test('Значение установлено в 70 и равно текущему значению первого диапазона', ()=>{
          expect(slider.setValue(70)).toBe(range1.getCurrent());
        });
        test('Устанавливаем индекс активного диапазона в 1 и значение в 70, значение слайдера должно быть 70 и равно значению второго диапазона', ()=>{
          slider.setActive(1);
          expect(slider.setValue(70)).toBe(range2.getCurrent());
        });
      });
    });
    
    describe('Абсолютный диапазон', ()=>{
      test('При одном дефолтном диапазоне равен 100', ()=>{
        let slider: ISlider = new Slider({
          ranges: [new Range()]
        });
        expect(slider.getAbsoluteRange()).toBe(100);
      });

      test('При четырех диапазонах, от 10 до 150, равен 140', ()=>{
        let slider: ISlider = new Slider({
          ranges: [
            new Range({ min: 40, max: 60 }),
            new Range({ min: 10, max: 40 }),
            new Range({ min: 110, max: 150 }),
            new Range({ min: 50, max: 140 }),
          ]
        });
        expect(slider.getAbsoluteRange()).toBe(140);
      });
    });

    describe('Установка процентного значения', ()=>{
      test('70 при дефолтном диапазоне, значение должно быть равно 70', ()=>{
        let slider: ISlider = new Slider({
          ranges: [new Range()]
        });
        expect(slider.setPerValue(70)).toBe(70);
      });

      test('170 при дефолтном диапазоне, значение должно быть равно 100', ()=>{
        let slider: ISlider = new Slider({
          ranges: [new Range()]
        });
        expect(slider.setPerValue(170)).toBe(100);
      });

      test('-70 при дефолтном диапазоне, значение должно быть равно 0', ()=>{
        let slider: ISlider = new Slider({
          ranges: [new Range()]
        });
        expect(slider.setPerValue(-70)).toBe(0);
      });

      test('0.1 при дефолтном диапазоне и шаге 0.01, значение должно быть равно 0.1', ()=>{
        let slider: ISlider = new Slider({
          ranges: [new Range()],
          step: 0.01,
        });
        expect(slider.setPerValue(0.1)).toBe(0.1);
      });

      test('25 при диапазоне [120, 160], значение должно быть равно 130', ()=>{
        let slider: ISlider = new Slider({
          ranges: [new Range({ min: 120, max: 160 })]
        });
        expect(slider.setPerValue(25)).toBe(130);
      });

      test('25 при четырех диапазонах, от 10 до 150 и активном 0 по-умолчанию, значение должно быть равно 40', ()=>{
        let slider: ISlider = new Slider({
          ranges: [
            new Range({ min: 40, max: 60 }),
            new Range({ min: 10, max: 40 }),
            new Range({ min: 110, max: 150 }),
            new Range({ min: 50, max: 140 }),
          ]
        });
        expect(slider.setPerValue(25)).toBe(40);
      });

      test('25 при четырех диапазонах, от 10 до 150 и активном 1, значение должно быть равно 45', ()=>{
        let slider: ISlider = new Slider({
          ranges: [
            new Range({ min: 40, max: 60 }),
            new Range({ min: 10, max: 40 }),
            new Range({ min: 110, max: 150 }),
            new Range({ min: 50, max: 140 }),
          ],
          active: 1,
        });
        expect(slider.setPerValue(25)).toBe(45);
      });

      test('25 при четырех диапазонах, от 10 до 150 и активном 2, значение должно быть равно 50', ()=>{
        let slider: ISlider = new Slider({
          ranges: [
            new Range({ min: 40, max: 60 }),
            new Range({ min: 10, max: 40 }),
            new Range({ min: 110, max: 150 }),
            new Range({ min: 50, max: 140 }),
          ],
          active: 2,
        });
        expect(slider.setPerValue(25)).toBe(50);
      });
    });

    describe('Установка шага', ()=>{
      let slider: ISlider;
      beforeEach(() => {
         slider = new Slider();
      })

      test('в 70, шаг должно быть равен 70', ()=>{
        expect(slider.setStep(70)).toBe(70);
      });

      test('в 0.7, шаг должно быть равен 0.7', ()=>{
        expect(slider.setStep(0.7)).toBe(0.7);
      });

      test('в 0, шаг должен не измениться', ()=>{
        const oldStep = slider.getStep();
        expect(slider.setStep(0)).toBe(oldStep);
      });

      test('в -10, шаг должен не измениться', ()=>{
        const oldStep = slider.getStep();
        expect(slider.setStep(-10)).toBe(oldStep);
      });
    });

    describe('Установка минимального интервала', ()=>{
      test('При одном дефолтном диапазоне в 40, значение минимального интервала равно 40, равно текущему значению диапазона и максимальному интервалу', ()=>{
        let range: IRange = new Range();
        let slider: ISlider = new Slider({ ranges: [range] });
        expect(slider.setMinInterval(40)).toBe(40);
        expect(slider.getMinInterval()).toBe(40);
        expect(slider.getMinInterval()).toBe(slider.getMaxInterval());
        expect(slider.getMinInterval()).toBe(range.getCurrent());
      });

      test('В двойном слайдере с дефолтными диапазонами в 40, значение минимального интервала равно 40 и равно текущему значению первого диапазона', ()=>{
        let range1: IRange = new Range();
        let range2: IRange = new Range();
        let slider: ISlider = new Slider({ ranges: [range1, range2] });
        expect(slider.setMinInterval(40)).toBe(40);
        expect(slider.getMinInterval()).toBe(40);
        expect(slider.getMinInterval()).toBe(range1.getCurrent());
      });

      test('В двойном слайдере со значениями диапазонов (0, 25, 75, 100) в 80, значение минимального интервала равно 80 и равно текущему значению первого и второго диапазона', ()=>{
        let range1: IRange = new Range({min: 0, max: 75, current: 25});
        let range2: IRange = new Range({min: 25, max: 100, current: 75});
        let slider: ISlider = new Slider({ ranges: [range1, range2] });
        expect(slider.setMinInterval(80)).toBe(80);
        expect(slider.getMinInterval()).toBe(80);
        expect(slider.getMinInterval()).toBe(slider.getMaxInterval());
        expect(slider.getMinInterval()).toBe(range1.getCurrent());
        expect(slider.getMinInterval()).toBe(range2.getCurrent());
      });

      test('При значениях диапазонов (0, 25, 60, 75, 100, 150) в 80, значение минимального интервала равно 80 и равно текущему значению первого и второго диапазона, но не третьего', ()=>{
        let range1: IRange = new Range({min: 0, max: 75, current: 25});
        let range2: IRange = new Range({min: 25, max: 100, current: 75});
        let range3: IRange = new Range({min: 60, max: 150, current: 100});
        let slider: ISlider = new Slider({ ranges: [range1, range2, range3] });
        expect(slider.setMinInterval(80)).toBe(80);
        expect(slider.getMinInterval()).toBe(80);
        expect(slider.getMinInterval()).not.toBe(slider.getMaxInterval());
        expect(slider.getMinInterval()).toBe(range1.getCurrent());
        expect(slider.getMinInterval()).toBe(range2.getCurrent());
        expect(slider.getMinInterval()).not.toBe(range3.getCurrent());
      });

      test('В двойном слайдере со значениями диапазонов (0, 25, 75, 100) в 180, значение минимального интервала равно 100 и равно текущему значению первого и второго диапазона', ()=>{
        let range1: IRange = new Range({min: 0, max: 75, current: 25});
        let range2: IRange = new Range({min: 25, max: 100, current: 75});
        let slider: ISlider = new Slider({ ranges: [range1, range2] });
        expect(slider.setMinInterval(180)).toBe(100);
        expect(slider.getMinInterval()).toBe(100);
        expect(slider.getMinInterval()).toBe(slider.getMaxInterval());
        expect(slider.getMinInterval()).toBe(range1.getCurrent());
        expect(slider.getMinInterval()).toBe(range2.getCurrent());
      });

      test('В двойном слайдере с дефолтными диапазонами в -40, значение минимального интервала равно 0 и равно текущему значению первого диапазона', ()=>{
        let range1: IRange = new Range();
        let range2: IRange = new Range();
        let slider: ISlider = new Slider({ ranges: [range1, range2] });
        expect(slider.setMinInterval(-40)).toBe(0);
        expect(slider.getMinInterval()).toBe(0);
        expect(slider.getMinInterval()).toBe(range1.getCurrent());
        expect(slider.getMinInterval()).not.toBe(slider.getMaxInterval());
      });
    });

    describe('Установка максимального интервала', ()=>{
      test('При одном дефолтном диапазоне в 40, значение максимального интервала равно 40, равно текущему значению диапазона и минимальному интервалу', ()=>{
        let range: IRange = new Range();
        let slider: ISlider = new Slider({ ranges: [range] });
        expect(slider.setMaxInterval(40)).toBe(40);
        expect(slider.getMaxInterval()).toBe(40);
        expect(slider.getMaxInterval()).toBe(slider.getMinInterval());
        expect(slider.getMaxInterval()).toBe(range.getCurrent());
      });

      test('В двойном слайдере с дефолтными диапазонами в 40, значение максимального интервала равно 40 и равно текущему значению второго диапазона', ()=>{
        let range1: IRange = new Range();
        let range2: IRange = new Range();
        let slider: ISlider = new Slider({ ranges: [range1, range2] });
        expect(slider.setMaxInterval(40)).toBe(40);
        expect(slider.getMaxInterval()).toBe(40);
        expect(slider.getMaxInterval()).toBe(range2.getCurrent());
      });

      test('В двойном слайдере со значениями диапазонов (0, 25, 75, 100) в 20, значение максимального интервала равно 20 и равно текущему значению первого и второго диапазона', ()=>{
        let range1: IRange = new Range({min: 0, max: 75, current: 25});
        let range2: IRange = new Range({min: 25, max: 100, current: 75});
        let slider: ISlider = new Slider({ ranges: [range1, range2] });
        expect(slider.setMaxInterval(20)).toBe(20);
        expect(slider.getMaxInterval()).toBe(20);
        expect(slider.getMaxInterval()).toBe(slider.getMinInterval());
        expect(slider.getMaxInterval()).toBe(range1.getCurrent());
        expect(slider.getMaxInterval()).toBe(range2.getCurrent());
      });

      test('При значениях диапазонов (0, 25, 75, 90, 100, 150) в 30, значение максимального интервала равно 30 и равно текущему значению третьго и второго диапазона, но не первого', ()=>{
        let range1: IRange = new Range({min: 0, max: 75, current: 25});
        let range2: IRange = new Range({min: 25, max: 100, current: 75});
        let range3: IRange = new Range({min: 90, max: 150, current: 100});
        let slider: ISlider = new Slider({ ranges: [range1, range2, range3] });
        expect(slider.setMaxInterval(30)).toBe(30);
        expect(slider.getMaxInterval()).toBe(30);
        expect(slider.getMaxInterval()).not.toBe(slider.getMinInterval());
        expect(slider.getMaxInterval()).toBe(range3.getCurrent());
        expect(slider.getMaxInterval()).toBe(range2.getCurrent());
        expect(slider.getMaxInterval()).not.toBe(range1.getCurrent());
      });

      test('В двойном слайдере со значениями диапазонов (0, 25, 75, 100) в -180, значение максимального интервала равно 0 и равно текущему значению первого и второго диапазона', ()=>{
        let range1: IRange = new Range({min: 0, max: 75, current: 25});
        let range2: IRange = new Range({min: 25, max: 100, current: 75});
        let slider: ISlider = new Slider({ ranges: [range1, range2] });
        expect(slider.setMaxInterval(-180)).toBe(0);
        expect(slider.getMaxInterval()).toBe(0);
        expect(slider.getMaxInterval()).toBe(slider.getMinInterval());
        expect(slider.getMaxInterval()).toBe(range1.getCurrent());
        expect(slider.getMaxInterval()).toBe(range2.getCurrent());
      });

      test('В двойном слайдере с дефолтными диапазонами в 140, значение максимального интервала равно 100 и равно текущему значению последнего диапазона', ()=>{
        let range1: IRange = new Range();
        let range2: IRange = new Range();
        let slider: ISlider = new Slider({ ranges: [range1, range2] });
        expect(slider.setMaxInterval(140)).toBe(100);
        expect(slider.getMaxInterval()).toBe(100);
        expect(slider.getMaxInterval()).toBe(range2.getCurrent());
        expect(slider.getMaxInterval()).not.toBe(slider.getMinInterval());
      });
    });

    describe('Проверка на двойной слайдер', () => {
      test('Дефолтный слайдер - НЕ двойной', ()=>{
        let slider: ISlider = new Slider();
        expect(slider.isDouble()).toBeFalsy();
      });

      test('Слайдер с двумя пересекающимися диапазонами - двойной', ()=>{
        let slider: ISlider = new Slider({ ranges: [new Range(), new Range()] });
        expect(slider.isDouble()).toBeTruthy();
      });

      test('Слайдер с двумя не пересекающимися диапазонами - НЕ двойной', ()=>{
        let slider: ISlider = new Slider({ 
          ranges: [
            new Range({ min: 0, max: 10 }), 
            new Range({ min: 80, max: 90 })
          ] 
        });
        expect(slider.isDouble()).toBeFalsy();
      });

      test('Слайдер с двумя диапазонами, где один включает другой - НЕ двойной', ()=>{
        let slider: ISlider = new Slider({ 
          ranges: [
            new Range({ min: 0, max: 100 }), 
            new Range({ min: 40, max: 60 })
          ] 
        });
        expect(slider.isDouble()).toBeFalsy();
      });

      test('Слайдер с тремя пересекающимися диапазонами - НЕ двойной', ()=>{
        let slider: ISlider = new Slider({ 
          ranges: [
            new Range({ min: 0, max: 10 }), 
            new Range({ min: 5, max: 85 }), 
            new Range({ min: 80, max: 90 })
          ] 
        });
        expect(slider.isDouble()).toBeFalsy();
      });

      test('Слайдер с тремя диапазонами, где только два пересекаются и третий не связан - двойной', ()=>{
        let slider: ISlider = new Slider({ 
          ranges: [
            new Range({ min: 0, max: 10 }), 
            new Range({ min: 5, max: 25 }), 
            new Range({ min: 80, max: 90 })
          ] 
        });
        expect(slider.isDouble()).toBeTruthy();
      });

      test('Слайдер с тремя диапазонами, где только два пересекаются и третий включает оба - двойной', ()=>{
        let slider: ISlider = new Slider({ 
          ranges: [
            new Range({ min: 0, max: 10 }), 
            new Range({ min: 5, max: 25 }), 
            new Range({ min: -100, max: 90 })
          ] 
        });
        expect(slider.isDouble()).toBeTruthy();
      });

      test('Слайдер с тремя вложенными диапазонами - НЕ двойной', ()=>{
        let slider: ISlider = new Slider({ 
          ranges: [
            new Range({ min: 0, max: 30 }), 
            new Range({ min: 5, max: 25 }), 
            new Range({ min: -100, max: 90 })
          ] 
        });
        expect(slider.isDouble()).toBeFalsy();
      });
    });

    describe('Установка актуальных диапазонов', () => {
      let slider: ISlider;
      beforeEach(() => {
        slider = new Slider({ ranges: [new Range(), new Range(), new Range(), new Range()] })
      });

      test('Актуальными должны быть все: [0, 1, 2, 3]', () => {
        expect(slider.setActuals([0, 1, 2, 3])).toEqual([0, 1, 2, 3]);
        expect(slider.getActuals()).toEqual([0, 1, 2, 3]);
      });

      test('Устанавливаем индексы некорректно [-100, 1.2, 200, 3], актуальным должен быть диапазон с индексом: 3', () => {
        expect(slider.setActuals([-100, 1.2, 200, 3])).toEqual([3]);
        expect(slider.getActuals()).toEqual([3]);
      });
    });

    describe('Проверка получения списка процентных значений', () => {

      test('У дефолтного слайдера одно значение - 50', () => {
        let slider: ISlider = new Slider();
        expect(slider.getPerValues()).toEqual([50]);
      });

      test('Список значений должен быть: 25, 50', () => {
        let slider: ISlider = new Slider({
          ranges: [
            new Range({
              min: 0,
              max: 40,
              current: 20,
            }),
            new Range({
              min: 20,
              max: 80,
              current: 40,
            }),
          ]
        });
        expect(slider.getPerValues()).toEqual([25, 50]);
      });
    });

    describe('Проверка получения списка лимитов', () => {

      test('Для дефолтного слайдера: 0, 50, 100', () => {
        let slider: ISlider = new Slider();
        expect(slider.getLimits()).toEqual([0, 50, 100]);
      });

      test('Список лимитов должен быть: 0, 20, 40, 80', () => {
        let slider: ISlider = new Slider({
          ranges: [
            new Range({
              min: 0,
              max: 40,
              current: 20,
            }),
            new Range({
              min: 20,
              max: 80,
              current: 40,
            }),
          ]
        });
        expect(slider.getLimits()).toEqual([0, 20, 40, 80]);
      });

      test('Список лимитов должен быть: 0, 20, 40, 80, 100, 180', () => {
        let slider: ISlider = new Slider({
          ranges: [
            new Range({ min: 0, max: 40, current: 20 }),
            new Range({ min: 20, max: 80, current: 40 }),
            new Range({ min: 40, max: 100, current: 80 }),
            new Range({ min: 80, max: 180, current: 100 }),
          ]
        });
        expect(slider.getLimits()).toEqual([0, 20, 40, 80, 100, 180]);
      });
    })
    
  });
});