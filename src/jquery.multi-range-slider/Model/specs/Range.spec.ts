import { IRange, Range } from '../Range';

describe('Диапазон', () => {
  it('Экземпляр должен быть создан', () => {
    const range: IRange = new Range();

    expect(range).toBeDefined();
  });
  describe('Инициализация диапазона', () => {
    it('Минимум должен быть равен максимуму при некорректных опциях', () => {
      const range: IRange = new Range({ min: 20, max: 10 });

      expect(range.getMin()).toBe(range.getMax());
    });
    it('Текущее значение должно быть 50 по-умолчанию', () => {
      const range: IRange = new Range();

      expect(range.getCurrent()).toBe(50);
    });
    it('Текущее значение должно быть равно максимальному, когда не задано в опциях при заданных минимуме и максимуме', () => {
      const range: IRange = new Range({ min: 10, max: 20 });

      expect(range.getCurrent()).toBe(range.getMax());
    });
  });
  describe('Установка текущего значения', () => {
    it('Должно быть равно 14', () => {
      const testValue = 14;

      const range: IRange = new Range({ min: 10, max: 20, current: testValue });

      expect(range.getCurrent()).toBe(testValue);
    });
    it('Должно быть равно минимальному, когда меньше минимума', () => {
      const range: IRange = new Range({ min: 10, max: 20, current: 5 });

      expect(range.getCurrent()).toBe(range.getMin());
    });
    it('Должно быть равно максимальному, когда больше максимума', () => {
      const range: IRange = new Range({ min: 10, max: 20, current: 25 });

      expect(range.getCurrent()).toBe(range.getMax());
    });
  });
  describe('Установка минимума', () => {
    it('Должен быть установлен в 16', () => {
      const range: IRange = new Range();
      const oldMin = range.getMin();
      const testValue = 16;

      range.setMin(testValue);

      expect(range.getMin()).not.toBe(oldMin);
      expect(range.getMin()).toBe(testValue);
    });
    it('Не должен быть установлен, если он больше максимума', () => {
      const range: IRange = new Range({ min: 10, max: 20 });
      const oldMin = range.getMin();
      const testValue = 26;

      range.setMin(testValue);

      expect(range.getMin()).toBe(oldMin);
      expect(range.getMin()).not.toBe(testValue);
    });
    it('Текущее значение не должно измениться, если новый минимум меньше его', () => {
      const range: IRange = new Range();
      const oldCurrent = range.getCurrent();
      const testValue = -16;

      range.setMin(testValue);

      expect(range.getCurrent()).toBe(oldCurrent);
    });
    it('Текущее значение должно быть равно минимуму, если новый минимум больше его', () => {
      const range: IRange = new Range({ min: 10, max: 20, current: 15 });
      const oldCurrent = range.getCurrent();
      const testValue = 16;

      range.setMin(testValue);

      expect(range.getCurrent()).not.toBe(oldCurrent);
      expect(range.getCurrent()).toBe(range.getMin());
    });
  });
  describe('Установка максимума', () => {
    it('Должен быть установлен в 70', () => {
      const range: IRange = new Range();
      const oldMax = range.getMax();
      const testValue = 70;

      range.setMax(testValue);

      expect(range.getMax()).not.toBe(oldMax);
      expect(range.getMax()).toBe(testValue);
    });
    it('Не должен быть установлен, если он меньше минимума', () => {
      const range: IRange = new Range({ min: 10, max: 20 });
      const oldMax = range.getMax();
      const testValue = 5;

      range.setMax(testValue);

      expect(range.getMax()).toBe(oldMax);
      expect(range.getMax()).not.toBe(testValue);
    });
    it('Текущее значение не должно измениться, если новый максимум больше его', () => {
      const range: IRange = new Range({ min: 10, max: 20, current: 15 });
      const oldCurrent = range.getCurrent();
      const testValue = 16;

      range.setMax(testValue);

      expect(range.getCurrent()).toBe(oldCurrent);
    });
    it('Текущее значение должно быть равно максимуму, если новый максимум больше его', () => {
      const range: IRange = new Range({ min: 10, max: 20, current: 15 });
      const oldCurrent = range.getCurrent();
      const testValue = 12;

      range.setMax(testValue);

      expect(range.getCurrent()).not.toBe(oldCurrent);
      expect(range.getCurrent()).toBe(range.getMax());
    });
  });
});
