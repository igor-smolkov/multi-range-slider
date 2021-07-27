import { TMyJQuerySlider } from "../../TMyJQuerySlider";
import { TDisorderedItems } from "../List";
import { IModel, Model } from "../Model";

describe('Издатель и фасад модели', () => {
  // - подготовка
  it('Инстанс должен быть создан', () => {
    let model: IModel;
    // - действие
    model = new Model();
    // - проверка
    expect(model).toBeDefined();
  })
  it('Все подписчики должены быть оповещены после обновления', () => {
    const model: IModel = new Model();
    const subscriber1: jest.Mock = jest.fn();
    const subscriber2: jest.Mock = jest.fn();
    model.subscribe(subscriber1);
    model.subscribe(subscriber2);
    // - действие
    model.update();
    // - проверка
    expect(subscriber1).toBeCalledTimes(1);
    expect(subscriber2).toBeCalledTimes(1);
  })
  it('После отписки подписчик больше не уведомляется', () => {
    const model: IModel = new Model();
    const subscriber1: jest.Mock = jest.fn();
    const subscriber2: jest.Mock = jest.fn();
    model.subscribe(subscriber1);
    model.subscribe(subscriber2);
    // - действие
    model.update();
    model.unsubscribe(subscriber1);
    model.update();
    // - проверка
    expect(subscriber1).toBeCalledTimes(1);
    expect(subscriber2).toBeCalledTimes(2);
  })
  it('Конфигурация должна соответсвовать полному непротиворечивому набору опций модели', () => {
    const fullOptions: TMyJQuerySlider = {
      min: 10,
      max: 90,
      value: 40,
      step: 2,    
      orientation: 'vertical',
      isDouble: true,
      minInterval: 40,
      maxInterval: 60,
      limits: [10, 40, 60, 90],
      active: 0,
      withLabel: true,
      label: 'name',
      scale: 'numeric',
      list: [[10, 'яблоко'],[90, 'арбуз']],
      actuals: [1],
      lengthPx: 1000,
      withIndent: false,
    }
    let model: IModel;
    // - действие
    model = new Model(fullOptions);
    // - проверка
    expect(model.getConfig()).toEqual(fullOptions);
  })
  it('Конфигурация при отсутсвии опций должна соответствовать дефолтной', () => {
    const defaultOptions: TMyJQuerySlider = {
      min: 0,
      max: 100,
      value: 50,
      step: 1,
      orientation: 'horizontal',
      isDouble: false,
      minInterval: 50,
      maxInterval: 50,
      limits: [0, 50, 100],
      active: 0,
      withLabel: false,
      label: null,
      scale: null,
      list: [],
      actuals: [0],
      lengthPx: null,
      withIndent: true,
    }
    let model: IModel;
    // - действие
    model = new Model();
    // - проверка
    expect(model.getConfig()).toEqual(defaultOptions);
  })
  it('Лимиты при опции включения двойного слайдера должны отражать его дефолтное состояние', () => {
    const expectedLimits = [0, 25, 75, 100]
    let model: IModel;
    // - действие
    model = new Model({ isDouble: true });
    // - проверка
    expect(model.getConfig().limits).toEqual(expectedLimits);
  })
  it('Лимиты при задании минимального и максимального интервала должны отражать дефолтное состояние двойного слайдера с заданными значениями минимального и максимального интервала', () => {
    const testMinInterval = 47
    const testMaxInterval = 67
    const expectedLimits = [0, testMinInterval, testMaxInterval, 100]
    let model: IModel;
    // - действие
    model = new Model({ minInterval: testMinInterval, maxInterval: testMaxInterval });
    // - проверка
    expect(model.getConfig().limits).toEqual(expectedLimits);
  })
  it('Лимиты должны соответсвовать задаваемым лимитам в опциях', () => {
    const testLimits = [-100, -25, -5, 10, 30, 140]
    let model: IModel;
    // - действие
    model = new Model({ limits: testLimits });
    // - проверка
    expect(model.getConfig().limits).toEqual(testLimits);
  })
  it('Лимиты должны соответсвовать дефолтным при задании пустого массива', () => {
    const defaultLimits = [0, 50, 100];
    let model: IModel;
    // - действие
    model = new Model({ limits: [] });
    // - проверка
    expect(model.getConfig().limits).toEqual(defaultLimits);
  })
  it('При задании одного числа, лимиты должны отражать диапазон от 0 до этого числа. с текущим значением в сторону этого числа', () => {
    const testValue = 42
    const expectedLimits = [0, testValue, testValue];
    let model: IModel;
    // - действие
    model = new Model({ limits: [testValue] });
    // - проверка
    expect(model.getConfig().limits).toEqual(expectedLimits);
  })
  it('При задании двух чисел, лимиты должны отражать диапазон от первого числа до второго, с текущим значением в сторону второго числа', () => {
    const testValue1 = 42
    const testValue2 = 53
    const expectedLimits = [testValue1, testValue2, testValue2];
    let model: IModel;
    // - действие
    model = new Model({ limits: [testValue1, testValue2] });
    // - проверка
    expect(model.getConfig().limits).toEqual(expectedLimits);
  })
  it('Лимиты при опции включения двойного слайдера и заданном минимумом должны отражать его дефолтное состояние с заданным минимумом и минимальным интервалом', () => {
    const testValue = 12
    const expectedLimits = [testValue, testValue, 75, 100]
    let model: IModel;
    // - действие
    model = new Model({ isDouble: true, min: testValue });
    // - проверка
    expect(model.getConfig().limits).toEqual(expectedLimits);
  })
  it('Лимиты при опции включения двойного слайдера и заданном максимумом должны отражать его дефолтное состояние с заданным максимумом и максимальным интервалом', () => {
    const testValue = 42
    const expectedLimits = [0, 25, testValue, testValue]
    let model: IModel;
    // - действие
    model = new Model({ isDouble: true, max: testValue });
    // - проверка
    expect(model.getConfig().limits).toEqual(expectedLimits);
  })
  it('Лимиты при опции включения двойного слайдера, первом активном диапазоне и текущем значении должны отражать его дефолтное состояние с минимальным интервалом равным текущенму значению', () => {
    const testValue = 42
    const expectedLimits = [0, testValue, 75, 100]
    let model: IModel;
    // - действие
    model = new Model({ isDouble: true, value: testValue, active: 0 });
    // - проверка
    expect(model.getConfig().limits).toEqual(expectedLimits);
  })
  it('Лимиты при опции включения двойного слайдера, минимальном, максимальном и текущем значении должны отражать эти значения с минимальным интервалом равным минимуму', () => {
    const testMin = 11
    const testMax = 99
    const testValue = 42
    const expectedLimits = [testMin, testMin, testValue, testMax]
    let model: IModel;
    // - действие
    model = new Model({ isDouble: true, min: testMin, value: testValue, max: testMax });
    // - проверка
    expect(model.getConfig().limits).toEqual(expectedLimits);
  })
  it('Лимиты при опции включения двойного слайдера и текущем значении должны отражать его дефолтное состояние с максимальным интервалом равным текущему значению', () => {
    const testValue = 42
    const expectedLimits = [0, 25, testValue, 100]
    let model: IModel;
    // - действие
    model = new Model({ isDouble: true, value: testValue });
    // - проверка
    expect(model.getConfig().limits).toEqual(expectedLimits);
  })
  it('Лимиты при опции включения двойного слайдера, втором активном диапазоне и текущем значении должны отражать его дефолтное состояние с максимальным интервалом равным текущему значению', () => {
    const testValue = 42
    const expectedLimits = [0, 25, testValue, 100]
    let model: IModel;
    // - действие
    model = new Model({ isDouble: true, value: testValue, active: 1 });
    // - проверка
    expect(model.getConfig().limits).toEqual(expectedLimits);
  })
  it('Лимиты при опциях минимума, максимума, минимального и максимального интервала, должны отражать это состояние', () => {
    const testMin = 10;
    const testMax = 80;
    const testIntervalMin = 33;
    const testIntervalMax = 77;
    const expectedLimits = [testMin, testIntervalMin, testIntervalMax, testMax]
    let model: IModel;
    // - действие
    model = new Model({ min: testMin, max: testMax, minInterval: testIntervalMin, maxInterval: testIntervalMax });
    // - проверка
    expect(model.getConfig().limits).toEqual(expectedLimits);
  })
  it('При использовании простого списка имен в опциях, максимум должен отражать числовое значение последнего элемента в соответсвии с шагом', () => {
    const testStep = 3;
    const testList = ['яблоко', 'груша', 'апельсин', 'манго'];
    let model: IModel;
    // - действие
    model = new Model({ list: testList, step: testStep });
    // - проверка
    expect(model.getConfig().max).toBe((testList.length-1)*testStep);
  })
  it('При использовании списка имен с числовыми значениями, минимум должен отражать значение минимального элемента списка', () => {
    const testValue: number = -100;
    const testList: TDisorderedItems = [[testValue, 'яблоко'], 'груша', 'апельсин', 'манго'];
    let model: IModel;
    // - действие
    model = new Model({ list: testList });
    // - проверка
    expect(model.getConfig().min).toBe(testValue);
  })
  it('При использовании списка имен с числовыми значениями, максимум должен отражать значение максимального элемента списка', () => {
    const testValue: number = 200;
    const testList: TDisorderedItems = ['яблоко', 'груша', 'апельсин', [testValue,'манго']];
    let model: IModel;
    // - действие
    model = new Model({ list: testList });
    // - проверка
    expect(model.getConfig().max).toBe(testValue);
  })
  it('Конфигурация не меняется при обновлении без опций', () => {
    const model: IModel = new Model();
    const oldConfig = model.getConfig();
    // - действие
    model.update();
    // - проверка
    expect(model.getConfig()).toEqual(oldConfig);
  })
  it('Конфигурация полностью меняется при полном наборе других непротиворечащих опций', () => {
    const model: IModel = new Model();
    const oldConfig = model.getConfig();
    const newFullOptions: TMyJQuerySlider = {
      min: 10,
      max: 90,
      value: 40,
      step: 2,    
      orientation: 'vertical',
      isDouble: true,
      minInterval: 40,
      maxInterval: 60,
      limits: [10, 40, 60, 90],
      active: 0,
      withLabel: true,
      label: 'name',
      scale: 'numeric',
      list: [[10, 'яблоко'],[90, 'арбуз']],
      actuals: [1],
      lengthPx: 1000,
      withIndent: false,
    }
    // - действие
    model.update(newFullOptions);
    // - проверка
    expect(model.getConfig()).not.toEqual(oldConfig);
    expect(model.getConfig()).toEqual(newFullOptions);
  })
  it('Лимиты после обновления отражают изменение минимальных и максимальных интервалов', () => {
    const basicLimits = [10, 20, 30, 40]
    const testMin = 22;
    const testMax = 28;
    const expectedLimits = [testMin, testMin, testMax, testMax];
    const model: IModel = new Model({ limits: basicLimits });
    // - действие
    model.update({ min: testMin, max: testMax });
    // - проверка
    expect(model.getConfig().limits).toEqual(expectedLimits);
  })
  it('Текущее значение в конфигурации должно обновиться после установки текущего значения и быть равным ему', () => {
    const newValue = 44;
    const model: IModel = new Model();
    const oldValue = model.getConfig().value;
    // - действие
    model.setValue(newValue);
    // - проверка
    expect(model.getConfig().value).not.toBe(oldValue);
    expect(model.getConfig().value).toBe(newValue);
  })
  it('Текущее значение в конфигурации должно обновиться после установки 100% значения и быть равным максимуму', () => {
    const testPerValue = 100;
    const model: IModel = new Model();
    const oldValue = model.getConfig().value;
    // - действие
    model.setPerValue(testPerValue);
    // - проверка
    expect(model.getConfig().value).not.toBe(oldValue);
    expect(model.getConfig().value).toBe(model.getConfig().max);
  })
  it('Активный диапазон в конфигураци должен обновиться после установки активного диапазона и быть равным ему', () => {
    const testActive = 0;
    const model: IModel = new Model({ isDouble: true });
    const oldActive = model.getConfig().active;
    // - действие
    model.setActive(testActive);
    // - проверка
    expect(model.getConfig().active).not.toBe(oldActive);
    expect(model.getConfig().active).toBe(testActive);
  })
  it('Активный диапазон в конфигураци должен обновиться после установки активного диапазона близкого к значению 10 и равным индексу последнего диапазона', () => {
    const testValue = 10;
    const model: IModel = new Model({ isDouble: true });
    const oldActive = model.getConfig().active;
    // - действие
    model.setActiveCloseOfValue(testValue);
    // - проверка
    expect(model.getConfig().active).not.toBe(oldActive);
    expect(model.getConfig().active).toBe(0);
  })
})