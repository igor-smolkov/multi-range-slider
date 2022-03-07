/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable lines-between-class-members */
/* eslint-disable no-useless-return */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
import { IEventEmitter } from '../../EventEmitter';
import { TMyJQuerySlider, SliderOrientation } from '../../TMyJQuerySlider';
import { ILabelsList, TOrderedLabels } from '../LabelsList';
import {
  Changes, IModel, Model, ModelEvent,
} from '../Model';
import { ISlider } from '../Slider';
import { Range } from '../Range';

const eventEmitterCallback = jest.fn();
let eventEmitterArgs: Changes;
class EventEmitterStab implements IEventEmitter {
  subscribe(): void {}
  unsubscribe(): void {}
  emit(eventName: string, args?: unknown): void {
    eventEmitterArgs = args as Changes;
    eventEmitterCallback(args);
  }
}
let sliderStateStab: TMyJQuerySlider;
class SliderStab implements ISlider {
  update(): void {}
  getMin(): number { return sliderStateStab.min as number; }
  setMin(): number { return 0; }
  getMax(): number { return sliderStateStab.max as number; }
  setMax(): number { return 0; }
  getValue(): number { return 0; }
  setValue(): number { return 0; }
  setPerValue(): number { return 0; }
  getStep(): number { return sliderStateStab.step as number; }
  getMinInterval(): number { return 0; }
  getMaxInterval(): number { return 0; }
  getActualRanges(): number[] { return []; }
  getActiveRange(): number { return 0; }
  setActiveRange(): number { return 0; }
  setActiveRangeCloseOfValue(): number { return 0; }
  getPerValues(): number[] { return []; }
  getValues(): number[] { return []; }
  getLimits(): number[] { return sliderStateStab.limits as number[]; }
  isDouble(): boolean { return false; }
  getAbsoluteRange(): number { return 0; }
  stepForward(): void {}
  stepBackward(): void {}
}
class LabelsListStab implements ILabelsList {
  update(): void {}
  getLabels(): TOrderedLabels { return new Map(); }
  getMinKey(): number { return 0; }
  getMaxKey(): number { return 0; }
  isFlat(): boolean { return false; }
  getClosestNameByValue(): string { return ''; }
}

jest.mock('../../EventEmitter', () => ({ EventEmitter: jest.fn().mockImplementation(() => new EventEmitterStab()) }));
jest.mock('../Slider', () => ({ Slider: jest.fn().mockImplementation(() => new SliderStab()) }));
jest.mock('../Range');
const RangeMock = Range as jest.MockedClass<typeof Range>;
jest.mock('../LabelsList', () => ({ LabelsList: jest.fn().mockImplementation(() => new LabelsListStab()) }));

describe('Издатель и фасад модели', () => {
  beforeEach(() => { sliderStateStab = { min: 0, max: 100, step: 1 }; });
  afterEach(() => { RangeMock.mockClear(); });
  it('Экземпляр должен быть создан', () => {
    const model: IModel = new Model();

    expect(model).toBeDefined();
  });
  describe('Конфигурирование диапазонов', () => {
    let model: IModel;
    beforeEach(() => {
      model = new Model();
      RangeMock.mockClear();
      sliderStateStab = { min: 0, max: 100, step: 1 };
    });
    afterEach(() => { RangeMock.mockClear(); });
    it('Диапазон должен быть вызван один раз, при отсутствии опций', () => {
      model.init();

      expect(RangeMock).toHaveBeenCalledTimes(1);
    });
    it('Диапазон должен быть вызван два раза, при опции двойного слайдера', () => {
      model.init({ isDouble: true });

      expect(RangeMock).toHaveBeenCalledTimes(2);
    });
    it('Диапазон должен быть вызван три раза, при опции лимитов с 5 значениями', () => {
      const min = 0;
      const max = 100;
      sliderStateStab = { min, max, step: 1 };

      model.init({ limits: [min, 20, 30, 40, max] });

      expect(RangeMock).toHaveBeenCalledTimes(3);
    });
    it('Диапазон должен быть вызван два раза, при опции минимального и максимального интервала', () => {
      model.init({ minInterval: 20, maxInterval: 30 });

      expect(RangeMock).toHaveBeenCalledTimes(2);
    });
    it('Диапазон должен быть вызван один раз, при опции лимитов с одним значением', () => {
      const min = 0;
      const max = 100;
      sliderStateStab = { min, max, step: 1 };

      model.init({ limits: [max] });

      expect(RangeMock).toHaveBeenCalledTimes(1);
    });
    it('Диапазон должен быть вызван один раз, при опции лимитов без значений', () => {
      model.init({ limits: [] });

      expect(RangeMock).toHaveBeenCalledTimes(1);
    });
    it('Первый диапазон должен быть вызван с текущим значением равным значению в опциях, при опции первого активного диапазона и двойного слайдера', () => {
      const value = 13;
      const maxInterval = 90;
      const min = 0;
      const max = 100;
      sliderStateStab = { min, max, step: 1 };

      model.init({
        isDouble: true,
        activeRange: 0,
        value,
        min,
        max,
        maxInterval,
      });

      expect(RangeMock).toHaveBeenNthCalledWith(1, { current: value, min, max: maxInterval });
    });
    it('Второй диапазон должен быть вызван с текущим значением равным значению в опциях, при опции второго активного диапазона и двойного слайдера', () => {
      const value = 13;
      const minInterval = 90;
      const min = 0;
      const max = 100;
      sliderStateStab = { min, max, step: 1 };

      model.init({
        isDouble: true,
        activeRange: 1,
        value,
        min,
        max,
        minInterval,
      });

      expect(RangeMock).toHaveBeenNthCalledWith(2, { current: value, min: minInterval, max });
    });
    it('Диапазон должен быть вызван с текущим значением равным максимуму в опциях, при отсутствии текущего значения и наличии минимума и максимума в опциях', () => {
      const min = 0;
      const max = 100;
      sliderStateStab = { min, max, step: 1 };

      model.init({ min, max });

      expect(RangeMock).toHaveBeenCalledWith({ current: max, min, max });
    });
    it('Диапазон должен быть вызван с текущим значением в опциях', () => {
      const value = 17;
      const min = 0;
      const max = 100;
      sliderStateStab = { min, max, step: 1 };

      model.init({ value, min, max });

      expect(RangeMock).toHaveBeenCalledWith({ current: value, min, max });
    });
  });
  describe('Настройка слайдера в соответствии со списком', () => {
    it('Вызывается установка минимального значения слайдера со значением минимального ключа списка, когда это значение меньше минимума', () => {
      const testKey = 5;
      sliderStateStab = { min: 10, max: 100, step: 1 };
      LabelsListStab.prototype.getMinKey = () => testKey;
      const spy = jest.spyOn(SliderStab.prototype, 'setMin');

      const model: IModel = new Model();
      model.init();

      expect(spy).toHaveBeenCalledWith(testKey);
    });
    it('Вызывается установка максимального значения слайдера со значением максимального ключа списка, когда это значение больше максимума', () => {
      const testKey = 500;
      sliderStateStab = { min: 10, max: 100, step: 1 };
      LabelsListStab.prototype.getMaxKey = () => testKey;
      const spy = jest.spyOn(SliderStab.prototype, 'setMax');

      const model: IModel = new Model();
      model.init();

      expect(spy).toHaveBeenCalledWith(testKey);
    });
  });
  describe('Перенастройка при обновлении', () => {
    beforeEach(() => {
      sliderStateStab = {
        min: 0, max: 100, step: 1, limits: [0, 50, 100],
      };
    });
    afterEach(() => { RangeMock.mockClear(); });
    it('Диапазон должен быть вызван два раза, после обновления с опцией двойного слайдера', () => {
      const model: IModel = new Model();
      model.init();
      RangeMock.mockClear();

      model.update({ isDouble: true });

      expect(RangeMock).toHaveBeenCalledTimes(2);
    });
    it('Диапазон должен быть вызван один раз, после обновления с опцией двойного слайдера', () => {
      sliderStateStab = {
        min: 0, max: 100, step: 1, limits: [0, 25, 75, 100],
      };
      const model: IModel = new Model();
      model.init({ isDouble: true });
      RangeMock.mockClear();

      model.update({ isDouble: false });

      expect(RangeMock).toHaveBeenCalledTimes(1);
    });
    it('Диапазон должен быть вызван три раза, после обновления с опцией лимитов с 5 значениями', () => {
      const model: IModel = new Model();
      model.init();
      RangeMock.mockClear();

      model.update({ limits: [1, 2, 3, 4, 5] });

      expect(RangeMock).toHaveBeenCalledTimes(3);
    });
    it('Должен быть вызван метод обновления слайдера, после обновления с опциями не меняющими число диапазонов', () => {
      const spy = jest.spyOn(SliderStab.prototype, 'update');
      const model: IModel = new Model();
      model.init();

      model.update({ value: 10 });

      expect(spy).toHaveBeenCalled();
    });
    it('Должен быть вызван метод обновления списка, после обновления с опцией списка', () => {
      const spy = jest.spyOn(LabelsListStab.prototype, 'update');
      const model: IModel = new Model();
      model.init();

      model.update({ labelsList: ['a', 'b', 'c'] });

      expect(spy).toHaveBeenCalled();
    });
  });
  describe('Подписка и оповещение', () => {
    let model: IModel;
    beforeEach(() => {
      sliderStateStab = {
        min: 0, max: 100, step: 1, limits: [0, 50, 100],
      };
      model = new Model();
      model.init();
      eventEmitterCallback.mockClear();
    });
    it('На событие init должна быть оформлена подписка с переданной функцией обратного вызова', () => {
      const testModel = new Model();
      const event = ModelEvent.init;
      const callback = () => {};
      const spy = jest.spyOn(EventEmitterStab.prototype, 'subscribe');

      testModel.on(event, callback);

      expect(spy).toBeCalledWith(event, callback);
    });
    it('Подписчик должен быть уведомлен после обновления', () => {
      model.update();

      expect(eventEmitterCallback).toBeCalledTimes(1);
    });
    it('Подписчик должен быть уведомлен после установки значения', () => {
      model.setValue(12);

      expect(eventEmitterCallback).toBeCalledTimes(1);
    });
    it('Подписчик должен быть уведомлен после установки процентного значения', () => {
      model.setPerValue(12);

      expect(eventEmitterCallback).toBeCalledTimes(1);
    });
    it('Подписчик должен быть уведомлен после выбора диапазона', () => {
      model.setActiveRange(0);

      expect(eventEmitterCallback).toBeCalledTimes(1);
    });
    it('Подписчик должен быть уведомлен после выбора диапазона близкого к значению', () => {
      model.setActiveRangeCloseOfValue(10);

      expect(eventEmitterCallback).toBeCalledTimes(1);
    });
    it('Подписчик должен быть уведомлен после шага вперед слайдера', () => {
      model.stepForward();

      expect(eventEmitterCallback).toBeCalledTimes(1);
    });
    it('Подписчик должен быть уведомлен после шага назад слайдера', () => {
      model.stepBackward();

      expect(eventEmitterCallback).toBeCalledTimes(1);
    });
  });
  it('Значение в конфигурации не зависящее от состояния объектов должно быть равно переданному в опциях', () => {
    const options: TMyJQuerySlider = { orientation: SliderOrientation.vertical };
    const model: IModel = new Model();
    eventEmitterArgs = {
      config: { orientation: SliderOrientation.horizontal },
      values: [],
      names: [],
      perValues: [],
      labelsList: new Map(),
    };
    eventEmitterCallback.mockClear();

    model.init(options);

    expect(eventEmitterArgs.config.orientation).toBe(options.orientation);
    expect(eventEmitterCallback).not.toBeCalledWith(options);
  });
});
