/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable lines-between-class-members */
/* eslint-disable no-useless-return */
/* eslint-disable class-methods-use-this */
import { IRange } from '../Range';
import { ISlider, Slider } from '../Slider';

describe('Слайдер', () => {
  class RangeStab implements IRange {
    setMin(): number { return; }
    getMin(): number { return; }
    setMax(): number { return; }
    getMax(): number { return; }
    setCurrent(): number { return; }
    getCurrent(): number { return; }
  }
  it('Экземпляр должен быть создан', () => {
    const slider: ISlider = new Slider([new RangeStab()]);

    expect(slider).toBeDefined();
  });
  describe('Укладка диапазонов', () => {
    it('Минимум слайдера должен отражать, что диапазоны были отсортированы по их минимуму', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      // [20, 40]
      range1.getMin = () => 20;
      range1.getCurrent = () => 40;
      range1.getMax = () => 40;
      // [10, 40]
      range2.getMin = () => 10;
      range2.getCurrent = () => 20;
      range2.getMax = () => 40;

      const slider: ISlider = new Slider([range1, range2]);

      expect(slider.getMin()).toBe(10);
    });
    it('Максимум слайдера должен отражать, что диапазоны были отсортированы по их максимуму, при одинаковых минимумах', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      // [20, 50]
      range1.getMin = () => 20;
      range1.getCurrent = () => 40;
      range1.getMax = () => 50;
      // [20, 30]
      range2.getMin = () => 20;
      range2.getCurrent = () => 20;
      range2.getMax = () => 30;

      const slider: ISlider = new Slider([range1, range2]);

      expect(slider.getMax()).toBe(50);
    });
    it('Слайдер должен быть двойным, когда оба диапазона последовательно связаны значениями', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      // [10, 30] - current = 20
      range1.getMin = () => 10;
      range1.getCurrent = () => 20;
      range1.getMax = () => 30;
      // [20, 40] - current = 30
      range2.getMin = () => 20;
      range2.getCurrent = () => 30;
      range2.getMax = () => 40;

      const slider: ISlider = new Slider([range1, range2]);

      expect(slider.isDouble()).toBeTruthy();
    });
    it('Слайдер должен быть двойным, когда оба диапазона пресекаются и их текущее значение можно скорректировать', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      // [10, 30] - current -> 20
      range1.getMin = () => 10;
      range1.getCurrent = () => 15;
      range1.setCurrent = () => 20;
      range1.getMax = () => 30;
      // [20, 40] - current -> 30
      range2.getMin = () => 20;
      range2.getCurrent = () => 35;
      range2.setCurrent = () => 30;
      range2.getMax = () => 40;

      const slider: ISlider = new Slider([range1, range2]);

      expect(slider.isDouble()).toBeTruthy();
    });
  });
  describe('Установка активного диапазона', () => {
    it('Должен быть с индексом 0', () => {
      const slider: ISlider = new Slider([new RangeStab(), new RangeStab()]);

      expect(slider.getActive()).toBe(0);
    });
    it('Должен быть с индексом 1, при передаче в опциях', () => {
      const slider: ISlider = new Slider([new RangeStab(), new RangeStab()], { active: 1 });

      expect(slider.getActive()).toBe(1);
    });
    it('Должен быть с индексом 0, при передаче некорректного значения', () => {
      const slider: ISlider = new Slider([new RangeStab(), new RangeStab()], { active: -1 });

      expect(slider.getActive()).toBe(0);
    });
    it('Должен быть изменен при передаче нового индекса в опциях обновления', () => {
      const slider: ISlider = new Slider([new RangeStab(), new RangeStab()], { active: 0 });
      const oldActive = slider.getActive();

      slider.update({ active: 1 });

      expect(slider.getActive()).not.toBe(oldActive);
      expect(slider.getActive()).toBe(1);
    });
    it('Активным должен стать диапазон с индексом 0', () => {
      const slider: ISlider = new Slider([new RangeStab(), new RangeStab()], { active: 1 });

      slider.setActive(0);

      expect(slider.getActive()).toBe(0);
    });
    it('Активным должен стать диапазон с индексом 0, при выборе диапазона близкого к значению 11', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      range1.getMin = () => 10;
      range1.getCurrent = () => 20;
      range1.getMax = () => 30;
      range2.getMin = () => 20;
      range2.getCurrent = () => 30;
      range2.getMax = () => 40;
      const slider: ISlider = new Slider([range1, range2], { active: 1 });
      const testValue = 11;

      slider.setActiveCloseOfValue(testValue);

      expect(slider.getActive()).toBe(0);
    });
    it('Активным должен стать диапазон с индексом 1, при выборе диапазона близкого к значению 35', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      range1.getMin = () => 10;
      range1.getCurrent = () => 20;
      range1.getMax = () => 30;
      range2.getMin = () => 20;
      range2.getCurrent = () => 30;
      range2.getMax = () => 40;
      const slider: ISlider = new Slider([range1, range2], { active: 0 });
      const testValue = 35;

      slider.setActiveCloseOfValue(testValue);

      expect(slider.getActive()).toBe(1);
    });
    it('Активным должен стать диапазон с индексом 1, при выборе диапазона близкого к значению 26', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      range1.getMin = () => 10;
      range1.getCurrent = () => 20;
      range1.getMax = () => 30;
      range2.getMin = () => 20;
      range2.getCurrent = () => 30;
      range2.getMax = () => 40;
      const slider: ISlider = new Slider([range1, range2], { active: 0 });
      const testValue = 26;

      slider.setActiveCloseOfValue(testValue);

      expect(slider.getActive()).toBe(1);
    });
    it('Активным должен стать диапазон с индексом 0, при выборе диапазона близкого к значению 24', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      range1.getMin = () => 10;
      range1.getCurrent = () => 20;
      range1.getMax = () => 30;
      range2.getMin = () => 20;
      range2.getCurrent = () => 30;
      range2.getMax = () => 40;
      const slider: ISlider = new Slider([range1, range2], { active: 1 });
      const testValue = 24;

      slider.setActiveCloseOfValue(testValue);

      expect(slider.getActive()).toBe(0);
    });
    it('Текущее значение слайдера должно быть равно текущему значению активного диапазона', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      range1.getCurrent = () => 20;
      range2.getCurrent = () => 30;
      const slider: ISlider = new Slider([range1, range2], { active: 1 });

      expect(slider.getValue()).toBe(30);
    });
  });
  describe('Установка шага', () => {
    it('Должен быть равен 1', () => {
      const slider: ISlider = new Slider([new RangeStab()]);

      expect(slider.getStep()).toBe(1);
    });
    it('Должен быть равен 2.5, при передаче в опциях', () => {
      const slider: ISlider = new Slider([new RangeStab()], { step: 2.5 });

      expect(slider.getStep()).toBe(2.5);
    });
    it('Должен быть равен 1, при передаче некорректного значения', () => {
      const slider: ISlider = new Slider([new RangeStab()], { step: -2.5 });

      expect(slider.getStep()).toBe(1);
    });
    it('Должен быть изменен при передаче в опциях обновления', () => {
      const slider: ISlider = new Slider([new RangeStab(), new RangeStab()], { step: 5 });
      const oldStep = slider.getStep();

      slider.update({ step: 0.1 });

      expect(slider.getStep()).not.toBe(oldStep);
      expect(slider.getStep()).toBe(0.1);
    });
  });
  describe('Установка актуальных диапазонов', () => {
    it('Диапазон должен быть актуальным', () => {
      const slider: ISlider = new Slider([new RangeStab()]);

      expect(slider.getActualRanges()).toEqual([0]);
    });
    it('Должен быть диапазон с индексом 1, при двух диапазонах', () => {
      const slider: ISlider = new Slider([new RangeStab(), new RangeStab()]);

      expect(slider.getActualRanges()).toEqual([1]);
    });
    it('Должны быть диапазоны с индексами 1 и 2, при трех диапазонах', () => {
      const slider: ISlider = new Slider([new RangeStab(), new RangeStab(), new RangeStab()]);

      expect(slider.getActualRanges()).toEqual([1, 2]);
    });
    it('Должны быть диапазоны с индексами 1 и 3, при четырех диапазонах', () => {
      const slider: ISlider = new Slider(
        [new RangeStab(), new RangeStab(), new RangeStab(), new RangeStab()],
      );

      expect(slider.getActualRanges()).toEqual([1, 3]);
    });
    it('Должны быть диапазоны с индексами 1, 2, 3 и 4, при пяти диапазонах', () => {
      const slider: ISlider = new Slider(
        [new RangeStab(), new RangeStab(), new RangeStab(), new RangeStab(), new RangeStab()],
      );

      expect(slider.getActualRanges()).toEqual([1, 2, 3, 4]);
    });
    it('Должны быть диапазоны с индексами 0, 2 и 3, при пяти диапазонах и заданной опции актуальных диапазонов', () => {
      const testActualRanges = [0, 2, 3];

      const slider: ISlider = new Slider(
        [new RangeStab(), new RangeStab(), new RangeStab(), new RangeStab(), new RangeStab()],
        { actualRanges: testActualRanges },
      );

      expect(slider.getActualRanges()).toEqual(testActualRanges);
    });
    it('Должны быть диапазоны с индексами 0, 2 и 3, при пяти диапазонах и заданной опции актуальных диапазонов с некорректными значениями', () => {
      const testActualRanges = [0, -1, 2, 3, 6];
      const expectedActualRanges = [0, 2, 3];

      const slider: ISlider = new Slider(
        [new RangeStab(), new RangeStab(), new RangeStab(), new RangeStab(), new RangeStab()],
        { actualRanges: testActualRanges },
      );

      expect(slider.getActualRanges()).toEqual(expectedActualRanges);
    });
    it('Должны быть диапазоны с индексами 1, 2, 3 и 4, при пяти диапазонах и заданной опции актуальных диапазонов со всеми некорректными значениями', () => {
      const testActualRanges = [-1, -2, 30, 6];

      const slider: ISlider = new Slider(
        [new RangeStab(), new RangeStab(), new RangeStab(), new RangeStab(), new RangeStab()],
        { actualRanges: testActualRanges },
      );

      expect(slider.getActualRanges()).toEqual([1, 2, 3, 4]);
    });
    it('Должен быть изменен при передаче нового списка в опциях обновления', () => {
      const slider: ISlider = new Slider([new RangeStab(), new RangeStab()], { actualRanges: [0] });
      const oldActualRanges = slider.getActualRanges();

      slider.update({ actualRanges: [0, 1] });

      expect(slider.getActualRanges()).not.toEqual(oldActualRanges);
      expect(slider.getActualRanges()).toEqual([0, 1]);
    });
    it('Актуальных диапазонов не должно быть, при пустом списке', () => {
      const testActualRanges: number[] = [];

      const slider: ISlider = new Slider(
        [new RangeStab(), new RangeStab(), new RangeStab(), new RangeStab(), new RangeStab()],
        { actualRanges: testActualRanges },
      );

      expect(slider.getActualRanges().length).toBeFalsy();
    });
  });
  describe('Установка минимума', () => {
    it('Должна быть вызвана с соответствующим значением при передаче минимума в опциях обновления', () => {
      const slider: ISlider = new Slider([new RangeStab()]);
      const spy = jest.spyOn(slider, 'setMin');
      const testValue = 10;

      slider.update({ min: testValue });

      expect(spy).toHaveBeenCalledWith(testValue);
    });
    it('Метод установки минимума диапазона должен быть вызван с соответствующим значением', () => {
      const range = new RangeStab();
      range.getMax = () => 100;
      const spy = jest.spyOn(range, 'setMin');
      const slider: ISlider = new Slider([range]);
      const testValue = 10;

      slider.setMin(testValue);

      expect(spy).toHaveBeenCalledWith(testValue);
    });
    it('Метод установки минимума обоих диапазонов должен быть вызван с соответствующим значением', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      range1.getMin = () => 10;
      range1.getCurrent = () => 20;
      range1.getMax = () => 30;
      range2.getMin = () => 20;
      range2.getCurrent = () => 30;
      range2.getMax = () => 40;
      const range1Spy = jest.spyOn(range1, 'setMin');
      const range2Spy = jest.spyOn(range2, 'setMin');
      const slider: ISlider = new Slider([range1, range2]);
      const testValue = 25;

      slider.setMin(testValue);

      expect(range1Spy).toHaveBeenCalledWith(testValue);
      expect(range2Spy).toHaveBeenCalledWith(testValue);
    });
    it('Первый диапазон должен быть сокращен, при установке минимума слайдера большего максимума первого диапазона', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      range1.getMin = () => 10;
      range1.getCurrent = () => 20;
      range1.getMax = () => 30;
      range2.getMin = () => 20;
      range2.getCurrent = () => 30;
      range2.getMax = () => 40;
      const range2Spy = jest.spyOn(range2, 'setMin');
      const slider: ISlider = new Slider([range1, range2]);
      const testValue = 35;

      slider.setMin(testValue);

      expect(slider.isDouble()).toBeFalsy();
      expect(range2Spy).toHaveBeenCalledWith(testValue);
    });
    it('Метод установки минимума обоих диапазонов не должен быть вызван при установке минимума слайдера большего максимума всех диапазонов', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      range1.getMin = () => 10;
      range1.getCurrent = () => 20;
      range1.getMax = () => 30;
      range2.getMin = () => 20;
      range2.getCurrent = () => 30;
      range2.getMax = () => 40;
      const range1Spy = jest.spyOn(range1, 'setMin');
      const range2Spy = jest.spyOn(range2, 'setMin');
      const slider: ISlider = new Slider([range1, range2]);
      const testValue = 45;

      slider.setMin(testValue);

      expect(range1Spy).not.toHaveBeenCalled();
      expect(range2Spy).not.toHaveBeenCalled();
    });
  });
  describe('Установка максимума', () => {
    it('Должна быть вызвана с соответствующим значением при передаче максимума в опциях обновления', () => {
      const slider: ISlider = new Slider([new RangeStab()]);
      const spy = jest.spyOn(slider, 'setMax');
      const testValue = 10;

      slider.update({ max: testValue });

      expect(spy).toHaveBeenCalledWith(testValue);
    });
    it('Метод установки максимума диапазона должен быть вызван с соответствующим значением', () => {
      const range = new RangeStab();
      range.getMin = () => 0;
      const spy = jest.spyOn(range, 'setMax');
      const slider: ISlider = new Slider([range]);
      const testValue = 10;

      slider.setMax(testValue);

      expect(spy).toHaveBeenCalledWith(testValue);
    });
    it('Метод установки максимума обоих диапазонов должен быть вызван с соответствующим значением', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      range1.getMin = () => 10;
      range1.getCurrent = () => 20;
      range1.getMax = () => 30;
      range2.getMin = () => 20;
      range2.getCurrent = () => 30;
      range2.getMax = () => 40;
      const range1Spy = jest.spyOn(range1, 'setMax');
      const range2Spy = jest.spyOn(range2, 'setMax');
      const slider: ISlider = new Slider([range1, range2]);
      const testValue = 25;

      slider.setMax(testValue);

      expect(range1Spy).toHaveBeenCalledWith(testValue);
      expect(range2Spy).toHaveBeenCalledWith(testValue);
    });
    it('Последний диапазон должен быть сокращен, при установке максимума слайдера меньшего минимума последнего диапазона', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      range1.getMin = () => 10;
      range1.getCurrent = () => 20;
      range1.getMax = () => 30;
      range2.getMin = () => 20;
      range2.getCurrent = () => 30;
      range2.getMax = () => 40;
      const range1Spy = jest.spyOn(range1, 'setMax');
      const slider: ISlider = new Slider([range1, range2]);
      const testValue = 15;

      slider.setMax(testValue);

      expect(slider.isDouble()).toBeFalsy();
      expect(range1Spy).toHaveBeenCalledWith(testValue);
    });
    it('Метод установки максимума обоих диапазонов не должен быть вызван при установке максимума слайдера меньшего минимума всех диапазонов', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      range1.getMin = () => 10;
      range1.getCurrent = () => 20;
      range1.getMax = () => 30;
      range2.getMin = () => 20;
      range2.getCurrent = () => 30;
      range2.getMax = () => 40;
      const range1Spy = jest.spyOn(range1, 'setMax');
      const range2Spy = jest.spyOn(range2, 'setMax');
      const slider: ISlider = new Slider([range1, range2]);
      const testValue = 5;

      slider.setMax(testValue);

      expect(range1Spy).not.toHaveBeenCalled();
      expect(range2Spy).not.toHaveBeenCalled();
    });
  });
  describe('Установка текущего значения', () => {
    it('Должна быть вызвана с соответствующим значением при передаче текущего значения в опциях обновления', () => {
      const slider: ISlider = new Slider([new RangeStab()]);
      const spy = jest.spyOn(slider, 'setValue');
      const testValue = 10;

      slider.update({ value: testValue });

      expect(spy).toHaveBeenCalledWith(testValue);
    });
    it('Метод установки текущего значения диапазона должен быть вызван с соответствующим значением скорректированным относительно шага', () => {
      const range = new RangeStab();
      const spy = jest.spyOn(range, 'setCurrent');
      const slider: ISlider = new Slider([range], { step: 10 });
      const testValue = 15;
      const expectedValue = 20;

      slider.setValue(testValue);

      expect(spy).toHaveBeenCalledWith(expectedValue);
    });
    it('Метод установки текущего значения второго диапазона должен быть вызван при втором активном диапазоне', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      const range1Spy = jest.spyOn(range1, 'setCurrent');
      const range2Spy = jest.spyOn(range2, 'setCurrent');
      const slider: ISlider = new Slider([range1, range2], { active: 1 });
      const testValue = 5;

      slider.setValue(testValue);

      expect(range1Spy).not.toHaveBeenCalled();
      expect(range2Spy).toHaveBeenCalledWith(testValue);
    });
    it('Метод установки текущего значения диапазона должен быть вызван со значением 100, при установке процентного значения слайдера в 10 и абсолютном диапазоне [0, 1000]', () => {
      const range = new RangeStab();
      const spy = jest.spyOn(range, 'setCurrent');
      const slider: ISlider = new Slider([range]);
      slider.getMin = () => 0;
      slider.getMax = () => 1000;

      slider.setPerValue(10);

      expect(spy).toHaveBeenCalledWith(100);
    });
  });
  describe('Установка минимального интервала', () => {
    it('Метод установки текущего значения первого диапазона должен быть вызван со значением соответствующим значению минимального интервала в опциях', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      const spy = jest.spyOn(range1, 'setCurrent');
      range1.getMin = () => 10;
      range1.getCurrent = () => 20;
      range1.getMax = () => 30;
      range2.getMin = () => 20;
      range2.getCurrent = () => 30;
      range2.getMax = () => 40;
      const testValue = 15;

      const slider: ISlider = new Slider([range1, range2], { minInterval: testValue });

      expect(spy).toHaveBeenCalledWith(testValue);
    });
    it('Метод установки максимума обоих диапазонов должен быть вызван со значением максимума слайдера при значении минимального интервала в опциях большего максимума', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      const range1Spy = jest.spyOn(range1, 'setMax');
      const range2Spy = jest.spyOn(range1, 'setMax');
      range1.getMin = () => 10;
      range1.getCurrent = () => 20;
      range1.getMax = () => 30;
      range2.getMin = () => 20;
      range2.getCurrent = () => 30;
      range2.getMax = () => 40;
      const testValue = 45;

      const slider: ISlider = new Slider([range1, range2], { minInterval: testValue });

      expect(range1Spy).toHaveBeenCalledWith(slider.getMax());
      expect(range2Spy).toHaveBeenCalledWith(slider.getMax());
    });
    it('Метод установки максимума первого диапазона и текущего значения второго диапазона должны быть вызваны со значением минимального интервала в опциях', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      const range1Spy = jest.spyOn(range1, 'setMax');
      const range2Spy = jest.spyOn(range2, 'setCurrent');
      range1.getMin = () => 10;
      range1.getCurrent = () => 20;
      range1.getMax = () => 30;
      range2.getMin = () => 20;
      range2.getCurrent = () => 30;
      range2.getMax = () => 40;
      const testValue = 35;

      const slider: ISlider = new Slider([range1, range2], { minInterval: testValue });

      expect(range1Spy).toHaveBeenCalledWith(testValue);
      expect(range2Spy).toHaveBeenCalledWith(testValue);
    });
  });
  describe('Установка максимального интервала', () => {
    it('Метод установки текущего значения последнего диапазона должен быть вызван со значением соответствующим значению максимального интервала в опциях', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      const spy = jest.spyOn(range2, 'setCurrent');
      range1.getMin = () => 10;
      range1.getCurrent = () => 20;
      range1.getMax = () => 30;
      range2.getMin = () => 20;
      range2.getCurrent = () => 30;
      range2.getMax = () => 40;
      const testValue = 35;

      const slider: ISlider = new Slider([range1, range2], { maxInterval: testValue });

      expect(spy).toHaveBeenCalledWith(testValue);
    });
    it('Метод установки минимума обоих диапазонов должен быть вызван со значением минимума слайдера при значении максимального интервала в опциях меньше минимума', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      const range1Spy = jest.spyOn(range1, 'setMin');
      const range2Spy = jest.spyOn(range1, 'setMin');
      range1.getMin = () => 10;
      range1.getCurrent = () => 20;
      range1.getMax = () => 30;
      range2.getMin = () => 20;
      range2.getCurrent = () => 30;
      range2.getMax = () => 40;
      const testValue = 5;

      const slider: ISlider = new Slider([range1, range2], { maxInterval: testValue });

      expect(range1Spy).toHaveBeenCalledWith(slider.getMin());
      expect(range2Spy).toHaveBeenCalledWith(slider.getMin());
    });
    it('Метод установки минимума последнего диапазона и текущего значения первого диапазона должны быть вызваны со значением максимального интервала в опциях', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      const range1Spy = jest.spyOn(range1, 'setCurrent');
      const range2Spy = jest.spyOn(range2, 'setMin');
      range1.getMin = () => 10;
      range1.getCurrent = () => 20;
      range1.getMax = () => 30;
      range2.getMin = () => 20;
      range2.getCurrent = () => 30;
      range2.getMax = () => 40;
      const testValue = 15;

      const slider: ISlider = new Slider([range1, range2], { maxInterval: testValue });

      expect(range1Spy).toHaveBeenCalledWith(testValue);
      expect(range2Spy).toHaveBeenCalledWith(testValue);
    });
  });
  describe('Получение списка лимитов', () => {
    it('Должны соответствовать значениям диапазонов', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      range1.getMin = () => 10;
      range1.getCurrent = () => 20;
      range1.getMax = () => 30;
      range2.getMin = () => 20;
      range2.getCurrent = () => 30;
      range2.getMax = () => 40;
      const slider: ISlider = new Slider([range1, range2]);
      const expectedLimits = [10, 20, 30, 40];

      expect(slider.getLimits()).toEqual(expectedLimits);
    });
  });
  describe('Получение списка значений', () => {
    it('Должны быть равны текущим значениям диапазонов', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      range1.getCurrent = () => 20;
      range2.getCurrent = () => 30;
      const slider: ISlider = new Slider([range1, range2]);
      const expectedPerValues = [20, 30];

      expect(slider.getValues()).toEqual(expectedPerValues);
    });
  });
  describe('Получение списка процентных значений', () => {
    it('Должны соответствовать значениям диапазонов', () => {
      const [range1, range2] = [new RangeStab(), new RangeStab()];
      range1.getMin = () => 0;
      range1.getCurrent = () => 20;
      range1.getMax = () => 30;
      range2.getMin = () => 20;
      range2.getCurrent = () => 30;
      range2.getMax = () => 40;
      const slider: ISlider = new Slider([range1, range2]);
      const expectedPerValues = [50, 75];

      expect(slider.getPerValues()).toEqual(expectedPerValues);
    });
    it('Должен содержать 0', () => {
      const range = new RangeStab();
      range.getMin = () => 0;
      range.getMax = () => 0;
      const slider: ISlider = new Slider([range]);
      const expectedPerValues = [0];

      expect(slider.getPerValues()).toEqual(expectedPerValues);
    });
  });
  describe('Сдвиг значения вперед', () => {
    it('Метод установки текущего значения диапазона должен быть вызван с текущим значением увеличенным на шаг', () => {
      const range = new RangeStab();
      range.getCurrent = () => 15;
      const slider: ISlider = new Slider([range], { step: 5 });
      const spy = jest.spyOn(range, 'setCurrent');
      const expectedValue = 20;

      slider.stepForward();

      expect(spy).toHaveBeenCalledWith(expectedValue);
    });
  });
  describe('Сдвиг значения назад', () => {
    it('Метод установки текущего значения диапазона должен быть вызван с текущим значением уменьшенным на шаг', () => {
      const range = new RangeStab();
      range.getCurrent = () => 15;
      const slider: ISlider = new Slider([range], { step: 5 });
      const spy = jest.spyOn(range, 'setCurrent');
      const expectedValue = 10;

      slider.stepBackward();

      expect(spy).toHaveBeenCalledWith(expectedValue);
    });
  });
});
