import { List, TList } from "../List";

describe('Список', ()=>{

  describe('Инициализация', ()=>{

    describe('Без параметров - значение по-умолчанию', ()=>{
      let list: List;
      beforeAll(()=>{
        list = new List();
      });
      test('Поле items - пустой экземпляр Map', ()=>{
        expect(list.getItems()).toEqual(new Map());
      });
    });

    describe('C параметрами', ()=>{
      let config: TList, configCopy: TList, list: List;
      beforeAll(()=>{
        config = {
          items: ['яблоко', 'банан', 'абрикос', 'груша', 'киви']
        }
        configCopy = Object.assign({}, config);
        list = new List(config);
      });
      test ('Класс не изменяет объект переданный в параметрах', () => {
        expect(config).toEqual(configCopy);
      });
    });

    describe('Config: {items: яблоко, банан...}', ()=>{
      let config: TList, list: List;
      beforeAll(()=>{
        config = {
          items: ['яблоко', 'банан', 'абрикос', 'груша', 'киви']
        }
        list = new List(config);
      });
      test ('Элемент с ключом 0 - яблоко', () => {
        expect(list.getItems().get(0)).toBe('яблоко');
      });
      test ('Элемент с ключом 1 - банан', () => {
        expect(list.getItems().get(1)).toBe('банан');
      });
    });

    describe('Config: {items: яблоко, [2, банан], [20, абрикос], груша, [22, киви]}', ()=>{
      let config: TList, list: List;
      beforeAll(()=>{
        config = {
          items: ['яблоко', [2, 'банан'], [20, 'абрикос'], 'груша', [22, 'киви']]
        }
        list = new List(config);
      });
      test ('Элемент с ключом 0 - яблоко', () => {
        expect(list.getItems().get(0)).toBe('яблоко');
      });
      test ('Элемент с ключом 2 - банан', () => {
        expect(list.getItems().get(2)).toBe('банан');
      });
      test ('Элемент с ключом 20 - абрикос', () => {
        expect(list.getItems().get(20)).toBe('абрикос');
      });
      test ('Элемент с ключом 21 - груша', () => {
        expect(list.getItems().get(21)).toBe('груша');
      });
      test ('Элемент с ключом 22 - киви', () => {
        expect(list.getItems().get(22)).toBe('киви');
      });
    });

    describe('Config: {startKey: 33, items: яблоко, банан...}', ()=>{
      let config: TList, list: List;
      beforeAll(()=>{
        config = {
          items: ['яблоко', 'банан', 'абрикос', 'груша', 'киви'],
          startKey: 33,
        }
        list = new List(config);
      });
      test ('Элемент с ключом 33 - яблоко', () => {
        expect(list.getItems().get(33)).toBe('яблоко');
      });
      test ('Элемент с ключом 34 - банан', () => {
        expect(list.getItems().get(34)).toBe('банан');
      });
    });

    describe('Config: {startKey: 33, step: 10, items: яблоко, банан...}', ()=>{
      let config: TList, list: List;
      beforeAll(()=>{
        config = {
          items: ['яблоко', 'банан', 'абрикос', 'груша', 'киви'],
          startKey: 33,
          step: 10,
        }
        list = new List(config);
      });
      test ('Элемент с ключом 33 - яблоко', () => {
        expect(list.getItems().get(33)).toBe('яблоко');
      });
      test ('Элемент с ключом 43 - банан', () => {
        expect(list.getItems().get(43)).toBe('банан');
      });
    });

    describe('Config: {startKey: 33, step: 10, items: яблоко, [2, банан], [20, абрикос], груша, [22, киви]}', ()=>{
      let config: TList, list: List;
      beforeAll(()=>{
        config = {
          items: ['яблоко', [2, 'банан'], [20, 'абрикос'], 'груша', [22, 'киви']],
          startKey: 33,
          step: 10,
        }
        list = new List(config);
      });
      test ('Элемент с ключом 33 - яблоко', () => {
        expect(list.getItems().get(33)).toBe('яблоко');
      });
      test ('Элемент с ключом 2 - банан', () => {
        expect(list.getItems().get(2)).toBe('банан');
      });
      test ('Элемент с ключом 20 - абрикос', () => {
        expect(list.getItems().get(20)).toBe('абрикос');
      });
      test ('Элемент с ключом 43 - груша', () => {
        expect(list.getItems().get(43)).toBe('груша');
      });
      test ('Элемент с ключом 22 - киви', () => {
        expect(list.getItems().get(22)).toBe('киви');
      });
    });

    describe('Config: {step: 0, items: яблоко, банан...}', ()=>{
      let config: TList, list: List;
      beforeAll(()=>{
        config = {
          items: ['яблоко', 'банан', 'абрикос', 'груша', 'киви'],
          step: 0,
        }
        list = new List(config);
      });
      test ('Элемент с ключом 0 - яблоко', () => {
        expect(list.getItems().get(0)).toBe('яблоко');
      });
      test ('Элемент с ключом 1 - банан', () => {
        expect(list.getItems().get(1)).toBe('банан');
      });
    });

    describe('Config: {items: яблоко, [0, банан], абрикос, [1, груша], киви }', ()=>{
      let config: TList, list: List;
      beforeAll(()=>{
        config = {
          items: ['яблоко', [0,'банан'], 'абрикос', [1, 'груша'], 'киви']
        }
        list = new List(config);
      });
      test ('Элемент с ключом 0 - банан', () => {
        expect(list.getItems().get(0)).toBe('банан');
      });
      test ('Элемент с ключом 1 - груша', () => {
        expect(list.getItems().get(1)).toBe('груша');
      });
      test ('Элемент с ключом 3 - киви', () => {
        expect(list.getItems().get(2)).toBe('киви');
      });
    });
  });

  describe('Методы', ()=>{

    describe('При config: {startKey: 33, step: 10, items: яблоко, [2, банан], [20, абрикос], груша, [22, киви]}', ()=>{
      let config: TList, list: List;
      beforeAll(()=>{
        config = {
          items: ['яблоко', [2, 'банан'], [20, 'абрикос'], 'груша', [22, 'киви']],
          startKey: 33,
          step: 10,
        }
        list = new List(config);
      });
      test ('Минимальный ключ равен 2', () => {
        expect(list.getMinKey()).toBe(2);
      });
      test ('Максимальный ключ равен 43', () => {
        expect(list.getMaxKey()).toBe(43);
      });
      test ('Это НЕ плоский список', () => {
        expect(list.isFlat()).toBeFalsy;
      });
    });

    describe('Config: {items: яблоко, банан...}', ()=>{
      let config: TList, list: List;
      beforeAll(()=>{
        config = {
          items: ['яблоко', 'банан', 'абрикос', 'груша', 'киви']
        }
        list = new List(config);
      });
      test ('Минимальный ключ равен 0', () => {
        expect(list.getMinKey()).toBe(0);
      });
      test ('Максимальный ключ равен 4', () => {
        expect(list.getMaxKey()).toBe(4);
      });
      test ('Это плоский список', () => {
        expect(list.isFlat()).toBeTruthy;
      });
    });

  });
});