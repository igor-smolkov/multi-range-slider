import { ILabelsList, LabelsList } from '../LabelsList';

describe('Список', () => {
  it('Экземпляр должен быть создан', () => {
    const labelsList: ILabelsList = new LabelsList();

    expect(labelsList).toBeDefined();
  });
  describe('Установка списка', () => {
    it('Должен быть пустым объектом Map, если в опциях передан пустой массив', () => {
      const labelsList: ILabelsList = new LabelsList({ labelsList: [] });

      expect(labelsList.getLabels().size).toBe(0);
    });
    it('Без числовых значений должен быть плоским', () => {
      const labelsList: ILabelsList = new LabelsList({ labelsList: ['яблоко', 'груша'] });

      expect(labelsList.isFlat()).toBeTruthy();
    });
    it('С числовыми значениями не должен быть плоским', () => {
      const labelsList: ILabelsList = new LabelsList({ labelsList: ['яблоко', [10, 'груша']] });

      expect(labelsList.isFlat()).toBeFalsy();
    });
    it('Максимальный ключ должен быть равен null, при пустом списке в опциях', () => {
      const labelsList: ILabelsList = new LabelsList({ labelsList: [] });

      expect(labelsList.getMaxKey()).toBeNull();
    });
    it('Максимальный ключ должен быть равен 20', () => {
      const testValue = 20;

      const labelsList: ILabelsList = new LabelsList({ labelsList: [[testValue, 'a'], [10, 'b'], [0, 'c']] });

      expect(labelsList.getMaxKey()).toBe(testValue);
    });
    it('Минимальный ключ должен быть равен null, при пустом списке в опциях', () => {
      const labelsList: ILabelsList = new LabelsList({ labelsList: [] });

      expect(labelsList.getMinKey()).toBeNull();
    });
    it('Минимальный ключ должен быть равен 0', () => {
      const testValue = 0;

      const labelsList: ILabelsList = new LabelsList({ labelsList: [[20, 'a'], [10, 'b'], [testValue, 'c']] });

      expect(labelsList.getMinKey()).toBe(testValue);
    });
    it('Должен соответствовать списку в опциях обновления', () => {
      const labelsList = new LabelsList({ labelsList: ['a', 'b', 'c'] });
      const testLabels = ['d', 'e', 'f', 'g'];
      const expectedLabels = new Map([[0, 'd'], [1, 'e'], [2, 'f'], [3, 'g']]);

      labelsList.update({ labelsList: testLabels });

      expect(labelsList.getLabels()).toEqual(expectedLabels);
    });
  });
  describe('Установка стартового ключа', () => {
    it('Минимальным ключом должен быть 0 по-умолчанию', () => {
      const labelsList: ILabelsList = new LabelsList({ labelsList: ['яблоко', 'груша'] });

      expect(labelsList.getMinKey()).toBe(0);
    });
    it('Минимальным ключом должно быть 5, при передаче в опциях стартового ключа', () => {
      const testValue = 5;

      const labelsList: ILabelsList = new LabelsList({
        labelsList: ['яблоко', 'груша'],
        startKey: testValue,
      });

      expect(labelsList.getMinKey()).toBe(testValue);
    });
    it('Список должен начинаться со стартового ключа в опциях обновления', () => {
      const labelsList = new LabelsList();
      const testValue = 2;
      const expectedLabels = new Map([[testValue, 'a'], [testValue + 1, 'b'], [testValue + 2, 'c']]);

      labelsList.update({ labelsList: ['a', 'b', 'c'], startKey: testValue });

      expect(labelsList.getLabels()).toEqual(expectedLabels);
    });
  });
  describe('Установка шага', () => {
    it('Максимальный ключ должен отражать, что шаг равен 4, при передачи этого шага в опциях', () => {
      const testValue = 4;

      const labelsList: ILabelsList = new LabelsList({ labelsList: ['яблоко', 'груша'], step: testValue });

      expect(labelsList.getMaxKey()).toBe(testValue);
    });
    it('Максимальный ключ должен отражать, что шаг равен 1 по-умолчанию, при некорректных опциях', () => {
      const labelsList: ILabelsList = new LabelsList({ labelsList: ['яблоко', 'груша'], step: -1 });

      expect(labelsList.getMaxKey()).toBe(1);
    });
    it('Максимальный ключ должен отражать, что элементы без числового значения идущие после элемента с числовым получают ключ в соответствии с шагом', () => {
      const testValue = 10;
      const testStep = 5;

      const labelsList: ILabelsList = new LabelsList({
        labelsList: ['яблоко', [testValue, 'груша'], 'абрикос'],
        step: testStep,
      });

      expect(labelsList.getMaxKey()).toBe(testValue + testStep);
    });
    it('Ключи списка должны отличаться на шаг в опциях обновления', () => {
      const labelsList = new LabelsList();
      const testValue = 2;
      const expectedLabels = new Map([[0, 'a'], [testValue, 'b'], [testValue * 2, 'c']]);

      labelsList.update({ labelsList: ['a', 'b', 'c'], step: testValue });

      expect(labelsList.getLabels()).toEqual(expectedLabels);
    });
  });
  describe('Получение имени', () => {
    it('Ближайшим к значению -5 должно быть яблоко', () => {
      const labelsList: ILabelsList = new LabelsList({
        labelsList: ['яблоко', [10, 'груша'], 'абрикос'],
        step: 5,
      });

      expect(labelsList.getClosestNameByValue(-5, 15)).toBe('яблоко');
    });
    it('Ближайшим к значению 6 должна быть груша', () => {
      const labelsList: ILabelsList = new LabelsList({
        labelsList: ['яблоко', [10, 'груша'], 'абрикос'],
        step: 5,
      });

      expect(labelsList.getClosestNameByValue(6, 15)).toBe('груша');
    });
    it('Ближайшим к значению 16 должен быть абрикос', () => {
      const labelsList: ILabelsList = new LabelsList({
        labelsList: ['яблоко', [10, 'груша'], 'абрикос'],
        step: 5,
      });

      expect(labelsList.getClosestNameByValue(16, 15)).toBe('абрикос');
    });
    it('Ближайшим к значению 10 должна быть точно груша', () => {
      const labelsList: ILabelsList = new LabelsList({
        labelsList: ['яблоко', [10, 'груша'], 'абрикос'],
        step: 5,
      });

      expect(labelsList.getClosestNameByValue(10, 15)).toBe('груша');
    });
  });
});
