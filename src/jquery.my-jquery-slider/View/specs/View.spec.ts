/**
 * @jest-environment jsdom
 */

import { IViewConfigurator, IViewHandler, IViewRender, TViewConfig, View } from "../View";
import { IPresenter } from '../../Presenter';
import { TRootConfig } from "../Root";
import { TSlotConfig } from "../Slot";
import { TBarConfig } from "../Bar";
import { TThumbConfig } from "../Thumb";
import { TLabelConfig } from "../Label";

describe('Отображение', () => {
  // - подготовка
  class PresenterMock implements IPresenter {
    update(): void {}
    setActive(): void {}
    setActiveCloseOfValue(): void {}
    setValue(): void {}
    setPerValue(): void {}
  }
  let presenter: IPresenter, root: HTMLElement, viewConfig: TViewConfig;
  describe('Рендер', () => {
    beforeEach(() => {
      presenter = new PresenterMock();
      root = document.createElement('div');
      viewConfig = {
        min: 10,
        max: 90,
        value: 40,
        name: 'test',
        step: 2,
        orientation: 'vertical',
        perValues: [10, 40 ,90],
        active: 1,
        actuals: [1],
        withLabel: true,
        label: 'number',
        scale: null,
        list: new Map<number, string>(),
        lengthPx: null,
        withIndent: false,
      };
    })
    it('Инстанс должен быть создан', () => {
      // - действие
      const view: IViewRender = new View(presenter, root);
      // - проверка
      expect(view).toBeDefined();
    })
    it('Рендер должен быть вызван один раз', () => {
      const view: IViewRender = new View(presenter, root);
      const spy = jest.spyOn(view, 'render');
      // - действие
      view.render(viewConfig);
      // - проверка
      expect(spy).toHaveBeenCalledTimes(1);
    })
  })
  describe('Обработчик событий', () => {
    let view: IViewHandler;
    beforeEach(() => {
      presenter = new PresenterMock();
      root = document.createElement('div');
      view = new View(presenter, root);
    })
    it('При событии подъема указателя на документе, метод обновления в презентере не должен быть вызван', () => {
      const spy = jest.spyOn(presenter, 'update');
      // - действие
      document.dispatchEvent(new Event('pointerup'));
      // - проверка
      expect(spy).not.toHaveBeenCalled();
    })
    it('При обработке выбора диапазона и последующем событии подъема указателя на документе, должен быть вызван метод обновления в презентере', () => {
      const spy = jest.spyOn(presenter, 'update');
      view.handleSelectRange(0);
      // - действие
      document.dispatchEvent(new Event('pointerup'));
      // - проверка
      expect(spy).toHaveBeenCalled();
    })
    it('Значение выбраного диапазона должно быть отправлено в презентер, в метод установки активного диапазона', () => {
      const testActive = 3;
      const spy = jest.spyOn(presenter, 'setActive');
      // - действие
      view.handleSelectRange(testActive);
      // - проверка
      expect(spy).toHaveBeenCalledWith(testActive);
    })
    it('Значение выбраного диапазона не должно быть снова отправлено в презентер', () => {
      view.handleSelectRange(1);
      const spy = jest.spyOn(presenter, 'setActive');
      // - действие
      view.handleSelectRange(2);
      // - проверка
      expect(spy).not.toHaveBeenCalled();
    })
    it('Значение выбраного диапазона должно быть снова отправлено в презентер, после события подъема указателя на документе', () => {
      view.handleSelectRange(1);
      const spy = jest.spyOn(presenter, 'setActive');
      document.dispatchEvent(new Event('pointerup'));
      // - действие
      view.handleSelectRange(2);
      // - проверка
      expect(spy).toHaveBeenCalled();
    })
    it('Выбранное значение должно быть отправлено в презентер, в методы установки значения и активации ближайшего к нему диапазона', () => {
      const testValue = 333;
      const setValueSpy = jest.spyOn(presenter, 'setValue');
      const setActiveCloseOfValueSpy = jest.spyOn(presenter, 'setActiveCloseOfValue');
      // - действие
      view.handleSelectValue(testValue);
      // - проверка
      expect(setValueSpy).toHaveBeenCalledWith(testValue);
      expect(setActiveCloseOfValueSpy).toHaveBeenCalledWith(testValue);
    })
    it('Выбранное процентное значение должно быть отправлено в презентер, в метод установки процентного значения', () => {
      const testPerValue = 33;
      const spy = jest.spyOn(presenter, 'setPerValue');
      // - действие
      view.handleSelectPerValue(testPerValue);
      // - проверка
      expect(spy).toHaveBeenCalledWith(testPerValue);
    })
  })
  describe('Конфигуратор', () => {
    let view: IViewConfigurator;
    viewConfig = {
      min: 10,
      max: 90,
      value: 40,
      name: 'test',
      step: 2,
      orientation: 'vertical',
      perValues: [10, 40 ,90],
      active: 1,
      actuals: [1],
      withLabel: true,
      label: 'number',
      scale: null,
      list: new Map<number, string>(),
      lengthPx: null,
      withIndent: false,
    };
    describe('Конфигурация Root', () => {
      beforeEach(() => {
        presenter = new PresenterMock();
        root = document.createElement('div');
      })
      it('Должна соответсвовать дефолтной', () => {
        view = new View(presenter, root);
        const expectedDefaults: TRootConfig = {
          rootElem: root,
          className: 'my-jquery-slider',
          indent: 'normal',
        }
        // - действие / проверка
        expect(view.getRootConfig()).toEqual(expectedDefaults)
      })
      it('Должна отражать отсутсвие отступов в конфигурации View', () => {
        const testViewConfig: TViewConfig = {...viewConfig, withIndent: false};
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getRootConfig().indent).toBe('none')
      })
      it('Должна содержать увеличенные отступы при наличии подписи и отступов в конфигурации View', () => {
        const testViewConfig: TViewConfig = {...viewConfig, withIndent: true, withLabel: true};
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getRootConfig().indent).toBe('more')
      })
    })
    describe('Конфигурация Slot', () => {
      beforeEach(() => {
        presenter = new PresenterMock();
        root = document.createElement('div');
      })
      it('Должна соответсвовать дефолтной', () => {
        view = new View(presenter, root);
        const expectedDefaults: TSlotConfig = {
          className: 'my-jquery-slider__slot',
          withIndent: true,
        }
        // - действие / проверка
        expect(view.getSlotConfig()).toEqual(expectedDefaults)
      })
      it('Должна отражать отсутсвие отступов в конфигурации View', () => {
        const testViewConfig: TViewConfig = {...viewConfig, withIndent: false};
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getSlotConfig().withIndent).toBeFalsy()
      })
    })
    describe('Конфигурация Bar в списке', () => {
      beforeEach(() => {
        presenter = new PresenterMock();
        root = document.createElement('div');
      })
      it('По-умолчанию должна быть единственная конфигурация', () => {
        view = new View(presenter, root);
        // - действие / проверка
        expect(view.getBarConfigs().length).toBe(1)
      })
      it('Единственная конфигурация по-умолчанию должна соответсвовать дефолтной', () => {
        view = new View(presenter, root);
        const expectedDefaults: TBarConfig = {
          className: 'my-jquery-slider__bar',
          id: 0,
          lengthPer: 50,
          indentPer: 0,
          isActive: true,
          isActual: true,
          isEven: false,
        }
        // - действие / проверка
        expect(view.getBarConfigs()[0]).toEqual(expectedDefaults)
      })
      it('Количество конфигураций должно быть равно количеству процентных значений в конфигурации View', () => {
        const testPerValues: number[] = [10, 20, 30, 40, 50];
        const testViewConfig: TViewConfig = {...viewConfig, perValues: testPerValues };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getBarConfigs().length).toBe(testPerValues.length)
      })
      it('Должна иметь id соответсвующий индексу', () => {
        const testPerValues: number[] = [10, 20, 30, 40, 50];
        const testViewConfig: TViewConfig = {...viewConfig, perValues: testPerValues };
        view = new View(presenter, root, testViewConfig);
        const testIndex = 1;
        // - действие / проверка
        expect(view.getBarConfigs()[testIndex].id).toBe(testIndex)
      })
      it('Первая, должна иметь длину соответсвующую процентному значению в конфигурации View', () => {
        const testPerValues: number[] = [10, 22, 31, 46, 54];
        const testViewConfig: TViewConfig = {...viewConfig, perValues: testPerValues };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getBarConfigs()[0].lengthPer).toBe(testPerValues[0]);
      })
      it('Не первая, должна иметь длину равную разнице соответсвующего и предыдущего процентного значения в конфигурации View', () => {
        const testPerValues: number[] = [10, 22, 31, 46, 54];
        const testViewConfig: TViewConfig = {...viewConfig, perValues: testPerValues };
        view = new View(presenter, root, testViewConfig);
        const testIndex = 2;
        // - действие / проверка
        expect(view.getBarConfigs()[testIndex].lengthPer).toBe(testPerValues[testIndex]-testPerValues[testIndex-1]);
      })
      it('Первая, должна иметь отступ равный нулю', () => {
        const testPerValues: number[] = [10, 22, 31, 46, 54];
        const testViewConfig: TViewConfig = {...viewConfig, perValues: testPerValues };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getBarConfigs()[0].indentPer).toBe(0);
      })
      it('Не первая, должна иметь отступ равный соответсвующему предыдущему значению в конфигурации View', () => {
        const testPerValues: number[] = [10, 22, 31, 46, 54];
        const testViewConfig: TViewConfig = {...viewConfig, perValues: testPerValues };
        view = new View(presenter, root, testViewConfig);
        const testIndex = 3;
        // - действие / проверка
        expect(view.getBarConfigs()[testIndex].indentPer).toBe(testPerValues[testIndex-1]);
      })
      it('Должна быть единственной имеющей флаг активности соотвественно ее порядку в конфигурации View', () => {
        const testPerValues: number[] = [10, 22, 54];
        const testActive: number = 2;
        const testNotActive: number[] = [0, 1];
        const testViewConfig: TViewConfig = {...viewConfig, perValues: testPerValues, active: testActive };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getBarConfigs()[testActive].isActive).toBeTruthy;
        expect(view.getBarConfigs()[testNotActive[0]].isActive).toBeFalsy;
        expect(view.getBarConfigs()[testNotActive[1]].isActive).toBeFalsy;
      })
      it('Должна иметь флаг актуальности соотвественно списку актуальных диапазонов в конфигурации View', () => {
        const testPerValues: number[] = [10, 22, 54];
        const testId: number = 1;
        const testActuals: number[] = [0, testId];
        const testViewConfig: TViewConfig = {...viewConfig, perValues: testPerValues, actuals: testActuals };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getBarConfigs()[testId].isActual).toBeTruthy;
      })
      it('Должна быть четной', () => {
        const testPerValues: number[] = [10, 22, 54];
        const testViewConfig: TViewConfig = {...viewConfig, perValues: testPerValues };
        view = new View(presenter, root, testViewConfig);
        const testIndex: number = 1;
        // - действие / проверка
        expect(view.getBarConfigs()[testIndex].isEven).toBeTruthy();
      })
      it('Не должна быть четной', () => {
        const testPerValues: number[] = [10, 22, 54];
        const testViewConfig: TViewConfig = {...viewConfig, perValues: testPerValues };
        view = new View(presenter, root, testViewConfig);
        const testIndex: number = 2;
        // - действие / проверка
        expect(view.getBarConfigs()[testIndex].isEven).toBeFalsy();
      })
    })
    describe('Конфигурация Thumb', () => {
      beforeEach(() => {
        presenter = new PresenterMock();
        root = document.createElement('div');
      })
      it('Должна соответсвовать дефолтной', () => {
        view = new View(presenter, root);
        const expectedDefaults: TThumbConfig = {
          className: 'my-jquery-slider__thumb',
          id: 0,
          withLabel: false,
        }
        // - действие / проверка
        expect(view.getThumbConfig()).toEqual(expectedDefaults)
      })
      it('Должна содержать флаг наличия подписи, когда id соответсвует активному диапазону в конфигурации View и в ней включен флаг подписи', () => {
        const testPerValues: number[] = [10, 22, 54];
        const testActive: number = 1;
        const testId: number = testActive;
        const testViewConfig: TViewConfig = {...viewConfig, perValues: testPerValues, withLabel: true, active: testActive };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getThumbConfig(testId).withLabel).toBeTruthy()
      })
      it('Не должна содержать флаг наличия подписи, когда id не соответсвует активному диапазону в конфигурации View и в ней включен флаг подписи', () => {
        const testPerValues: number[] = [10, 22, 54];
        const testActive: number = 1;
        const testId: number = 0;
        const testViewConfig: TViewConfig = {...viewConfig, perValues: testPerValues, withLabel: true, active: testActive };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getThumbConfig(testId).withLabel).toBeFalsy()
      })
    })
    describe('Конфигурация Label', () => {
      beforeEach(() => {
        presenter = new PresenterMock();
        root = document.createElement('div');
      })
      it('Должна соответсвовать дефолтной', () => {
        view = new View(presenter, root);
        const expectedDefaults: TLabelConfig = {
          className: 'my-jquery-slider__label',
          text: '50',
        }
        // - действие / проверка
        expect(view.getLabelConfig()).toEqual(expectedDefaults)
      })
      it('Должна содержать текст соответсвующий значению в конфигурации View', () => {
        const testValue = 42;
        const testViewConfig: TViewConfig = {...viewConfig, value: testValue };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getLabelConfig().text).toBe(testValue.toString())
      })
      it('Должна содержать текст соответсвующий имени в конфигурации View, при включенном именном режиме', () => {
        const testName = 'test-name';
        const testViewConfig: TViewConfig = {...viewConfig, name: testName, label: 'name' };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getLabelConfig().text).toBe(testName)
      })
      it('Должна содержать текст соответсвующий значению в конфигурации View, при включенном числовом режиме', () => {
        const testValue = 42;
        const testViewConfig: TViewConfig = {...viewConfig, value: testValue, label: 'number' };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getLabelConfig().text).toBe(testValue.toString())
      })
      it('Должна содержать текст соответсвующий значению в конфигурации View, при включенном именном режиме и отсутвию имени', () => {
        const testValue = 42;
        const testViewConfig: TViewConfig = {...viewConfig, value: testValue, name: null, label: 'name' };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getLabelConfig().text).toBe(testValue.toString())
      })
    })
  })
})