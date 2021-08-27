import { IList, List } from '../List';

describe('Список', () => {
  // - подготовка
  it('Экземпляр должен быть создан', () => {
    // - действие
    const list: IList = new List();
    // - проверка
    expect(list).toBeDefined();
  });
  describe('Установка списка', () => {
    it('Должен быть пустым объектом Map, если в опциях передан пустой массив', () => {
      // - действие
      const list: IList = new List({ items: [] });
      // - проверка
      expect(list.getItems().size).toBe(0);
    });
    it('Без числовых значений должен быть плоским', () => {
      // - действие
      const list: IList = new List({ items: ['яблоко', 'груша'] });
      // - проверка
      expect(list.isFlat()).toBeTruthy();
    });
    it('С числовыми значениями не должен быть плоским', () => {
      // - действие
      const list: IList = new List({ items: ['яблоко', [10, 'груша']] });
      // - проверка
      expect(list.isFlat()).toBeFalsy();
    });
    it('Максимальный ключ должен быть равен null, при пустом списке в опциях', () => {
      // - действие
      const list: IList = new List({ items: [] });
      // - проверка
      expect(list.getMaxKey()).toBeNull();
    });
    it('Максимальный ключ должен быть равен 20', () => {
      const testValue = 20;
      // - действие
      const list: IList = new List({ items: [[testValue, 'a'], [10, 'b'], [0, 'c']] });
      // - проверка
      expect(list.getMaxKey()).toBe(testValue);
    });
    it('Минимальный ключ должен быть равен null, при пустом списке в опциях', () => {
      // - действие
      const list: IList = new List({ items: [] });
      // - проверка
      expect(list.getMinKey()).toBeNull();
    });
    it('Минимальный ключ должен быть равен 0', () => {
      const testValue = 0;
      // - действие
      const list: IList = new List({ items: [[20, 'a'], [10, 'b'], [testValue, 'c']] });
      // - проверка
      expect(list.getMinKey()).toBe(testValue);
    });
    it('Должен соответствовать списку в опциях обновления', () => {
      const list = new List({ items: ['a', 'b', 'c'] });
      const testItems = ['d', 'e', 'f', 'g'];
      const expectedItems = new Map([[0, 'd'], [1, 'e'], [2, 'f'], [3, 'g']]);
      // - действие
      list.update({ items: testItems });
      // - проверка
      expect(list.getItems()).toEqual(expectedItems);
    });
  });
  describe('Установка стартового ключа', () => {
    it('Минимальным ключом должен быть 0 по-умолчанию', () => {
      // - действие
      const list: IList = new List({ items: ['яблоко', 'груша'] });
      // - проверка
      expect(list.getMinKey()).toBe(0);
    });
    it('Минимальным ключом должно быть 5, при передаче в опциях стартового ключа', () => {
      const testValue = 5;
      // - действие
      const list: IList = new List({
        items: ['яблоко', 'груша'],
        startKey: testValue,
      });
      // - проверка
      expect(list.getMinKey()).toBe(testValue);
    });
    it('Список должен начинаться со стартового ключа в опциях обновления', () => {
      const list = new List();
      const testValue = 2;
      const expectedItems = new Map([[testValue, 'a'], [testValue + 1, 'b'], [testValue + 2, 'c']]);
      // - действие
      list.update({ items: ['a', 'b', 'c'], startKey: testValue });
      // - проверка
      expect(list.getItems()).toEqual(expectedItems);
    });
  });
  describe('Установка шага', () => {
    it('Максимальный ключ должен отражать, что шаг равен 4, при передачи этого шага в опциях', () => {
      const testValue = 4;
      // - действие
      const list: IList = new List({ items: ['яблоко', 'груша'], step: testValue });
      // - проверка
      expect(list.getMaxKey()).toBe(testValue);
    });
    it('Максимальный ключ должен отражать, что шаг равен 1 по-умолчанию, при некорректных опциях', () => {
      // - действие
      const list: IList = new List({ items: ['яблоко', 'груша'], step: -1 });
      // - проверка
      expect(list.getMaxKey()).toBe(1);
    });
    it('Максимальный ключ должен отражать, что элементы без числового значения идущие после элемента с числовым получают ключ в соответствии с шагом', () => {
      const testValue = 10;
      const testStep = 5;
      // - действие
      const list: IList = new List({
        items: ['яблоко', [testValue, 'груша'], 'абрикос'],
        step: testStep,
      });
      // - проверка
      expect(list.getMaxKey()).toBe(testValue + testStep);
    });
    it('Ключи списка должны отличаться на шаг в опциях обновления', () => {
      const list = new List();
      const testValue = 2;
      const expectedItems = new Map([[0, 'a'], [testValue, 'b'], [testValue * 2, 'c']]);
      // - действие
      list.update({ items: ['a', 'b', 'c'], step: testValue });
      // - проверка
      expect(list.getItems()).toEqual(expectedItems);
    });
  });
  describe('Получение имени', () => {
    it('Ближайшим к значению -5 должно быть яблоко', () => {
      // - действие
      const list: IList = new List({
        items: ['яблоко', [10, 'груша'], 'абрикос'],
        step: 5,
      });
      // - проверка
      expect(list.getClosestNameByValue(-5)).toBe('яблоко');
    });
    it('Ближайшим к значению 6 должна быть груша', () => {
      // - действие
      const list: IList = new List({
        items: ['яблоко', [10, 'груша'], 'абрикос'],
        step: 5,
      });
      // - проверка
      expect(list.getClosestNameByValue(6)).toBe('груша');
    });
    it('Ближайшим к значению 16 должен быть абрикос', () => {
      // - действие
      const list: IList = new List({
        items: ['яблоко', [10, 'груша'], 'абрикос'],
        step: 5,
      });
      // - проверка
      expect(list.getClosestNameByValue(16)).toBe('абрикос');
    });
    it('Ближайшим к значению 10 должна быть точно груша', () => {
      // - действие
      const list: IList = new List({
        items: ['яблоко', [10, 'груша'], 'абрикос'],
        step: 5,
      });
      // - проверка
      expect(list.getClosestNameByValue(10)).toBe('груша');
    });
  });
});
