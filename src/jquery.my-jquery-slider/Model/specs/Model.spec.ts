/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable lines-between-class-members */
/* eslint-disable no-useless-return */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
import TMyJQuerySlider from '../../TMyJQuerySlider';
import { IList, TOrderedItems } from '../List';
import { IModel, Model } from '../Model';
import { ISlider } from '../Slider';
import { Range } from '../Range';

// - подготовка
let sliderStateStab: TMyJQuerySlider;
class SliderStab implements ISlider {
  update(): void {}
  getMin(): number { return sliderStateStab.min; }
  setMin(): number { return; }
  getMax(): number { return sliderStateStab.max; }
  setMax(): number { return; }
  getValue(): number { return; }
  setValue(): number { return; }
  setPerValue(): number { return; }
  getStep(): number { return sliderStateStab.step; }
  getMinInterval(): number { return; }
  getMaxInterval(): number { return; }
  getActualRanges(): number[] { return; }
  getActive(): number { return; }
  setActive(): number { return; }
  setActiveCloseOfValue(): number { return; }
  getPerValues(): number[] { return; }
  getLimits(): number[] { return; }
  isDouble(): boolean { return; }
}
class ListStab implements IList {
  update(): void {}
  getItems(): TOrderedItems { return new Map(); }
  getMinKey(): number { return; }
  getMaxKey(): number { return; }
  isFlat(): boolean { return; }
  getClosestNameByValue(): string { return; }
}

jest.mock('../Slider', () => ({ Slider: jest.fn().mockImplementation(() => new SliderStab()) }));
jest.mock('../Range');
const RangeMock = Range as jest.MockedClass<typeof Range>;
jest.mock('../List', () => ({ List: jest.fn().mockImplementation(() => new ListStab()) }));

describe('Издатель и фасад модели', () => {
  beforeEach(() => { sliderStateStab = { min: 0, max: 100, step: 1 }; });
  afterEach(() => { RangeMock.mockClear(); });
  it('Экземпляр должен быть создан', () => {
    // - действие
    const model: IModel = new Model();
    // - проверка
    expect(model).toBeDefined();
  });
  describe('Конфигурирование диапазонов', () => {
    beforeEach(() => { sliderStateStab = { min: 0, max: 100, step: 1 }; });
    afterEach(() => { RangeMock.mockClear(); });
    it('Диапазон должен быть вызван один раз, при отсутствии опций', () => {
      // - действие
      const model: IModel = new Model();
      // - проверка
      expect(RangeMock).toHaveBeenCalledTimes(1);
    });
    it('Диапазон должен быть вызван два раза, при опции двойного слайдера', () => {
      // - действие
      const model: IModel = new Model({ isDouble: true });
      // - проверка
      expect(RangeMock).toHaveBeenCalledTimes(2);
    });
    it('Диапазон должен быть вызван три раза, при опции лимитов с 5 значениями', () => {
      const min = 0;
      const max = 100;
      sliderStateStab = { min, max, step: 1 };
      // - действие
      const model: IModel = new Model({ limits: [min, 20, 30, 40, max] });
      // - проверка
      expect(RangeMock).toHaveBeenCalledTimes(3);
    });
    it('Диапазон должен быть вызван два раза, при опции минимального и максимального интервала', () => {
      // - действие
      const model: IModel = new Model({ minInterval: 20, maxInterval: 30 });
      // - проверка
      expect(RangeMock).toHaveBeenCalledTimes(2);
    });
    it('Диапазон должен быть вызван один раз, при опции лимитов с одним значением', () => {
      const min = 0;
      const max = 100;
      sliderStateStab = { min, max, step: 1 };
      // - действие
      const model: IModel = new Model({ limits: [max] });
      // - проверка
      expect(RangeMock).toHaveBeenCalledTimes(1);
    });
    it('Диапазон должен быть вызван один раз, при опции лимитов без значений', () => {
      // - действие
      const model: IModel = new Model({ limits: [] });
      // - проверка
      expect(RangeMock).toHaveBeenCalledTimes(1);
    });
    it('Первый диапазон должен быть вызван с текущим значением равным значению в опциях, при опции первого активного диапазона и двойного слайдера', () => {
      const value = 13;
      const maxInterval = 90;
      const min = 0;
      const max = 100;
      sliderStateStab = { min, max, step: 1 };
      // - действие
      const model: IModel = new Model({
        isDouble: true,
        active: 0,
        value,
        min,
        max,
        maxInterval,
      });
      // - проверка
      expect(RangeMock).toHaveBeenNthCalledWith(1, { current: value, min, max: maxInterval });
    });
    it('Второй диапазон должен быть вызван с текущим значением равным значению в опциях, при опции второго активного диапазона и двойного слайдера', () => {
      const value = 13;
      const minInterval = 90;
      const min = 0;
      const max = 100;
      sliderStateStab = { min, max, step: 1 };
      // - действие
      const model: IModel = new Model({
        isDouble: true,
        active: 1,
        value,
        min,
        max,
        minInterval,
      });
      // - проверка
      expect(RangeMock).toHaveBeenNthCalledWith(2, { current: value, min: minInterval, max });
    });
    it('Диапазон должен быть вызван с текущим значением равным максимуму в опциях, при отсутствии текущего значения и наличии минимума и максимума в опциях', () => {
      const min = 0;
      const max = 100;
      sliderStateStab = { min, max, step: 1 };
      // - действие
      const model: IModel = new Model({ min, max });
      // - проверка
      expect(RangeMock).toHaveBeenCalledWith({ current: max, min, max });
    });
    it('Диапазон должен быть вызван с текущим значением в опциях', () => {
      const value = 17;
      const min = 0;
      const max = 100;
      sliderStateStab = { min, max, step: 1 };
      // - действие
      const model: IModel = new Model({ value, min, max });
      // - проверка
      expect(RangeMock).toHaveBeenCalledWith({ current: value, min, max });
    });
  });
  describe('Настройка слайдера в соответствии со списком', () => {
    it('Вызывается установка минимального значения слайдера со значением минимального ключа списка, когда это значение меньше минимума', () => {
      const testKey = 5;
      sliderStateStab = { min: 10, max: 100, step: 1 };
      ListStab.prototype.getMinKey = () => testKey;
      const spy = jest.spyOn(SliderStab.prototype, 'setMin');
      // - действие
      const model: IModel = new Model();
      // - проверка
      expect(spy).toHaveBeenCalledWith(testKey);
    });
    it('Вызывается установка максимального значения слайдера со значением максимального ключа списка, когда это значение больше максимума', () => {
      const testKey = 500;
      sliderStateStab = { min: 10, max: 100, step: 1 };
      ListStab.prototype.getMaxKey = () => testKey;
      const spy = jest.spyOn(SliderStab.prototype, 'setMax');
      // - действие
      const model: IModel = new Model();
      // - проверка
      expect(spy).toHaveBeenCalledWith(testKey);
    });
  });
  describe('Перенастройка при обновлении', () => {
    beforeEach(() => { sliderStateStab = { min: 0, max: 100, step: 1 }; });
    afterEach(() => { RangeMock.mockClear(); });
    it('Диапазон должен быть вызван два раза, после обновления с опцией двойного слайдера', () => {
      const model: IModel = new Model();
      RangeMock.mockClear();
      // - действие
      model.update({ isDouble: true });
      // - проверка
      expect(RangeMock).toHaveBeenCalledTimes(2);
    });
    it('Диапазон должен быть вызван три раза, после обновления с опцией лимитов с 5 значениями', () => {
      const model: IModel = new Model();
      RangeMock.mockClear();
      // - действие
      model.update({ limits: [1, 2, 3, 4, 5] });
      // - проверка
      expect(RangeMock).toHaveBeenCalledTimes(3);
    });
    it('Должен быть вызван метод обновления слайдера, после обновления с опциями не меняющими число диапазонов', () => {
      const spy = jest.spyOn(SliderStab.prototype, 'update');
      const model: IModel = new Model();
      // - действие
      model.update({ value: 10 });
      // - проверка
      expect(spy).toHaveBeenCalled();
    });
    it('Должен быть вызван метод обновления списка, после обновления с опцией списка', () => {
      const spy = jest.spyOn(ListStab.prototype, 'update');
      const model: IModel = new Model();
      // - действие
      model.update({ list: ['a', 'b', 'c'] });
      // - проверка
      expect(spy).toHaveBeenCalled();
    });
  });
  describe('Оповещение подписчиков', () => {
    it('Все подписчики должны быть оповещены после обновления', () => {
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
    });
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
    });
    it('Подписчик должен быть уведомлен после установки значения', () => {
      const model: IModel = new Model();
      const subscriber: jest.Mock = jest.fn();
      model.subscribe(subscriber);
      // - действие
      model.setValue(12);
      // - проверка
      expect(subscriber).toBeCalledTimes(1);
    });
    it('Подписчик должен быть уведомлен после установки процентного значения', () => {
      const model: IModel = new Model();
      const subscriber: jest.Mock = jest.fn();
      model.subscribe(subscriber);
      // - действие
      model.setPerValue(12);
      // - проверка
      expect(subscriber).toBeCalledTimes(1);
    });
    it('Подписчик должен быть уведомлен после выбора диапазона', () => {
      const model: IModel = new Model();
      const subscriber: jest.Mock = jest.fn();
      model.subscribe(subscriber);
      // - действие
      model.setActive(0);
      // - проверка
      expect(subscriber).toBeCalledTimes(1);
    });
    it('Подписчик должен быть уведомлен после выбора диапазона близкого к значению', () => {
      const model: IModel = new Model();
      const subscriber: jest.Mock = jest.fn();
      model.subscribe(subscriber);
      // - действие
      model.setActiveCloseOfValue(10);
      // - проверка
      expect(subscriber).toBeCalledTimes(1);
    });
  });
  it('Значение в конфигурации не зависящее от состояния объектов должно быть равно переданному в опциях', () => {
    const options: TMyJQuerySlider = { orientation: 'vertical' };
    const model: IModel = new Model(options);
    // - действие / проверка
    expect(model.getConfig().orientation).toBe(options.orientation);
    expect(model.getConfig()).not.toBe(options);
  });
});
