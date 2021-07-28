import { IList, List } from "../List";

describe('Список', () => {
  // - подготовка
  it('Инстанс должен быть создан', () => {
    let list: IList;
    // - действие
    list = new List();
    // - проверка
    expect(list).toBeDefined();
  })
  it('Максимальный ключ должен отражать, что шаг равен 4, при передачи этого шага в опциях', () => {
    const testValue = 4;
    let list: IList;
    // - действие
    list = new List({ items:['яблоко', 'груша'], step: testValue });
    // - проверка
    expect(list.getMaxKey()).toBe(testValue);
  })
  it('Максимальный ключ должен отражать, что шаг равен 1 по-умолчанию, при некорректных опциях', () => {
    let list: IList;
    // - действие
    list = new List({ items:['яблоко', 'груша'], step: -1 });
    // - проверка
    expect(list.getMaxKey()).toBe(1);
  })
  it('Список должен быть пустым объектом Map, если в опциях передан пустой массив', () => {
    let list: IList;
    // - действие
    list = new List({ items:[] });
    // - проверка
    expect(list.getItems().size).toBe(0);
  })
  it('Минимальным ключом должен быть 0 по-умолчанию', () => {
    let list: IList;
    // - действие
    list = new List({ items:['яблоко', 'груша'] });
    // - проверка
    expect(list.getMinKey()).toBe(0);
  })
  it('Минимальным ключом должно быть 5, при передаче в опциях стартового ключа', () => {
    const testValue = 5;
    let list: IList;
    // - действие
    list = new List({ 
      items:['яблоко', 'груша'], 
      startKey: testValue 
    });
    // - проверка
    expect(list.getMinKey()).toBe(testValue);
  })
  it('Список без числовых значений должен быть полоским', () => {
    let list: IList;
    // - действие
    list = new List({ items:['яблоко', 'груша'] });
    // - проверка
    expect(list.isFlat()).toBeTruthy;
  })
  it('Список с числовыми значениями не должен быть полоским', () => {
    let list: IList;
    // - действие
    list = new List({ items:['яблоко', [10, 'груша']] });
    // - проверка
    expect(list.isFlat()).toBeFalsy;
  })
  it('Максимальный ключ должен отражать, что элементы без числового значения идущие после элемента с числовым получают ключ в соответсвии с шагом', () => {
    let list: IList;
    const testValue = 10;
    const testStep = 5;
    // - действие
    list = new List({ 
      items:['яблоко', [testValue, 'груша'], 'абрикос'],
      step: testStep,
    });
    // - проверка
    expect(list.getMaxKey()).toBe(testValue + testStep);
  })
  it('Ближайшим к значению -5 должно быть яблоко', () => {
    let list: IList;
    // - действие
    list = new List({ 
      items:['яблоко', [10, 'груша'], 'абрикос'],
      step: 5,
    });
    // - проверка
    expect(list.getClosestNameByValue(-5)).toBe('яблоко');
  })
  it('Ближайшим к значению 6 должна быть груша', () => {
    let list: IList;
    // - действие
    list = new List({ 
      items:['яблоко', [10, 'груша'], 'абрикос'],
      step: 5,
    });
    // - проверка
    expect(list.getClosestNameByValue(6)).toBe('груша');
  })
  it('Ближайшим к значению 16 должен быть абрикос', () => {
    let list: IList;
    // - действие
    list = new List({ 
      items:['яблоко', [10, 'груша'], 'абрикос'],
      step: 5,
    });
    // - проверка
    expect(list.getClosestNameByValue(16)).toBe('абрикос');
  })
  it('Ближайшим к значению 10 должна быть точно груша', () => {
    let list: IList;
    // - действие
    list = new List({ 
      items:['яблоко', [10, 'груша'], 'абрикос'],
      step: 5,
    });
    // - проверка
    expect(list.getClosestNameByValue(10)).toBe('груша');
  })
  it('Максимальный ключ должен быть равен null, при пустом списке в опциях', () => {
    let list: IList;
    // - действие
    list = new List({ items: [] });
    // - проверка
    expect(list.getMaxKey()).toBeNull();
  })
  it('Максимальный ключ должен быть равен 20', () => {
    const testValue = 20;
    let list: IList;
    // - действие
    list = new List({ items: [[testValue, 'a'], [10, 'b'], [0, 'c']] });
    // - проверка
    expect(list.getMaxKey()).toBe(testValue);
  })
  it('Минимальный ключ должен быть равен null, при пустом списке в опциях', () => {
    let list: IList;
    // - действие
    list = new List({ items: [] });
    // - проверка
    expect(list.getMinKey()).toBeNull();
  })
  it('Минимальный ключ должен быть равен 0', () => {
    const testValue = 0;
    let list: IList;
    // - действие
    list = new List({ items: [[20, 'a'], [10, 'b'], [testValue, 'c']] });
    // - проверка
    expect(list.getMinKey()).toBe(testValue);
  })
})