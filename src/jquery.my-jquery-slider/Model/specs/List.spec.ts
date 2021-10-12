import { IList, List } from '../List';

describe('Список', () => {
  it('Экземпляр должен быть создан', () => {
    const list: IList = new List();

    expect(list).toBeDefined();
  });
  describe('Установка списка', () => {
    it('Должен быть пустым объектом Map, если в опциях передан пустой массив', () => {
      const list: IList = new List({ items: [] });

      expect(list.getItems().size).toBe(0);
    });
    it('Без числовых значений должен быть плоским', () => {
      const list: IList = new List({ items: ['яблоко', 'груша'] });

      expect(list.isFlat()).toBeTruthy();
    });
    it('С числовыми значениями не должен быть плоским', () => {
      const list: IList = new List({ items: ['яблоко', [10, 'груша']] });

      expect(list.isFlat()).toBeFalsy();
    });
    it('Максимальный ключ должен быть равен null, при пустом списке в опциях', () => {
      const list: IList = new List({ items: [] });

      expect(list.getMaxKey()).toBeNull();
    });
    it('Максимальный ключ должен быть равен 20', () => {
      const testValue = 20;

      const list: IList = new List({ items: [[testValue, 'a'], [10, 'b'], [0, 'c']] });

      expect(list.getMaxKey()).toBe(testValue);
    });
    it('Минимальный ключ должен быть равен null, при пустом списке в опциях', () => {
      const list: IList = new List({ items: [] });

      expect(list.getMinKey()).toBeNull();
    });
    it('Минимальный ключ должен быть равен 0', () => {
      const testValue = 0;

      const list: IList = new List({ items: [[20, 'a'], [10, 'b'], [testValue, 'c']] });

      expect(list.getMinKey()).toBe(testValue);
    });
    it('Должен соответствовать списку в опциях обновления', () => {
      const list = new List({ items: ['a', 'b', 'c'] });
      const testItems = ['d', 'e', 'f', 'g'];
      const expectedItems = new Map([[0, 'd'], [1, 'e'], [2, 'f'], [3, 'g']]);

      list.update({ items: testItems });

      expect(list.getItems()).toEqual(expectedItems);
    });
  });
  describe('Установка стартового ключа', () => {
    it('Минимальным ключом должен быть 0 по-умолчанию', () => {
      const list: IList = new List({ items: ['яблоко', 'груша'] });

      expect(list.getMinKey()).toBe(0);
    });
    it('Минимальным ключом должно быть 5, при передаче в опциях стартового ключа', () => {
      const testValue = 5;

      const list: IList = new List({
        items: ['яблоко', 'груша'],
        startKey: testValue,
      });

      expect(list.getMinKey()).toBe(testValue);
    });
    it('Список должен начинаться со стартового ключа в опциях обновления', () => {
      const list = new List();
      const testValue = 2;
      const expectedItems = new Map([[testValue, 'a'], [testValue + 1, 'b'], [testValue + 2, 'c']]);

      list.update({ items: ['a', 'b', 'c'], startKey: testValue });

      expect(list.getItems()).toEqual(expectedItems);
    });
  });
  describe('Установка шага', () => {
    it('Максимальный ключ должен отражать, что шаг равен 4, при передачи этого шага в опциях', () => {
      const testValue = 4;

      const list: IList = new List({ items: ['яблоко', 'груша'], step: testValue });

      expect(list.getMaxKey()).toBe(testValue);
    });
    it('Максимальный ключ должен отражать, что шаг равен 1 по-умолчанию, при некорректных опциях', () => {
      const list: IList = new List({ items: ['яблоко', 'груша'], step: -1 });

      expect(list.getMaxKey()).toBe(1);
    });
    it('Максимальный ключ должен отражать, что элементы без числового значения идущие после элемента с числовым получают ключ в соответствии с шагом', () => {
      const testValue = 10;
      const testStep = 5;

      const list: IList = new List({
        items: ['яблоко', [testValue, 'груша'], 'абрикос'],
        step: testStep,
      });

      expect(list.getMaxKey()).toBe(testValue + testStep);
    });
    it('Ключи списка должны отличаться на шаг в опциях обновления', () => {
      const list = new List();
      const testValue = 2;
      const expectedItems = new Map([[0, 'a'], [testValue, 'b'], [testValue * 2, 'c']]);

      list.update({ items: ['a', 'b', 'c'], step: testValue });

      expect(list.getItems()).toEqual(expectedItems);
    });
  });
  describe('Получение имени', () => {
    it('Ближайшим к значению -5 должно быть яблоко', () => {
      const list: IList = new List({
        items: ['яблоко', [10, 'груша'], 'абрикос'],
        step: 5,
      });

      expect(list.getClosestNameByValue(-5, 15)).toBe('яблоко');
    });
    it('Ближайшим к значению 6 должна быть груша', () => {
      const list: IList = new List({
        items: ['яблоко', [10, 'груша'], 'абрикос'],
        step: 5,
      });

      expect(list.getClosestNameByValue(6, 15)).toBe('груша');
    });
    it('Ближайшим к значению 16 должен быть абрикос', () => {
      const list: IList = new List({
        items: ['яблоко', [10, 'груша'], 'абрикос'],
        step: 5,
      });

      expect(list.getClosestNameByValue(16, 15)).toBe('абрикос');
    });
    it('Ближайшим к значению 10 должна быть точно груша', () => {
      const list: IList = new List({
        items: ['яблоко', [10, 'груша'], 'абрикос'],
        step: 5,
      });

      expect(list.getClosestNameByValue(10, 15)).toBe('груша');
    });
  });
});
