/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */

import {
  IViewConfigurator, IViewHandler, IViewRender, TViewConfig, View,
} from '../View';
import { IPresenter } from '../../Presenter';
import { TRootConfig } from '../Root/Root';
import { TSlotConfig } from '../Slot/Slot';
import { TBarConfig } from '../Bar/Bar';
import { TThumbConfig } from '../Thumb';
import { TLabelConfig } from '../Label';
import { TScaleConfig } from '../Scale';
import { TSegmentConfig } from '../Segment';

// - подготовка
jest.mock('../Root/HorizontalRoot');
jest.mock('../Root/VerticalRoot');
jest.mock('../Slot/HorizontalSlot');
jest.mock('../Slot/VerticalSlot');
jest.mock('../Bar/HorizontalBar');
jest.mock('../Bar/VerticalBar');
jest.mock('../Thumb');
jest.mock('../Label');
jest.mock('../Scale');
jest.mock('../Segment');

describe('Отображение', () => {
  class PresenterStab implements IPresenter {
    update(): void {}
    setActive(): void {}
    setActiveCloseOfValue(): void {}
    setValue(): void {}
    setPerValue(): void {}
  }
  let presenter: IPresenter;
  let root: HTMLElement;
  let viewConfig: TViewConfig;
  describe('Рендер', () => {
    beforeEach(() => {
      presenter = new PresenterStab();
      root = document.createElement('div');
      viewConfig = {
        min: 10,
        max: 90,
        value: 40,
        name: 'test',
        step: 2,
        orientation: 'vertical',
        perValues: [10, 40, 90],
        active: 1,
        actualRanges: [1],
        withLabel: true,
        label: 'number',
        scale: 'basic',
        list: new Map<number, string>(),
        lengthPx: null,
        withIndent: false,
      };
    });
    it('Экземпляр должен быть создан', () => {
      // - действие
      const view: IViewRender = new View(presenter, root);
      // - проверка
      expect(view).toBeDefined();
    });
    it('Рендер должен быть вызван один раз', () => {
      const view: IViewRender = new View(presenter, root);
      const spy = jest.spyOn(view, 'render');
      // - действие
      view.render(viewConfig);
      // - проверка
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
  describe('Обработчик событий', () => {
    let view: IViewHandler;
    beforeEach(() => {
      presenter = new PresenterStab();
      root = document.createElement('div');
      view = new View(presenter, root);
    });
    it('При событии подъема указателя на документе, метод обновления в презентере не должен быть вызван', () => {
      const spy = jest.spyOn(presenter, 'update');
      // - действие
      document.dispatchEvent(new Event('pointerup'));
      // - проверка
      expect(spy).not.toHaveBeenCalled();
    });
    it('При обработке выбора диапазона и последующем событии подъема указателя на документе, должен быть вызван метод обновления в презентере', () => {
      const spy = jest.spyOn(presenter, 'update');
      view.handleSelectRange(0);
      // - действие
      document.dispatchEvent(new Event('pointerup'));
      // - проверка
      expect(spy).toHaveBeenCalled();
    });
    it('Значение выбранного диапазона должно быть отправлено в презентер, в метод установки активного диапазона', () => {
      const testActive = 3;
      const spy = jest.spyOn(presenter, 'setActive');
      // - действие
      view.handleSelectRange(testActive);
      // - проверка
      expect(spy).toHaveBeenCalledWith(testActive);
    });
    it('Значение выбранного диапазона не должно быть снова отправлено в презентер', () => {
      view.handleSelectRange(1);
      const spy = jest.spyOn(presenter, 'setActive');
      // - действие
      view.handleSelectRange(2);
      // - проверка
      expect(spy).not.toHaveBeenCalled();
    });
    it('Значение выбранного диапазона должно быть снова отправлено в презентер, после события подъема указателя на документе', () => {
      view.handleSelectRange(1);
      const spy = jest.spyOn(presenter, 'setActive');
      document.dispatchEvent(new Event('pointerup'));
      // - действие
      view.handleSelectRange(2);
      // - проверка
      expect(spy).toHaveBeenCalled();
    });
    it('Выбранное значение должно быть отправлено в презентер, в методы установки значения и активации ближайшего к нему диапазона', () => {
      const testValue = 333;
      const setValueSpy = jest.spyOn(presenter, 'setValue');
      const setActiveCloseOfValueSpy = jest.spyOn(presenter, 'setActiveCloseOfValue');
      // - действие
      view.handleSelectValue(testValue);
      // - проверка
      expect(setValueSpy).toHaveBeenCalledWith(testValue);
      expect(setActiveCloseOfValueSpy).toHaveBeenCalledWith(testValue);
    });
    it('Выбранное процентное значение должно быть отправлено в презентер, в метод установки процентного значения', () => {
      const testPerValue = 33;
      const spy = jest.spyOn(presenter, 'setPerValue');
      // - действие
      view.handleSelectPerValue(testPerValue);
      // - проверка
      expect(spy).toHaveBeenCalledWith(testPerValue);
    });
  });
  describe('Конфигуратор', () => {
    let view: IViewConfigurator;
    viewConfig = {
      min: 10,
      max: 90,
      value: 40,
      name: 'test',
      step: 2,
      orientation: 'vertical',
      perValues: [10, 40, 90],
      active: 1,
      actualRanges: [1],
      withLabel: true,
      label: 'number',
      scale: null,
      segments: null,
      list: new Map<number, string>(),
      lengthPx: null,
      withIndent: false,
    };
    describe('Конфигурация Root', () => {
      beforeEach(() => {
        presenter = new PresenterStab();
        root = document.createElement('div');
      });
      it('Должна соответствовать дефолтной', () => {
        view = new View(presenter, root);
        const expectedDefaults: TRootConfig = {
          className: 'my-jquery-slider',
          indent: 'normal',
        };
        // - действие / проверка
        expect(view.getRootConfig()).toEqual(expectedDefaults);
      });
      it('Должна отражать отсутствие отступов в конфигурации View', () => {
        const testViewConfig: TViewConfig = { ...viewConfig, withIndent: false };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getRootConfig().indent).toBe('none');
      });
      it('Должна содержать увеличенные отступы при наличии подписи и отступов в конфигурации View', () => {
        const testViewConfig: TViewConfig = { ...viewConfig, withIndent: true, withLabel: true };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getRootConfig().indent).toBe('more');
      });
    });
    describe('Конфигурация Slot', () => {
      beforeEach(() => {
        presenter = new PresenterStab();
        root = document.createElement('div');
      });
      it('Должна соответствовать дефолтной', () => {
        view = new View(presenter, root);
        const expectedDefaults: TSlotConfig = {
          className: 'my-jquery-slider__slot',
          withIndent: true,
        };
        // - действие / проверка
        expect(view.getSlotConfig()).toEqual(expectedDefaults);
      });
      it('Должна отражать отсутствие отступов в конфигурации View', () => {
        const testViewConfig: TViewConfig = { ...viewConfig, withIndent: false };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getSlotConfig().withIndent).toBeFalsy();
      });
    });
    describe('Конфигурация Bar в списке', () => {
      beforeEach(() => {
        presenter = new PresenterStab();
        root = document.createElement('div');
      });
      it('По-умолчанию должна быть единственная конфигурация', () => {
        view = new View(presenter, root);
        // - действие / проверка
        expect(view.getBarConfigs().length).toBe(1);
      });
      it('Единственная конфигурация по-умолчанию должна соответствовать дефолтной', () => {
        view = new View(presenter, root);
        const expectedDefaults: TBarConfig = {
          className: 'my-jquery-slider__bar',
          id: 0,
          lengthPer: 50,
          indentPer: 0,
          isActive: true,
          isActual: true,
          isEven: false,
        };
        // - действие / проверка
        expect(view.getBarConfigs()[0]).toEqual(expectedDefaults);
      });
      it('Количество конфигураций должно быть равно количеству процентных значений в конфигурации View', () => {
        const testPerValues: number[] = [10, 20, 30, 40, 50];
        const testViewConfig: TViewConfig = { ...viewConfig, perValues: testPerValues };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getBarConfigs().length).toBe(testPerValues.length);
      });
      it('Должна иметь id соответствующий индексу', () => {
        const testPerValues: number[] = [10, 20, 30, 40, 50];
        const testViewConfig: TViewConfig = { ...viewConfig, perValues: testPerValues };
        view = new View(presenter, root, testViewConfig);
        const testIndex = 1;
        // - действие / проверка
        expect(view.getBarConfigs()[testIndex].id).toBe(testIndex);
      });
      it('Первая, должна иметь длину соответствующую процентному значению в конфигурации View', () => {
        const testPerValues: number[] = [10, 22, 31, 46, 54];
        const testViewConfig: TViewConfig = { ...viewConfig, perValues: testPerValues };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getBarConfigs()[0].lengthPer).toBe(testPerValues[0]);
      });
      it('Не первая, должна иметь длину равную разнице соответствующего и предыдущего процентного значения в конфигурации View', () => {
        const testPerValues: number[] = [10, 22, 31, 46, 54];
        const testViewConfig: TViewConfig = { ...viewConfig, perValues: testPerValues };
        view = new View(presenter, root, testViewConfig);
        const testIndex = 2;
        // - действие / проверка
        expect(view.getBarConfigs()[testIndex].lengthPer)
          .toBe(testPerValues[testIndex] - testPerValues[testIndex - 1]);
      });
      it('Первая, должна иметь отступ равный нулю', () => {
        const testPerValues: number[] = [10, 22, 31, 46, 54];
        const testViewConfig: TViewConfig = { ...viewConfig, perValues: testPerValues };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getBarConfigs()[0].indentPer).toBe(0);
      });
      it('Не первая, должна иметь отступ равный соответствующему предыдущему значению в конфигурации View', () => {
        const testPerValues: number[] = [10, 22, 31, 46, 54];
        const testViewConfig: TViewConfig = { ...viewConfig, perValues: testPerValues };
        view = new View(presenter, root, testViewConfig);
        const testIndex = 3;
        // - действие / проверка
        expect(view.getBarConfigs()[testIndex].indentPer).toBe(testPerValues[testIndex - 1]);
      });
      it('Должна быть единственной имеющей флаг активности соответственно ее порядку в конфигурации View', () => {
        const testPerValues: number[] = [10, 22, 54];
        const testActive = 2;
        const testNotActive: number[] = [0, 1];
        const testViewConfig: TViewConfig = {
          ...viewConfig, perValues: testPerValues, active: testActive,
        };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getBarConfigs()[testActive].isActive).toBeTruthy();
        expect(view.getBarConfigs()[testNotActive[0]].isActive).toBeFalsy();
        expect(view.getBarConfigs()[testNotActive[1]].isActive).toBeFalsy();
      });
      it('Должна иметь флаг актуальности соответственно списку актуальных диапазонов в конфигурации View', () => {
        const testPerValues: number[] = [10, 22, 54];
        const testId = 1;
        const testActualRanges: number[] = [0, testId];
        const testViewConfig: TViewConfig = {
          ...viewConfig, perValues: testPerValues, actualRanges: testActualRanges,
        };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getBarConfigs()[testId].isActual).toBeTruthy();
      });
      it('Должна быть четной', () => {
        const testPerValues: number[] = [10, 22, 54];
        const testViewConfig: TViewConfig = { ...viewConfig, perValues: testPerValues };
        view = new View(presenter, root, testViewConfig);
        const testIndex = 1;
        // - действие / проверка
        expect(view.getBarConfigs()[testIndex].isEven).toBeTruthy();
      });
      it('Не должна быть четной', () => {
        const testPerValues: number[] = [10, 22, 54];
        const testViewConfig: TViewConfig = { ...viewConfig, perValues: testPerValues };
        view = new View(presenter, root, testViewConfig);
        const testIndex = 2;
        // - действие / проверка
        expect(view.getBarConfigs()[testIndex].isEven).toBeFalsy();
      });
    });
    describe('Конфигурация Thumb', () => {
      beforeEach(() => {
        presenter = new PresenterStab();
        root = document.createElement('div');
      });
      it('Должна соответствовать дефолтной', () => {
        view = new View(presenter, root);
        const expectedDefaults: TThumbConfig = {
          className: 'my-jquery-slider__thumb',
          id: 0,
          withLabel: false,
        };
        // - действие / проверка
        expect(view.getThumbConfig()).toEqual(expectedDefaults);
      });
      it('Должна содержать флаг наличия подписи, когда id соответствует активному диапазону в конфигурации View и в ней включен флаг подписи', () => {
        const testPerValues: number[] = [10, 22, 54];
        const testActive = 1;
        const testId: number = testActive;
        const testViewConfig: TViewConfig = {
          ...viewConfig, perValues: testPerValues, withLabel: true, active: testActive,
        };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getThumbConfig(testId).withLabel).toBeTruthy();
      });
      it('Не должна содержать флаг наличия подписи, когда id не соответствует активному диапазону в конфигурации View и в ней включен флаг подписи', () => {
        const testPerValues: number[] = [10, 22, 54];
        const testActive = 1;
        const testId = 0;
        const testViewConfig: TViewConfig = {
          ...viewConfig, perValues: testPerValues, withLabel: true, active: testActive,
        };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getThumbConfig(testId).withLabel).toBeFalsy();
      });
    });
    describe('Конфигурация Label', () => {
      beforeEach(() => {
        presenter = new PresenterStab();
        root = document.createElement('div');
      });
      it('Должна соответствовать дефолтной', () => {
        view = new View(presenter, root);
        const expectedDefaults: TLabelConfig = {
          className: 'my-jquery-slider__label',
          text: '50',
        };
        // - действие / проверка
        expect(view.getLabelConfig()).toEqual(expectedDefaults);
      });
      it('Должна содержать текст соответствующий значению в конфигурации View', () => {
        const testValue = 42;
        const testViewConfig: TViewConfig = { ...viewConfig, value: testValue };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getLabelConfig().text).toBe(testValue.toString());
      });
      it('Должна содержать текст соответствующий имени в конфигурации View, при включенном именном режиме', () => {
        const testName = 'test-name';
        const testViewConfig: TViewConfig = { ...viewConfig, name: testName, label: 'name' };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getLabelConfig().text).toBe(testName);
      });
      it('Должна содержать текст соответствующий значению в конфигурации View, при включенном числовом режиме', () => {
        const testValue = 42;
        const testViewConfig: TViewConfig = { ...viewConfig, value: testValue, label: 'number' };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getLabelConfig().text).toBe(testValue.toString());
      });
      it('Должна содержать текст соответствующий значению в конфигурации View, при включенном именном режиме и отсутствию имени', () => {
        const testValue = 42;
        const testViewConfig: TViewConfig = {
          ...viewConfig, value: testValue, name: null, label: 'name',
        };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getLabelConfig().text).toBe(testValue.toString());
      });
    });
    describe('Конфигурация Scale', () => {
      beforeEach(() => {
        presenter = new PresenterStab();
        root = document.createElement('div');
      });
      it('Должна соответствовать дефолтной', () => {
        view = new View(presenter, root);
        const expectedDefaults: TScaleConfig = {
          className: 'my-jquery-slider__scale',
          withIndent: true,
        };
        // - действие / проверка
        expect(view.getScaleConfig()).toEqual(expectedDefaults);
      });
      it('Должна отражать отсутствие отступов в конфигурации View', () => {
        const testViewConfig: TViewConfig = { ...viewConfig, withIndent: false };
        view = new View(presenter, root, testViewConfig);
        // - действие / проверка
        expect(view.getScaleConfig().withIndent).toBeFalsy();
      });
    });
    describe('Конфигурация Segment в списке', () => {
      let testViewConfig: TViewConfig;
      beforeEach(() => {
        presenter = new PresenterStab();
        root = document.createElement('div');
        testViewConfig = {
          ...viewConfig,
          min: 10,
          max: 90,
          scale: 'basic',
          lengthPx: 1000,
          withNotch: false,
        };
        view = new View(presenter, root, testViewConfig);
      });
      it('Обратный вызов с расчетом разумного шага должен быть вызван один раз', () => {
        const callback = jest.fn();
        // - действие
        view.getSegmentConfigs(callback);
        // - проверка
        expect(callback).toHaveBeenCalledTimes(1);
      });
      it('Сегмент должен быть единственным, при разумном шаге большем чем максимум в конфигурации View', () => {
        const calcReasonableStepStab = () => testViewConfig.max + 1;
        // - действие / проверка
        expect(view.getSegmentConfigs(calcReasonableStepStab).length).toBe(1);
      });
      it('Единственный сегмент должен соответствовать конфигурации View', () => {
        const calcReasonableStepStab = () => testViewConfig.max + 1;
        const expectedDefaults: TSegmentConfig = {
          className: 'my-jquery-slider__segment',
          value: testViewConfig.max,
          notch: 'short',
          label: null,
          grow: testViewConfig.max - testViewConfig.min,
          isLast: true,
          withNotch: false,
        };
        // - действие / проверка
        expect(view.getSegmentConfigs(calcReasonableStepStab)[0]).toEqual(expectedDefaults);
      });
      it('Должно быть два сегмента, при разумном шаге равном полному диапазону от минимума до максимума', () => {
        const calcReasonableStepStab = () => testViewConfig.max - testViewConfig.min;
        // - действие / проверка
        expect(view.getSegmentConfigs(calcReasonableStepStab).length).toBe(2);
      });
      it('Первый сегмент из двух должен отображать минимальной значение в конфигурации View', () => {
        const calcReasonableStepStab = () => testViewConfig.max - testViewConfig.min;
        // - действие / проверка
        expect(view.getSegmentConfigs(calcReasonableStepStab)[0].value).toBe(testViewConfig.min);
      });
      it('Второй сегмент из двух должен отображать максимальное значение в конфигурации View', () => {
        const calcReasonableStepStab = () => testViewConfig.max - testViewConfig.min;
        // - действие / проверка
        expect(view.getSegmentConfigs(calcReasonableStepStab)[1].value).toBe(testViewConfig.max);
      });
      it('Оба сегмента из двух должны быть сконфигурированы с нормальной длиной засечки', () => {
        const calcReasonableStepStab = () => testViewConfig.max - testViewConfig.min;
        const testNotch = 'normal';
        // - действие
        const segmentConfigs = view.getSegmentConfigs(calcReasonableStepStab);
        // - проверка
        expect(segmentConfigs[0].notch).toBe(testNotch);
        expect(segmentConfigs[1].notch).toBe(testNotch);
      });
      it('У обоих сегментов из двух должна отсутствовать подпись', () => {
        const calcReasonableStepStab = () => testViewConfig.max - testViewConfig.min;
        // - действие
        const segmentConfigs = view.getSegmentConfigs(calcReasonableStepStab);
        // - проверка
        expect(segmentConfigs[0].label).toBeNull();
        expect(segmentConfigs[1].label).toBeNull();
      });
      it('Коэффициент роста первого сегмента из двух должен быть равен разумному шагу', () => {
        const testAbsRange = testViewConfig.max - testViewConfig.min;
        const calcReasonableStepStab = () => testAbsRange;
        // - действие
        const segmentConfigs = view.getSegmentConfigs(calcReasonableStepStab);
        // - проверка
        expect(segmentConfigs[0].grow).toBe(testAbsRange);
      });
      it('Коэффициент роста второго сегмента из двух должен быть равен нулю', () => {
        const testAbsRange = testViewConfig.max - testViewConfig.min;
        const calcReasonableStepStab = () => testAbsRange;
        // - действие
        const segmentConfigs = view.getSegmentConfigs(calcReasonableStepStab);
        // - проверка
        expect(segmentConfigs[1].grow).toBe(0);
      });
      it('Первый сегмент из двух не должен иметь флаг последнего сегмента', () => {
        const testAbsRange = testViewConfig.max - testViewConfig.min;
        const calcReasonableStepStab = () => testAbsRange;
        // - действие
        const segmentConfigs = view.getSegmentConfigs(calcReasonableStepStab);
        // - проверка
        expect(segmentConfigs[0].isLast).toBeFalsy();
      });
      it('Второй сегмент из двух должен иметь флаг последнего сегмента', () => {
        const testAbsRange = testViewConfig.max - testViewConfig.min;
        const calcReasonableStepStab = () => testAbsRange;
        // - действие
        const segmentConfigs = view.getSegmentConfigs(calcReasonableStepStab);
        // - проверка
        expect(segmentConfigs[1].isLast).toBeTruthy();
      });
      it('Количество сегментов должно быть равно 11, при абсолютном диапазоне в 100 и разумном шаге 10', () => {
        const testConfig = { ...testViewConfig, min: 20, max: 120 };
        const testView = new View(presenter, root, testConfig);
        const calcReasonableStepStab = () => 10;
        // - действие
        const segmentConfigs = testView.getSegmentConfigs(calcReasonableStepStab);
        // - проверка
        expect(segmentConfigs.length).toBe(11);
      });
      it('Коэффициент роста второго сегмента должен быть равен разумному шагу', () => {
        const testReasonableStep = 10;
        const calcReasonableStepStab = () => testReasonableStep;
        // - действие
        const segmentConfigs = view.getSegmentConfigs(calcReasonableStepStab);
        // - проверка
        expect(segmentConfigs[1].grow).toBe(testReasonableStep);
      });
      it('Коэффициент роста последнего сегмента должен быть равен разнице абсолютного диапазона и произведения разумного шага на количество предыдущих сегментов', () => {
        const testConfig = { ...testViewConfig, min: 20, max: 120 };
        const testView = new View(presenter, root, testConfig);
        const testReasonableStep = 7;
        const calcReasonableStepStab = () => testReasonableStep;
        // - действие
        const segmentConfigs = testView.getSegmentConfigs(calcReasonableStepStab);
        // - проверка
        const expectedGrow = (testConfig.max - testConfig.min)
          - testReasonableStep * (segmentConfigs.length - 1);
        expect(segmentConfigs[segmentConfigs.length - 1].grow).toBe(expectedGrow);
      });
      it('Значение третьего сегмента должно быть равно сумме минимального значения в конфигурации View и произведения разумного шага на количество предыдущих сегментов', () => {
        const testReasonableStep = 6;
        const calcReasonableStepStab = () => testReasonableStep;
        // - действие
        const segmentConfigs = view.getSegmentConfigs(calcReasonableStepStab);
        // - проверка
        expect(segmentConfigs[2].value).toBe(testViewConfig.min + testReasonableStep * 2);
      });
      it('Тип засечки сегмента должен быть длинным, когда значение сегмента кратно десятикратному разумному шагу', () => {
        const testConfig = { ...testViewConfig, min: 20, max: 120 };
        const testView = new View(presenter, root, testConfig);
        const testReasonableStep = 2;
        const calcReasonableStepStab = () => testReasonableStep;
        // - действие
        const segmentConfigs = testView.getSegmentConfigs(calcReasonableStepStab);
        // - проверка
        expect(segmentConfigs[20].notch).toBe('long');
      });
      it('Тип засечки сегмента должен быть нормальным, когда значение сегмента не кратно десятикратному разумному шагу', () => {
        const testConfig = { ...testViewConfig, min: 20, max: 120 };
        const testView = new View(presenter, root, testConfig);
        const testReasonableStep = 2;
        const calcReasonableStepStab = () => testReasonableStep;
        // - действие
        const segmentConfigs = testView.getSegmentConfigs(calcReasonableStepStab);
        // - проверка
        expect(segmentConfigs[19].notch).toBe('normal');
      });
      it('Тип засечки последнего сегмента должен быть коротким, когда предыдущие сегменты не укладываются (значение не кратно разумному шагу)', () => {
        const testConfig = { ...testViewConfig, min: 20, max: 120 };
        const testView = new View(presenter, root, testConfig);
        const testReasonableStep = 3;
        const calcReasonableStepStab = () => testReasonableStep;
        // - действие
        const segmentConfigs = testView.getSegmentConfigs(calcReasonableStepStab);
        // - проверка
        expect(segmentConfigs[segmentConfigs.length - 1].notch).toBe('short');
      });
      it('Подписью сегмента должно быть его значение, при числовом типе шкалы в конфигурации View', () => {
        const testConfig: TViewConfig = { ...testViewConfig, min: 33, scale: 'numeric' };
        const testView = new View(presenter, root, testConfig);
        const calcReasonableStepStab = () => 1;
        // - действие
        const segmentConfigs = testView.getSegmentConfigs(calcReasonableStepStab);
        // - проверка
        expect(segmentConfigs[0].label).toBe(testConfig.min);
      });
      it('Подписью сегмента должно быть его значение, при типе шкалы отличном от базового и отсутствии имени соответствующему значению в конфигурации View', () => {
        const testConfig: TViewConfig = { ...testViewConfig, max: 99, scale: 'named' };
        const testView = new View(presenter, root, testConfig);
        const calcReasonableStepStab = () => 1;
        // - действие
        const segmentConfigs = testView.getSegmentConfigs(calcReasonableStepStab);
        // - проверка
        expect(segmentConfigs[segmentConfigs.length - 1].label).toBe(testConfig.max);
      });
      it('Подписью сегмента должно быть имя соответственно списка имен в конфигурации View, при именованном типе шкалы', () => {
        const testMin = 33;
        const testReasonableStep = 10;
        const testValue = testMin + testReasonableStep;
        const testName = 'test-name';
        const testList = new Map([[testMin, 'not-test'], [testValue, testName]]);
        const testConfig: TViewConfig = {
          ...testViewConfig,
          min: testMin,
          value: testValue,
          scale: 'named',
          list: testList,
        };
        const testView = new View(presenter, root, testConfig);
        const calcReasonableStepStab = () => testReasonableStep;
        // - действие
        const segmentConfigs = testView.getSegmentConfigs(calcReasonableStepStab);
        // - проверка
        expect(segmentConfigs[1].label).toBe(testName);
      });
    });
  });
  describe('Ре-рендер в процессе взаимодействия', () => {
    let view: View;
    beforeEach(() => {
      presenter = new PresenterStab();
      root = document.createElement('div');
      viewConfig = {
        min: 10,
        max: 90,
        value: 40,
        name: 'test',
        step: 2,
        orientation: 'horizontal',
        perValues: [10, 40, 90],
        active: 1,
        actualRanges: [1],
        withLabel: true,
        label: 'number',
        scale: null,
        list: new Map<number, string>(),
        lengthPx: null,
        withIndent: false,
      };
      view = new View(presenter, root);
      view.render(viewConfig);
    });
    it('Сумма отступа и длины бара должна быть равна обрабатываемому процентному значению, после выбора диапазона, процентного значения и рендера', () => {
      const testActive = 1;
      const testPerValue = 55;
      // - действие
      view.handleSelectRange(testActive);
      view.handleSelectPerValue(testPerValue);
      view.render(viewConfig);
      // - проверка
      const expectedSum = view.getBarConfigs()[testActive].indentPer
        + view.getBarConfigs()[testActive].lengthPer;
      expect(expectedSum).toBe(testPerValue);
    });
    it('Сумма отступа и длины бара должна быть равна соответствующему значению из списка процентных значений конфигурации View, после события подъема указателя и рендера', () => {
      const testActive = 1;
      const testPerValue = 55;
      // - действие
      view.handleSelectRange(testActive);
      view.handleSelectPerValue(testPerValue);
      document.dispatchEvent(new Event('pointerup'));
      view.render(viewConfig);
      // - проверка
      const expectedSum = view.getBarConfigs()[testActive].indentPer
        + view.getBarConfigs()[testActive].lengthPer;
      expect(expectedSum).toBe(viewConfig.perValues[testActive]);
    });
    it('Сумма отступа и длины бара должна быть равна процентному значению следующего диапазона, после выбора диапазона, процентного больше следующего и рендера', () => {
      const testActive = 1;
      const testPerValue = 99;
      // - действие
      view.handleSelectRange(testActive);
      view.handleSelectPerValue(testPerValue);
      view.render(viewConfig);
      // - проверка
      const expectedSum = view.getBarConfigs()[testActive].indentPer
        + view.getBarConfigs()[testActive].lengthPer;
      expect(expectedSum).toBe(viewConfig.perValues[testActive + 1]);
    });
    it('Сумма отступа и длины бара должна быть равна процентному значению предыдущего диапазона, после выбора диапазона, процентного меньше предыдущего и рендера', () => {
      const testActive = 1;
      const testPerValue = 1;
      // - действие
      view.handleSelectRange(testActive);
      view.handleSelectPerValue(testPerValue);
      view.render(viewConfig);
      // - проверка
      const expectedSum = view.getBarConfigs()[testActive].indentPer
        + view.getBarConfigs()[testActive].lengthPer;
      expect(expectedSum).toBe(viewConfig.perValues[testActive - 1]);
    });
    it('Сумма отступа и длины первого бара должна быть равна нулю, после выбора первого диапазона, процентного значения меньше нуля и рендера', () => {
      const testActive = 0;
      const testPerValue = -1;
      const testConfig = { ...viewConfig, active: testActive };
      view.render(testConfig);
      // - действие
      view.handleSelectRange(testActive);
      view.handleSelectPerValue(testPerValue);
      view.render(testConfig);
      // - проверка
      const expectedSum = view.getBarConfigs()[testActive].indentPer
        + view.getBarConfigs()[testActive].lengthPer;
      expect(expectedSum).toBe(0);
    });
    it('Сумма отступа и длины последнего бара должна быть равна 100, после выбора последнего диапазона, процентного значения больше 100 и рендера', () => {
      const testActive = 2;
      const testPerValue = 110;
      const testConfig = { ...viewConfig, active: testActive };
      view.render(testConfig);
      // - действие
      view.handleSelectRange(testActive);
      view.handleSelectPerValue(testPerValue);
      view.render(testConfig);
      // - проверка
      const expectedSum = view.getBarConfigs()[testActive].indentPer
        + view.getBarConfigs()[testActive].lengthPer;
      expect(expectedSum).toBe(100);
    });
  });
});
