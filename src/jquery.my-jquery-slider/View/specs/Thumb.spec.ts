/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-useless-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */
/* eslint-disable max-classes-per-file */

import { IEventEmitter } from '../../EventEmitter';
import { ILabel } from '../Label';
import {
  IThumb, Thumb, ThumbEvent, TThumbConfig,
} from '../Thumb';

const eventEmitterCallback = jest.fn();
class EventEmitterStab implements IEventEmitter {
  subscribe(): void {}
  unsubscribe(): void {}
  emit(eventName: string, args?: unknown): void {
    eventEmitterCallback(eventName, args);
  }
}
jest.mock('../../EventEmitter', () => ({ EventEmitter: jest.fn().mockImplementation(() => new EventEmitterStab()) }));

const thumbConfig: TThumbConfig = {
  className: 'thumb',
  id: Date.now(),
  withLabel: false,
};

describe('Палец', () => {
  class LabelStab implements ILabel {
    update(): void {}
    getElem(): HTMLDivElement { return document.createElement('div'); }
  }
  it('Экземпляр должен быть создан', () => {
    const thumb: IThumb = new Thumb(new LabelStab(), { ...thumbConfig });

    expect(thumb).toBeDefined();
  });
  it('Элемент должен быть создан', () => {
    const thumb: IThumb = new Thumb(new LabelStab(), { ...thumbConfig });

    expect(thumb.getElem()).toBeDefined();
  });
  it('Элемент должен быть пуст', () => {
    const thumb: IThumb = new Thumb(new LabelStab(), { ...thumbConfig });

    expect(thumb.getElem().childNodes.length).toBe(0);
  });
  it('Элемент должен содержать один элемент при флаге в опциях отражающем наличии подписи', () => {
    const thumb: IThumb = new Thumb(
      new LabelStab(),
      {
        className: 'stab',
        id: 0,
        withLabel: true,
      },
    );

    expect(thumb.getElem().childNodes.length).toBe(1);
  });
  it('Элемент должен содержать класс заданный в опциях', () => {
    const testClassName = 'my-thumb';

    const thumb: IThumb = new Thumb(
      new LabelStab(), { ...thumbConfig, className: testClassName, id: 0 },
    );

    expect(thumb.getElem().classList.contains(testClassName)).toBeTruthy();
  });
  it('Должен возвращать флаг отражающий обработанное состояние', () => {
    const thumb: IThumb = new Thumb(new LabelStab(), { ...thumbConfig });

    expect(thumb.isProcessed()).toBeTruthy();
  });
  it('Должен возвращать флаг отражающий необработанное состояние, после активации', () => {
    const thumb: IThumb = new Thumb(new LabelStab(), { ...thumbConfig });

    thumb.activate();

    expect(thumb.isProcessed()).toBeFalsy();
  });
  it('Должен возвращать флаг отражающий необработанное состояние, после опускания указателя на элементе', () => {
    const thumb: IThumb = new Thumb(new LabelStab(), { ...thumbConfig });

    thumb.getElem().dispatchEvent(new Event('pointerdown'));

    expect(thumb.isProcessed()).toBeFalsy();
  });
  it('Вместе с событием select должен быть передан идентификатор, после активации', () => {
    const expectedID = 23;
    const thumb: IThumb = new Thumb(
      new LabelStab(), { ...thumbConfig, id: expectedID },
    );
    eventEmitterCallback.mockClear();

    thumb.activate();

    expect(eventEmitterCallback).toBeCalledWith(ThumbEvent.select, { id: expectedID });
    expect(eventEmitterCallback).toBeCalledTimes(1);
  });
  it('Вместе с событием select должен быть передан идентификатор, после фокусировки на элементе', () => {
    const expectedID = 23;
    const thumb: IThumb = new Thumb(
      new LabelStab(), { ...thumbConfig, id: expectedID },
    );
    eventEmitterCallback.mockClear();

    thumb.getElem().dispatchEvent(new Event('focus'));

    expect(eventEmitterCallback).toBeCalledWith(ThumbEvent.select, { id: 23, isFocusOnly: true });
    expect(eventEmitterCallback).toBeCalledTimes(1);
  });
  it('Событий stepForward и stepBackward не должно произойти, при нажатии клавиши', () => {
    const thumb: IThumb = new Thumb(new LabelStab(), { ...thumbConfig, id: 0 });
    eventEmitterCallback.mockClear();

    thumb.getElem().dispatchEvent(new Event('keydown'));

    expect(eventEmitterCallback).not.toBeCalledWith(ThumbEvent.stepForward);
    expect(eventEmitterCallback).not.toBeCalledWith(ThumbEvent.stepBackward);
  });
  it('Событие stepForward должно произойти, при нажатии клавиши вправо', () => {
    const thumb: IThumb = new Thumb(new LabelStab(), { ...thumbConfig, id: 0 });
    eventEmitterCallback.mockClear();

    thumb.getElem().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

    expect(eventEmitterCallback).toBeCalledWith(ThumbEvent.stepForward, undefined);
  });
  it('События stepForward должно произойти, при нажатии клавиши вверх', () => {
    const thumb: IThumb = new Thumb(new LabelStab(), { ...thumbConfig, id: 0 });
    eventEmitterCallback.mockClear();

    thumb.getElem().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

    expect(eventEmitterCallback).toBeCalledWith(ThumbEvent.stepForward, undefined);
  });
  it('Обработчик сдвига назад должен быть вызван, при нажатии клавиши влево', () => {
    const thumb: IThumb = new Thumb(new LabelStab(), { ...thumbConfig, id: 0 });
    eventEmitterCallback.mockClear();

    thumb.getElem().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

    expect(eventEmitterCallback).toBeCalledWith(ThumbEvent.stepBackward, undefined);
  });
  it('Обработчик сдвига назад должен быть вызван, при нажатии клавиши вниз', () => {
    const thumb: IThumb = new Thumb(new LabelStab(), { ...thumbConfig, id: 0 });
    eventEmitterCallback.mockClear();

    thumb.getElem().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    expect(eventEmitterCallback).toBeCalledWith(ThumbEvent.stepBackward, undefined);
  });
  it('Должен возвращать флаг отражающий обработанное состояние, после активации и подъеме указателя на элементе', () => {
    const thumb: IThumb = new Thumb(new LabelStab(), { ...thumbConfig });
    thumb.activate();

    document.dispatchEvent(new Event('pointerup'));

    expect(thumb.isProcessed()).toBeTruthy();
  });
  it('Элемент должен содержать один элемент после обновления с флагом отражающим наличие подписи', () => {
    const thumb: IThumb = new Thumb(new LabelStab(), { ...thumbConfig });

    thumb.update({ className: 'stab', id: 0, withLabel: true });

    expect(thumb.getElem().childNodes.length).toBe(1);
  });
  it('Элемент должен быть пустым после обновления', () => {
    const thumb: IThumb = new Thumb(
      new LabelStab(),
      {
        className: 'stab',
        id: 0,
        withLabel: true,
      },
    );

    thumb.update({ className: 'stab', id: 0, withLabel: false });

    expect(thumb.getElem().childNodes.length).toBe(0);
  });
  it('Элемент должен содержать один элемент после обновления', () => {
    const thumb: IThumb = new Thumb(
      new LabelStab(),
      {
        className: 'stab',
        id: 0,
        withLabel: true,
      },
    );

    thumb.update({ ...thumbConfig, id: 0, withLabel: true });

    expect(thumb.getElem().childNodes.length).toBe(1);
  });
  it('На событие select должна быть оформлена подписка с переданной функцией обратного вызова', () => {
    const thumb = new Thumb(new LabelStab(), { ...thumbConfig });
    const event = ThumbEvent.select;
    const callback = () => {};
    const spy = jest.spyOn(EventEmitterStab.prototype, 'subscribe');

    thumb.on(event, callback);

    expect(spy).toBeCalledWith(event, callback);
  });
});
