import { Model, IModel } from '../Model'
import { List, IList } from '../List'

describe('Фасад и издатель модели', () => {

  describe('Инициализация', () => {

    describe('По-умолчанию', () => {
      let model: IModel = new Model();
  
      test('Лимиты по-умолчанию: [0, 50, 100]', () => {
        expect(model.getLimits()).toEqual([0, 50, 100])
      });
    });
  
    describe('С плоским списком', () => {
      let model: IModel = new Model({ list: ['яблоко', 'абрикос', 'груша', 'тыква'] });
      
      test('Абсолютный макcимум равен 3', () => {
        expect(model.getMax()).toBe(3);
      });
      test('Абсолютный минимум равен 0', () => {
        expect(model.getMin()).toBe(0);
      });
    });
  
    describe('Со списком', () => {
      let list: IList = new List ({ items: ['яблоко', 'абрикос', [-10, 'груша'], 'тыква'] });
      let model: IModel = new Model({ list: ['яблоко', 'абрикос', [-10, 'груша'], 'тыква'] });
  
      test('Списки равны', () => {
        expect(model.getList()).toEqual(list.getItems());
      });
    }); 

    describe('C лимитами [0, 10, 20, 30]', () => {
      let model: IModel = new Model({ limits: [0, 10, 20, 30] });
  
      test('Лимиты должны быть: [0, 10, 20, 30]', () => {
        expect(model.getLimits()).toEqual([0, 10, 20, 30])
      });
    });

    describe('C параметрами: {min: 0, max: 30, minInterval: 10, maxInterval: 20}', () => {
      let model: IModel = new Model({ min: 0, max: 30, minInterval: 10, maxInterval: 20 });
  
      test('Лимиты должны быть: [0, 10, 20, 30]', () => {
        expect(model.getLimits()).toEqual([0, 10, 20, 30])
      });
    });

    describe('C параметрами: {max: 30, minInterval: 10, maxInterval: 20}', () => {
      let model: IModel = new Model({ max: 30, minInterval: 10, maxInterval: 20 });
  
      test('Лимиты должны быть: [0, 10, 20, 30]', () => {
        expect(model.getLimits()).toEqual([0, 10, 20, 30])
      });
    });

    describe('C параметром: {isDouble: true}', () => {
      let model: IModel = new Model({ isDouble: true });
  
      test('Лимиты должны быть: [0, 25, 75, 100]', () => {
        expect(model.getLimits()).toEqual([0, 25, 75, 100])
      });
    });

    describe('C параметрами: {isDouble: true, value: 42}', () => {
      let model: IModel = new Model({ isDouble: true, value: 42 });
  
      test('Лимиты должны быть: [0, 42, 75, 100]', () => {
        expect(model.getLimits()).toEqual([0, 42, 75, 100])
      });
    });

    describe('C параметрами: {isDouble: true, value: 42, active: 0}', () => {
      let model: IModel = new Model({ isDouble: true, value: 42, active: 0 });
  
      test('Лимиты должны быть: [0, 42, 75, 100]', () => {
        expect(model.getLimits()).toEqual([0, 42, 75, 100])
      });
    });

    describe('C параметрами: {isDouble: true, value: 42, active: 1}', () => {
      let model: IModel = new Model({ isDouble: true, value: 42, active: 1 });
  
      test('Лимиты должны быть: [0, 25, 42, 100]', () => {
        expect(model.getLimits()).toEqual([0, 25, 42, 100])
      });
    });

    describe('C параметрами: {isDouble: true, active: 1}', () => {
      let model: IModel = new Model({ isDouble: true, active: 1 });
  
      test('Лимиты должны быть: [0, 25, 75, 100]', () => {
        expect(model.getLimits()).toEqual([0, 25, 75, 100]);
      });
    });

    describe('C параметрами: {isDouble: true, min: -100, max: 200}', () => {
      let model: IModel = new Model({ isDouble: true, min: -100, max: 200 });
  
      test('Лимиты должны быть: [-100, -100, 200, 200]', () => {
        expect(model.getLimits()).toEqual([-100, -100, 200, 200]);
      });
    });

    describe('C пустым списком лимитов', () => {
      let model: IModel = new Model({ limits: [] });
  
      test('Лимиты должны быть: [0, 50, 100]', () => {
        expect(model.getLimits()).toEqual([0, 50, 100]);
      });
    });

    describe('C одним лимитом', () => {
      let model: IModel = new Model({ limits: [42] });
  
      test('Лимиты должны быть: [0, 42, 42]', () => {
        expect(model.getLimits()).toEqual([0, 42, 42]);
      });
    });

    describe('C двумя лимитами', () => {
      let model: IModel = new Model({ limits: [42, 99] });
  
      test('Лимиты должны быть: [42, 99, 99]', () => {
        expect(model.getLimits()).toEqual([42, 99, 99]);
      });
    });

    describe('C шагом', () => {
      let model: IModel = new Model({ step: 0.5 });
  
      test('Шаг должн быть: 0.5', () => {
        expect(model.getStep()).toBe(0.5);
      });
    });

    describe('Cо списком актуальных диапазонов', () => {
      let model: IModel = new Model({ limits: [1, 2, 3, 4, 5, 6, 7, 8], actuals:[1.2, 2, 3, 5, -10] });
  
      test('Список должен быть: [2, 3, 5]', () => {
        expect(model.getActuals()).toEqual([2, 3, 5]);
      });
    });

    describe('C параметрами-свойствами', () => {
      let model: IModel = new Model({ orientation: 'vertical', withLabel: true, withIndent: false });
  
      test('Ориентация из конфига должна быть вертикальной', () => {
        expect(model.getConfig().orientation).toBe('vertical');
      });

      test('Флаг подписей из конфига должен быть истинным', () => {
        expect(model.getConfig().withLabel).toBeTruthy();
      });

      test('Флаг отступов из конфига должен быть ложным', () => {
        expect(model.getConfig().withIndent).toBeFalsy();
      });
    });

  });

  describe('Методы', () => {

    describe('Обновление', () => {
      let model: IModel; 
      beforeEach(() => {
        model = new Model();
      });

      test('После пустого обновления лимиты не изменились', () => {
        const oldLimits = model.getLimits().slice();
        model.update();
        expect(model.getLimits()).toEqual(oldLimits);
      });

      test('Слайдер стал двойным', () => {
        model.update({ isDouble: true });
        expect(model.isDouble()).toBeTruthy();
      });

      test('Слайдер стал двойным с заданными минимальным 20 и максимальным 40 интервалами', () => {
        model.update({ minInterval: 20, maxInterval: 40 });
        expect(model.isDouble()).toBeTruthy();
        expect(model.getMinInterval()).toBe(20);
        expect(model.getMaxInterval()).toBe(40);
      });

      test('Слайдер стал двойным с заданными абсолютным минимумом 10 и максимумом 90', () => {
        model.update({ min: 10, max: 90, isDouble: true });
        expect(model.isDouble()).toBeTruthy();
        expect(model.getMin()).toBe(10);
        expect(model.getMax()).toBe(90);
      });

      test('Со слайдером связывается список', () => {
        const list = new List({ items: ['яблоко', 'груша'] })
        model.update({ list: ['яблоко', 'груша'] });
        
        expect(model.getList()).toEqual(list.getItems());
      });
    });

    describe('Делегирование', () => {
      let model: IModel; 
      beforeEach(() => {
        model = new Model();
      });

      test('Устанавливает и возвращает абсолютный минимум, должен быть -100', () => {
        expect(model.setMin(-100)).toBe(-100);
        expect(model.getMin()).toBe(-100);
      });

      test('Устанавливает и возвращает абсолютный максимум, должен быть 900', () => {
        expect(model.setMax(900)).toBe(900);
        expect(model.getMax()).toBe(900);
      });

      test('Устанавливает и возвращает активное значение, должен быть 90', () => {
        expect(model.setValue(90)).toBe(90);
        expect(model.getValue()).toBe(90);
      });

      test('Устанавливает и возвращает активное значение в процентах, должен быть 90', () => {
        expect(model.setPerValue(90)).toBe(90);
      });

      test('Устанавливает и возвращает индекс активного диапазона, должен быть 4', () => {
        let model: IModel = new Model({ limits: [1, 2, 3, 4, 5, 6, 7, 8 , 9] });
        expect(model.setActive(4)).toBe(4);
        expect(model.getActive()).toBe(4);
      });

      test('Устанавливает и возвращает индекс активного диапазона близкого к значению 40, должен быть 3', () => {
        let model: IModel = new Model({ limits: [1, 2, 3, 4, 50, 60, 70, 80 , 90] });
        expect(model.setActiveCloseOfValue(40)).toBe(3);
      });
    });

    describe('Определение ближайшего имени', () => {
      let model: IModel; 
      beforeEach(() => {
        model = new Model({ list: ['яблоко', 'абрикос', [-10, 'груша'], [-5, 'персик'], 'тыква'] });
      });

      test('Ближайшее имя к 50 - тыква', () => {
        expect(model.getClosestName()).toBe('тыква');
      });

      test('Ближайшее имя к -10 - груша', () => {
        model.setValue(-10);
        expect(model.getClosestName()).toBe('груша');
      });

      test('Ближайшее имя к -6 - персик', () => {
        model.setValue(-6);
        expect(model.getClosestName()).toBe('персик');
      });
    });

    describe('Подписка', () => {
      let model: IModel;
      beforeEach(() => {
        model = new Model();
      });

      test('Подписка на событие changeValue, установка значения в 30, колбэк подписчика вызван один раз с аргументом-массивом, первый элемент которго равен 30', () => {
        const func = jest.fn();
        model.on('changeValue', func)
        model.setValue(30);
        expect(func.mock.calls.length).toBe(1);
        expect(func.mock.calls[0][0][0]).toBe(30);
      })
    })
  });

})