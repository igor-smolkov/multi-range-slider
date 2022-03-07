/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */

import { IEventEmitter } from '../../EventEmitter';
import { SliderLabel, SliderOrientation, SliderScale } from '../../TMyJQuerySlider';
import { ScaleSegmentNotch, TScaleSegmentConfig } from '../ScaleSegment';
import { IViewConfigurator, IViewHandler, IViewRender } from '../IView';
import { TViewConfig, View, ViewEvent } from '../View';
import HorizontalRoot from '../Root/HorizontalRoot';

class EventEmitterStab implements IEventEmitter {
  subscribe(): void {}
  unsubscribe(): void {}
  emit(): void {}
}

jest.mock('../../EventEmitter', () => ({ EventEmitter: jest.fn().mockImplementation(() => new EventEmitterStab()) }));
jest.mock('../Root/HorizontalRoot');
jest.mock('../Root/VerticalRoot');
jest.mock('../BarsSlot/HorizontalBarsSlot');
jest.mock('../BarsSlot/VerticalBarsSlot');
jest.mock('../Bar/HorizontalBar');
jest.mock('../Bar/VerticalBar');
jest.mock('../Thumb');
jest.mock('../Label');
jest.mock('../Scale');
jest.mock('../ScaleSegment');

describe('Отображение', () => {
  let root: HTMLElement;
  let viewConfig: TViewConfig;
  describe('Рендер и подписка', () => {
    let view: IViewRender;
    beforeEach(() => {
      root = document.createElement('div');
      viewConfig = {
        min: 10,
        max: 90,
        values: [40],
        names: ['test'],
        step: 2,
        orientation: SliderOrientation.vertical,
        perValues: [10, 40, 90],
        activeRange: 1,
        actualRanges: [1],
        withLabel: true,
        label: SliderLabel.number,
        scale: SliderScale.basic,
        labelsList: new Map<number, string>(),
        lengthPx: null,
        withIndent: false,
        scaleSegments: null,
        withNotch: null,
      };
      view = new View(root);
    });
    it('Экземпляр должен быть создан', () => {
      expect(view).toBeDefined();
    });
    it('Рендер должен быть вызван один раз', () => {
      const spy = jest.spyOn(view, 'render');

      view.render({ ...viewConfig });

      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('На событие change должна быть оформлена подписка с переданной функцией обратного вызова', () => {
      const event = ViewEvent.change;
      const callback = () => {};
      const spy = jest.spyOn(EventEmitterStab.prototype, 'subscribe');

      view.on(event, callback);

      expect(spy).toBeCalledWith(event, callback);
    });
    it('При изменении окна корневой элемент перерисовывается с сохранением слота', () => {
      const testView: IViewRender = new View(
        root,
        {
          ...viewConfig,
          scale: SliderScale.basic,
          orientation: SliderOrientation.horizontal,
        },
      );
      testView.render({
        ...viewConfig,
        orientation: SliderOrientation.horizontal,
        scale: SliderScale.basic,
      });
      const spy = jest.spyOn(HorizontalRoot.prototype, 'display').mockClear();

      window.dispatchEvent(new Event('resize'));

      expect(spy).toHaveBeenCalledWith(true);
    });
  });
  describe('Обработчик событий и оповещение', () => {
    let view: IViewHandler;
    let spy: jest.SpyInstance<void, []>;
    beforeEach(() => {
      root = document.createElement('div');
      view = new View(root);
      spy = jest.spyOn(EventEmitterStab.prototype, 'emit').mockClear();
    });
    it('При событии подъема указателя на документе, событие change не должно произойти', () => {
      document.dispatchEvent(new Event('pointerup'));

      expect(spy).not.toHaveBeenCalledWith('change');
      expect(spy).not.toHaveBeenLastCalledWith('change');
    });
    it('При обработке выбора диапазона и последующем событии подъема указателя на документе, должно произойти событие change', () => {
      view.handleSelectRange({ id: 0 });
      document.dispatchEvent(new Event('pointerup'));

      expect(spy).toHaveBeenLastCalledWith('change');
    });
    it('Значение выбранного диапазона должно быть отправлено вместе с событием change-active-range', () => {
      const testActiveRange = { id: 3 };

      view.handleSelectRange(testActiveRange);

      expect(spy).toHaveBeenCalledWith('change-active-range', testActiveRange.id);
    });
    it('Событие change-active-range должно произойти один раз', () => {
      view.handleSelectRange({ id: 1 });
      view.handleSelectRange({ id: 2 });

      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('Значение выбранного диапазона должно быть отправлено вместе с последним событием change-active-range', () => {
      view.handleSelectRange({ id: 1 });
      document.dispatchEvent(new Event('pointerup'));
      view.handleSelectRange({ id: 2 });

      expect(spy).toHaveBeenLastCalledWith('change-active-range', 2);
    });
    it('Выбранное значение должно быть отправлено вместе с событиями change-active-range-close и change-value', () => {
      const testValue = 333;

      view.handleSelectValue(testValue);

      expect(spy).toHaveBeenNthCalledWith(1, 'change-active-range-close', testValue);
      expect(spy).toHaveBeenNthCalledWith(2, 'change-value', testValue);
    });
    it('Выбранное процентное значение должно быть отправлено вместе с событием change-per-value', () => {
      const testPerValue = 33;

      view.handleSelectPerValue(testPerValue);

      expect(spy).toHaveBeenCalledWith('change-per-value', testPerValue);
    });
    it('Должно произойти событие forward', () => {
      view.handleStepForward();

      expect(spy).toHaveBeenCalledWith('forward');
    });
    it('Должно произойти событие backward', () => {
      view.handleStepBackward();

      expect(spy).toHaveBeenCalledWith('backward');
    });
  });
  describe('Конфигуратор', () => {
    let view: IViewConfigurator;
    viewConfig = {
      min: 10,
      max: 90,
      values: [40],
      names: ['test'],
      step: 2,
      orientation: SliderOrientation.vertical,
      perValues: [10, 40, 90],
      activeRange: 1,
      actualRanges: [1],
      withLabel: true,
      label: SliderLabel.number,
      scale: null,
      scaleSegments: null,
      labelsList: new Map<number, string>(),
      lengthPx: null,
      withIndent: false,
      withNotch: null,
    };
    describe('Конфигурация Root', () => {
      beforeEach(() => {
        root = document.createElement('div');
      });
      it('Должна отражать отсутствие отступов в конфигурации View', () => {
        const testViewConfig: TViewConfig = { ...viewConfig, withIndent: false };
        view = new View(root, testViewConfig);

        expect(view.getRootConfig().indent).toBe('none');
      });
      it('Должна содержать увеличенные отступы при наличии подписи и отступов в конфигурации View', () => {
        const testViewConfig: TViewConfig = { ...viewConfig, withIndent: true, withLabel: true };
        view = new View(root, testViewConfig);

        expect(view.getRootConfig().indent).toBe('more');
      });
      it('Должна содержать увеличенные отступы при вертикальной не базовой шкале и опции отступов в конфигурации View', () => {
        const testViewConfig: TViewConfig = {
          ...viewConfig,
          withIndent: true,
          orientation: SliderOrientation.vertical,
          scale: SliderScale.mixed,
          withLabel: false,
        };
        view = new View(root, testViewConfig);

        expect(view.getRootConfig().indent).toBe('more');
      });
    });
    describe('Конфигурация BarsSlot', () => {
      beforeEach(() => {
        root = document.createElement('div');
      });
      it('Должна отражать отсутствие отступов в конфигурации View', () => {
        const testViewConfig: TViewConfig = { ...viewConfig, withIndent: false };
        view = new View(root, testViewConfig);

        expect(view.getBarsSlotConfig().withIndent).toBeFalsy();
      });
    });
    describe('Конфигурация Bar в списке', () => {
      beforeEach(() => {
        root = document.createElement('div');
      });
      it('Количество конфигураций должно быть равно количеству процентных значений в конфигурации View', () => {
        const testPerValues: number[] = [10, 20, 30, 40, 50];
        const testViewConfig: TViewConfig = { ...viewConfig, perValues: testPerValues };
        view = new View(root, testViewConfig);

        expect(view.getBarConfigs().length).toBe(testPerValues.length);
      });
      it('Должна иметь id соответствующий индексу', () => {
        const testPerValues: number[] = [10, 20, 30, 40, 50];
        const testViewConfig: TViewConfig = { ...viewConfig, perValues: testPerValues };
        view = new View(root, testViewConfig);
        const testIndex = 1;

        expect(view.getBarConfigs()[testIndex].id).toBe(testIndex);
      });
      it('Первая, должна иметь длину соответствующую процентному значению в конфигурации View', () => {
        const testPerValues: number[] = [10, 22, 31, 46, 54];
        const testViewConfig: TViewConfig = { ...viewConfig, perValues: testPerValues };
        view = new View(root, testViewConfig);

        expect(view.getBarConfigs()[0].lengthPer).toBe(testPerValues[0]);
      });
      it('Не первая, должна иметь длину равную разнице соответствующего и предыдущего процентного значения в конфигурации View', () => {
        const testPerValues: number[] = [10, 22, 31, 46, 54];
        const testViewConfig: TViewConfig = { ...viewConfig, perValues: testPerValues };
        view = new View(root, testViewConfig);
        const testIndex = 2;

        expect(view.getBarConfigs()[testIndex].lengthPer)
          .toBe(testPerValues[testIndex] - testPerValues[testIndex - 1]);
      });
      it('Первая, должна иметь отступ равный нулю', () => {
        const testPerValues: number[] = [10, 22, 31, 46, 54];
        const testViewConfig: TViewConfig = { ...viewConfig, perValues: testPerValues };
        view = new View(root, testViewConfig);

        expect(view.getBarConfigs()[0].indentPer).toBe(0);
      });
      it('Не первая, должна иметь отступ равный соответствующему предыдущему значению в конфигурации View', () => {
        const testPerValues: number[] = [10, 22, 31, 46, 54];
        const testViewConfig: TViewConfig = { ...viewConfig, perValues: testPerValues };
        view = new View(root, testViewConfig);
        const testIndex = 3;

        expect(view.getBarConfigs()[testIndex].indentPer).toBe(testPerValues[testIndex - 1]);
      });
      it('Должна быть единственной имеющей флаг активности соответственно ее порядку в конфигурации View', () => {
        const testPerValues: number[] = [10, 22, 54];
        const testActiveRange = 2;
        const testNotActiveRange: number[] = [0, 1];
        const testViewConfig: TViewConfig = {
          ...viewConfig, perValues: testPerValues, activeRange: testActiveRange,
        };
        view = new View(root, testViewConfig);

        expect(view.getBarConfigs()[testActiveRange].isActive).toBeTruthy();
        expect(view.getBarConfigs()[testNotActiveRange[0]].isActive).toBeFalsy();
        expect(view.getBarConfigs()[testNotActiveRange[1]].isActive).toBeFalsy();
      });
      it('Должна иметь флаг актуальности соответственно списку актуальных диапазонов в конфигурации View', () => {
        const testPerValues: number[] = [10, 22, 54];
        const testId = 1;
        const testActualRanges: number[] = [0, testId];
        const testViewConfig: TViewConfig = {
          ...viewConfig, perValues: testPerValues, actualRanges: testActualRanges,
        };
        view = new View(root, testViewConfig);

        expect(view.getBarConfigs()[testId].isActual).toBeTruthy();
      });
      it('Должна быть четной', () => {
        const testPerValues: number[] = [10, 22, 54];
        const testViewConfig: TViewConfig = { ...viewConfig, perValues: testPerValues };
        view = new View(root, testViewConfig);
        const testIndex = 1;

        expect(view.getBarConfigs()[testIndex].isEven).toBeTruthy();
      });
      it('Не должна быть четной', () => {
        const testPerValues: number[] = [10, 22, 54];
        const testViewConfig: TViewConfig = { ...viewConfig, perValues: testPerValues };
        view = new View(root, testViewConfig);
        const testIndex = 2;

        expect(view.getBarConfigs()[testIndex].isEven).toBeFalsy();
      });
    });
    describe('Конфигурация Thumb', () => {
      beforeEach(() => {
        root = document.createElement('div');
      });
      it('Должна содержать флаг наличия подписи, когда включен флаг подписи в конфигурации View', () => {
        const testViewConfig: TViewConfig = {
          ...viewConfig, withLabel: true,
        };
        view = new View(root, testViewConfig);

        expect(view.getThumbConfig(0).withLabel).toBeTruthy();
      });
    });
    describe('Конфигурация Label в списке', () => {
      beforeEach(() => {
        root = document.createElement('div');
      });
      it('Должна содержать текст соответствующий значению в конфигурации View', () => {
        const testValue = 42;
        const testViewConfig: TViewConfig = { ...viewConfig, values: [10, testValue, 50] };
        view = new View(root, testViewConfig);

        expect(view.getLabelConfigs()[1].text).toBe(testValue.toString());
      });
      it('Должна содержать текст соответствующий имени в конфигурации View, при включенном именном режиме', () => {
        const testName = 'test-name';
        const testViewConfig: TViewConfig = {
          ...viewConfig,
          values: [1, 2, 3, 4],
          names: ['a', 'b', testName, 'd'],
          label: SliderLabel.name,
        };
        view = new View(root, testViewConfig);

        expect(view.getLabelConfigs()[2].text).toBe(testName);
      });
      it('Должна содержать текст соответствующий значению в конфигурации View, при включенном числовом режиме', () => {
        const testValue = 42;
        const testViewConfig: TViewConfig = {
          ...viewConfig,
          values: [1, 2, testValue, 50],
          names: ['a', 'b', 'c', 'd'],
          label: SliderLabel.number,
        };
        view = new View(root, testViewConfig);

        expect(view.getLabelConfigs()[2].text).toBe(testValue.toString());
      });
      it('Должна содержать текст соответствующий значению в конфигурации View, при включенном именном режиме и отсутствию имен', () => {
        const testValue = 42;
        const testViewConfig: TViewConfig = {
          ...viewConfig, values: [testValue], names: null, label: SliderLabel.name,
        };
        view = new View(root, testViewConfig);

        expect(view.getLabelConfigs()[0].text).toBe(testValue.toString());
      });
    });
    describe('Конфигурация Scale', () => {
      beforeEach(() => {
        root = document.createElement('div');
      });
      it('Должна отражать отсутствие отступов в конфигурации View', () => {
        const testViewConfig: TViewConfig = { ...viewConfig, withIndent: false };
        view = new View(root, testViewConfig);

        expect(view.getScaleConfig().withIndent).toBeFalsy();
      });
    });
    describe('Конфигурация ScaleSegment в списке', () => {
      let testViewConfig: TViewConfig;
      beforeEach(() => {
        root = document.createElement('div');
        testViewConfig = {
          ...viewConfig,
          min: 10,
          max: 90,
          scale: SliderScale.basic,
          lengthPx: 1000,
          withNotch: false,
        };
        view = new View(root, testViewConfig);
      });
      it('Обратный вызов с расчетом разумного шага должен быть вызван один раз', () => {
        const callback = jest.fn();

        view.getScaleSegmentConfigs(callback);

        expect(callback).toHaveBeenCalledTimes(1);
      });
      it('Сегмент должен быть единственным, при разумном шаге большем чем максимум в конфигурации View', () => {
        const calcReasonableStepStab = () => testViewConfig.max + 1;

        expect(view.getScaleSegmentConfigs(calcReasonableStepStab).length).toBe(1);
      });
      it('Единственный сегмент должен соответствовать конфигурации View', () => {
        const calcReasonableStepStab = () => testViewConfig.max + 1;
        const expectedDefaults: TScaleSegmentConfig = {
          className: 'my-jquery-slider__scale-segment',
          value: testViewConfig.max,
          notch: ScaleSegmentNotch.short,
          label: null,
          grow: testViewConfig.max - testViewConfig.min,
          isLast: true,
          withNotch: false,
        };

        expect(view.getScaleSegmentConfigs(calcReasonableStepStab)[0]).toEqual(expectedDefaults);
      });
      it('Должно быть два сегмента, при разумном шаге равном полному диапазону от минимума до максимума', () => {
        const calcReasonableStepStab = () => testViewConfig.max - testViewConfig.min;

        expect(view.getScaleSegmentConfigs(calcReasonableStepStab).length).toBe(2);
      });
      it('Первый сегмент из двух должен отображать минимальной значение в конфигурации View', () => {
        const calcReasonableStepStab = () => testViewConfig.max - testViewConfig.min;

        expect(view.getScaleSegmentConfigs(calcReasonableStepStab)[0].value)
          .toBe(testViewConfig.min);
      });
      it('Второй сегмент из двух должен отображать максимальное значение в конфигурации View', () => {
        const calcReasonableStepStab = () => testViewConfig.max - testViewConfig.min;

        expect(view.getScaleSegmentConfigs(calcReasonableStepStab)[1].value)
          .toBe(testViewConfig.max);
      });
      it('Оба сегмента из двух должны быть сконфигурированы с нормальной длиной засечки', () => {
        const calcReasonableStepStab = () => testViewConfig.max - testViewConfig.min;
        const testNotch = 'normal';

        const scaleSegmentConfigs = view.getScaleSegmentConfigs(calcReasonableStepStab);

        expect(scaleSegmentConfigs[0].notch).toBe(testNotch);
        expect(scaleSegmentConfigs[1].notch).toBe(testNotch);
      });
      it('У обоих сегментов из двух должна отсутствовать подпись', () => {
        const calcReasonableStepStab = () => testViewConfig.max - testViewConfig.min;

        const scaleSegmentConfigs = view.getScaleSegmentConfigs(calcReasonableStepStab);

        expect(scaleSegmentConfigs[0].label).toBeNull();
        expect(scaleSegmentConfigs[1].label).toBeNull();
      });
      it('Коэффициент роста первого сегмента из двух должен быть равен разумному шагу', () => {
        const testAbsRange = testViewConfig.max - testViewConfig.min;
        const calcReasonableStepStab = () => testAbsRange;

        const scaleSegmentConfigs = view.getScaleSegmentConfigs(calcReasonableStepStab);

        expect(scaleSegmentConfigs[0].grow).toBe(testAbsRange);
      });
      it('Коэффициент роста второго сегмента из двух должен быть равен нулю', () => {
        const testAbsRange = testViewConfig.max - testViewConfig.min;
        const calcReasonableStepStab = () => testAbsRange;

        const scaleSegmentConfigs = view.getScaleSegmentConfigs(calcReasonableStepStab);

        expect(scaleSegmentConfigs[1].grow).toBe(0);
      });
      it('Первый сегмент из двух не должен иметь флаг последнего сегмента', () => {
        const testAbsRange = testViewConfig.max - testViewConfig.min;
        const calcReasonableStepStab = () => testAbsRange;

        const scaleSegmentConfigs = view.getScaleSegmentConfigs(calcReasonableStepStab);

        expect(scaleSegmentConfigs[0].isLast).toBeFalsy();
      });
      it('Второй сегмент из двух должен иметь флаг последнего сегмента', () => {
        const testAbsRange = testViewConfig.max - testViewConfig.min;
        const calcReasonableStepStab = () => testAbsRange;

        const scaleSegmentConfigs = view.getScaleSegmentConfigs(calcReasonableStepStab);

        expect(scaleSegmentConfigs[1].isLast).toBeTruthy();
      });
      it('Количество сегментов должно быть равно 11, при абсолютном диапазоне в 100 и разумном шаге 10', () => {
        const testConfig = { ...testViewConfig, min: 20, max: 120 };
        const testView = new View(root, testConfig);
        const calcReasonableStepStab = () => 10;

        const scaleSegmentConfigs = testView.getScaleSegmentConfigs(calcReasonableStepStab);

        expect(scaleSegmentConfigs.length).toBe(11);
      });
      it('Коэффициент роста второго сегмента должен быть равен разумному шагу', () => {
        const testReasonableStep = 10;
        const calcReasonableStepStab = () => testReasonableStep;

        const scaleSegmentConfigs = view.getScaleSegmentConfigs(calcReasonableStepStab);

        expect(scaleSegmentConfigs[1].grow).toBe(testReasonableStep);
      });
      it('Коэффициент роста последнего сегмента должен быть равен разнице абсолютного диапазона и произведения разумного шага на количество предыдущих сегментов', () => {
        const testConfig = { ...testViewConfig, min: 20, max: 120 };
        const testView = new View(root, testConfig);
        const testReasonableStep = 7;
        const calcReasonableStepStab = () => testReasonableStep;

        const scaleSegmentConfigs = testView.getScaleSegmentConfigs(calcReasonableStepStab);

        const expectedGrow = (testConfig.max - testConfig.min)
          - testReasonableStep * (scaleSegmentConfigs.length - 1);
        expect(scaleSegmentConfigs[scaleSegmentConfigs.length - 1].grow).toBe(expectedGrow);
      });
      it('Коэффициент роста последнего сегмента не должен быть в диапазоне от 0 до 1', () => {
        const testConfig = { ...testViewConfig, min: -0.2, max: 0.7 };
        const testView = new View(root, testConfig);
        const testReasonableStep = 0.2;
        const calcReasonableStepStab = () => testReasonableStep;

        const scaleSegmentConfigs = testView.getScaleSegmentConfigs(calcReasonableStepStab);

        const { grow } = scaleSegmentConfigs[scaleSegmentConfigs.length - 1];
        expect(grow > 0 && grow < 1).toBeFalsy();
      });
      it('Коэффициент роста первого сегмента не должен быть в диапазоне от 0 до 1', () => {
        const testConfig = { ...testViewConfig, min: -0.2, max: 0.7 };
        const testView = new View(root, testConfig);
        const testReasonableStep = 0.2;
        const calcReasonableStepStab = () => testReasonableStep;

        const scaleSegmentConfigs = testView.getScaleSegmentConfigs(calcReasonableStepStab);

        const { grow } = scaleSegmentConfigs[0];
        expect(grow > 0 && grow < 1).toBeFalsy();
      });
      it('Значение третьего сегмента должно быть равно сумме минимального значения в конфигурации View и произведения разумного шага на количество предыдущих сегментов', () => {
        const testReasonableStep = 6;
        const calcReasonableStepStab = () => testReasonableStep;

        const scaleSegmentConfigs = view.getScaleSegmentConfigs(calcReasonableStepStab);

        expect(scaleSegmentConfigs[2].value).toBe(testViewConfig.min + testReasonableStep * 2);
      });
      it('Тип засечки сегмента должен быть длинным, когда значение сегмента кратно десятикратному разумному шагу', () => {
        const testConfig = { ...testViewConfig, min: 20, max: 120 };
        const testView = new View(root, testConfig);
        const testReasonableStep = 2;
        const calcReasonableStepStab = () => testReasonableStep;

        const scaleSegmentConfigs = testView.getScaleSegmentConfigs(calcReasonableStepStab);

        expect(scaleSegmentConfigs[20].notch).toBe('long');
      });
      it('Тип засечки сегмента должен быть нормальным, когда значение сегмента не кратно десятикратному разумному шагу', () => {
        const testConfig = { ...testViewConfig, min: 20, max: 120 };
        const testView = new View(root, testConfig);
        const testReasonableStep = 2;
        const calcReasonableStepStab = () => testReasonableStep;

        const scaleSegmentConfigs = testView.getScaleSegmentConfigs(calcReasonableStepStab);

        expect(scaleSegmentConfigs[19].notch).toBe('normal');
      });
      it('Тип засечки последнего сегмента должен быть коротким, когда предыдущие сегменты не укладываются (значение не кратно разумному шагу)', () => {
        const testConfig = { ...testViewConfig, min: 20, max: 120 };
        const testView = new View(root, testConfig);
        const testReasonableStep = 3;
        const calcReasonableStepStab = () => testReasonableStep;

        const scaleSegmentConfigs = testView.getScaleSegmentConfigs(calcReasonableStepStab);

        expect(scaleSegmentConfigs[scaleSegmentConfigs.length - 1].notch).toBe('short');
      });
      it('Подписью сегмента должно быть его значение, при числовом типе шкалы в конфигурации View', () => {
        const testConfig: TViewConfig = {
          ...testViewConfig,
          min: 33,
          scale: SliderScale.numeric,
        };
        const testView = new View(root, testConfig);
        const calcReasonableStepStab = () => 1;

        const scaleSegmentConfigs = testView.getScaleSegmentConfigs(calcReasonableStepStab);

        expect(scaleSegmentConfigs[0].label).toBe(testConfig.min);
      });
      it('Подписью сегмента должно быть имя соответственно списка имен в конфигурации View, при именованном типе шкалы', () => {
        const testMin = 33;
        const testReasonableStep = 10;
        const testValue = testMin + testReasonableStep;
        const testName = 'test-name';
        const testLabelsList = new Map([[testMin, 'not-test'], [testValue, testName]]);
        const testConfig: TViewConfig = {
          ...testViewConfig,
          min: testMin,
          values: [testValue],
          scale: SliderScale.named,
          labelsList: testLabelsList,
        };
        const testView = new View(root, testConfig);
        const calcReasonableStepStab = () => testReasonableStep;

        const scaleSegmentConfigs = testView.getScaleSegmentConfigs(calcReasonableStepStab);

        expect(scaleSegmentConfigs[1].label).toBe(testName);
      });
      it('Подписью сегмента должно быть имя соответственно списка имен в конфигурации View, при смешанном типе шкалы', () => {
        const testMin = 33;
        const testReasonableStep = 10;
        const testValue = testMin + testReasonableStep;
        const testName = 'test-name';
        const testLabelsList = new Map([[testMin, 'not-test'], [testValue, testName]]);
        const testConfig: TViewConfig = {
          ...testViewConfig,
          min: testMin,
          values: [testValue],
          scale: SliderScale.mixed,
          labelsList: testLabelsList,
        };
        const testView = new View(root, testConfig);
        const calcReasonableStepStab = () => testReasonableStep;

        const scaleSegmentConfigs = testView.getScaleSegmentConfigs(calcReasonableStepStab);

        expect(scaleSegmentConfigs[1].label).toBe(testName);
      });
    });
  });
  describe('Ре-рендер в процессе взаимодействия', () => {
    let view: View;
    beforeEach(() => {
      root = document.createElement('div');
      viewConfig = {
        min: 10,
        max: 90,
        values: [40],
        names: ['test'],
        step: 2,
        orientation: SliderOrientation.horizontal,
        perValues: [10, 40, 90],
        activeRange: 1,
        actualRanges: [1],
        withLabel: true,
        label: SliderLabel.number,
        scale: null,
        labelsList: new Map<number, string>(),
        lengthPx: null,
        withIndent: false,
        scaleSegments: null,
        withNotch: null,
      };
      view = new View(root);
      view.render(viewConfig);
    });
    it('Сумма отступа и длины бара должна быть равна обрабатываемому процентному значению, после выбора диапазона, процентного значения и рендера', () => {
      const testActiveRange = 1;
      const testPerValue = 55;

      view.handleSelectRange({ id: testActiveRange });
      view.handleSelectPerValue(testPerValue);
      view.render(viewConfig);

      const expectedSum = view.getBarConfigs()[testActiveRange].indentPer
        + view.getBarConfigs()[testActiveRange].lengthPer;
      expect(expectedSum).toBe(testPerValue);
    });
    it('Сумма отступа и длины бара должна быть равна соответствующему значению из списка процентных значений конфигурации View, после события подъема указателя и рендера', () => {
      const testActiveRange = 1;
      const testPerValue = 55;

      view.handleSelectRange({ id: testActiveRange });
      view.handleSelectPerValue(testPerValue);
      document.dispatchEvent(new Event('pointerup'));
      view.render(viewConfig);

      const expectedSum = view.getBarConfigs()[testActiveRange].indentPer
        + view.getBarConfigs()[testActiveRange].lengthPer;
      expect(expectedSum).toBe(viewConfig.perValues[testActiveRange]);
    });
    it('Сумма отступа и длины бара должна быть равна процентному значению следующего диапазона, после выбора диапазона, процентного больше следующего и рендера', () => {
      const testActiveRange = 1;
      const testPerValue = 99;

      view.handleSelectRange({ id: testActiveRange });
      view.handleSelectPerValue(testPerValue);
      view.render(viewConfig);

      const expectedSum = view.getBarConfigs()[testActiveRange].indentPer
        + view.getBarConfigs()[testActiveRange].lengthPer;
      expect(expectedSum).toBe(viewConfig.perValues[testActiveRange + 1]);
    });
    it('Сумма отступа и длины бара должна быть равна процентному значению предыдущего диапазона, после выбора диапазона, процентного меньше предыдущего и рендера', () => {
      const testActiveRange = 1;
      const testPerValue = 1;

      view.handleSelectRange({ id: testActiveRange });
      view.handleSelectPerValue(testPerValue);
      view.render(viewConfig);

      const expectedSum = view.getBarConfigs()[testActiveRange].indentPer
        + view.getBarConfigs()[testActiveRange].lengthPer;
      expect(expectedSum).toBe(viewConfig.perValues[testActiveRange - 1]);
    });
    it('Сумма отступа и длины первого бара должна быть равна нулю, после выбора первого диапазона, процентного значения меньше нуля и рендера', () => {
      const testActiveRange = 0;
      const testPerValue = -1;
      const testConfig = { ...viewConfig, activeRange: testActiveRange };
      view.render(testConfig);

      view.handleSelectRange({ id: testActiveRange });
      view.handleSelectPerValue(testPerValue);
      view.render(testConfig);

      const expectedSum = view.getBarConfigs()[testActiveRange].indentPer
        + view.getBarConfigs()[testActiveRange].lengthPer;
      expect(expectedSum).toBe(0);
    });
    it('Сумма отступа и длины последнего бара должна быть равна 100, после выбора последнего диапазона, процентного значения больше 100 и рендера', () => {
      const testActiveRange = 2;
      const testPerValue = 110;
      const testConfig = { ...viewConfig, activeRange: testActiveRange };
      view.render(testConfig);

      view.handleSelectRange({ id: testActiveRange });
      view.handleSelectPerValue(testPerValue);
      view.render(testConfig);

      const expectedSum = view.getBarConfigs()[testActiveRange].indentPer
        + view.getBarConfigs()[testActiveRange].lengthPer;
      expect(expectedSum).toBe(100);
    });
    it('Сумма отступа и длины бара должна быть равна 0, после выбора единственного диапазона, процентного значения меньше 0 и рендера', () => {
      const testActiveRange = 0;
      const testPerValue = -10;
      const testConfig = { ...viewConfig, perValues: [50], activeRange: testActiveRange };
      view.render(testConfig);

      view.handleSelectRange({ id: testActiveRange });
      view.handleSelectPerValue(testPerValue);
      view.render(testConfig);

      const expectedSum = view.getBarConfigs()[testActiveRange].indentPer
        + view.getBarConfigs()[testActiveRange].lengthPer;
      expect(expectedSum).toBe(0);
    });
    it('Сумма отступа и длины бара должна быть равна 100, после выбора единственного диапазона, процентного значения больше 100 и рендера', () => {
      const testActiveRange = 0;
      const testPerValue = 110;
      const testConfig = { ...viewConfig, perValues: [50], activeRange: testActiveRange };
      view.render(testConfig);

      view.handleSelectRange({ id: testActiveRange });
      view.handleSelectPerValue(testPerValue);
      view.render(testConfig);

      const expectedSum = view.getBarConfigs()[testActiveRange].indentPer
        + view.getBarConfigs()[testActiveRange].lengthPer;
      expect(expectedSum).toBe(100);
    });
    it('Сумма отступа и длины бара должна быть равна выбранному значению, после выбора единственного диапазона, процентного значения и рендера', () => {
      const testActiveRange = 0;
      const testPerValue = 40;
      const testConfig = { ...viewConfig, perValues: [50], activeRange: testActiveRange };
      view.render(testConfig);

      view.handleSelectRange({ id: testActiveRange });
      view.handleSelectPerValue(testPerValue);
      view.render(testConfig);

      const expectedSum = view.getBarConfigs()[testActiveRange].indentPer
        + view.getBarConfigs()[testActiveRange].lengthPer;
      expect(expectedSum).toBe(testPerValue);
    });
    it('Сумма отступа и длины бара должна быть равна выбранному значению, после выбора первого диапазона, процентного значения меньшего чем у второго и рендера', () => {
      const testActiveRange = 0;
      const testPerValue = 60;
      const testConfig = { ...viewConfig, perValues: [50, 75], activeRange: testActiveRange };
      view.render(testConfig);

      view.handleSelectRange({ id: testActiveRange });
      view.handleSelectPerValue(testPerValue);
      view.render(testConfig);

      const expectedSum = view.getBarConfigs()[testActiveRange].indentPer
        + view.getBarConfigs()[testActiveRange].lengthPer;
      expect(expectedSum).toBe(testPerValue);
    });
    it('Сумма отступа и длины бара должна быть равна значению второго диапазона, после выбора первого диапазона, процентного значения большего чем у второго и рендера', () => {
      const testActiveRange = 0;
      const testPerValue = 80;
      const testConfig = { ...viewConfig, perValues: [50, 75], activeRange: testActiveRange };
      view.render(testConfig);

      view.handleSelectRange({ id: testActiveRange });
      view.handleSelectPerValue(testPerValue);
      view.render(testConfig);

      const expectedSum = view.getBarConfigs()[testActiveRange].indentPer
        + view.getBarConfigs()[testActiveRange].lengthPer;
      expect(expectedSum).toBe(75);
    });
    it('Сумма отступа и длины бара должна быть равна значению первого диапазона, после выбора второго диапазона, процентного значения меньшего чем у первого и рендера', () => {
      const testActiveRange = 1;
      const testPerValue = 40;
      const testConfig = { ...viewConfig, perValues: [50, 75], activeRange: testActiveRange };
      view.render(testConfig);

      view.handleSelectRange({ id: testActiveRange });
      view.handleSelectPerValue(testPerValue);
      view.render(testConfig);

      const expectedSum = view.getBarConfigs()[testActiveRange].indentPer
        + view.getBarConfigs()[testActiveRange].lengthPer;
      expect(expectedSum).toBe(50);
    });
    it('Сумма отступа и длины бара должна быть выбранному значению, после выбора второго диапазона, процентного значения большего чем у первого и рендера', () => {
      const testActiveRange = 1;
      const testPerValue = 60;
      const testConfig = { ...viewConfig, perValues: [50, 75], activeRange: testActiveRange };
      view.render(testConfig);

      view.handleSelectRange({ id: testActiveRange });
      view.handleSelectPerValue(testPerValue);
      view.render(testConfig);

      const expectedSum = view.getBarConfigs()[testActiveRange].indentPer
        + view.getBarConfigs()[testActiveRange].lengthPer;
      expect(expectedSum).toBe(testPerValue);
    });
    it('Возможно получить конфигурацию шкалы после обновления с опцией шкалы', () => {
      view.render(viewConfig);

      view.render({ ...viewConfig, scale: SliderScale.basic });

      expect(view.getScaleConfig()).toBeDefined();
    });
  });
});
