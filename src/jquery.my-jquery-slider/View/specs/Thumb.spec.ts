/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-useless-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */
/* eslint-disable max-classes-per-file */

import { ILabel } from '../Label';
import { IThumb, Thumb } from '../Thumb';
import { IViewHandler } from '../View';

describe('Палец', () => {
  // - подготовка
  class LabelStab implements ILabel {
    update(): void {}
    getElem(): HTMLDivElement { return; }
  }
  class ViewHandlerStab implements IViewHandler {
    handleSelectRange(): void {}
    handleSelectValue(): void {}
    handleSelectPerValue(): void {}
    handleStepForward(): void {}
    handleStepBackward(): void {}
    handleFocus(): void {}
  }
  it('Экземпляр должен быть создан', () => {
    // - действие
    const thumb: IThumb = new Thumb(new LabelStab(), new ViewHandlerStab());
    // - проверка
    expect(thumb).toBeDefined();
  });
  it('Элемент должен быть создан', () => {
    // - действие
    const thumb: IThumb = new Thumb(new LabelStab(), new ViewHandlerStab());
    // - проверка
    expect(thumb.getElem()).toBeDefined();
  });
  it('Элемент должен быть пуст', () => {
    // - действие
    const thumb: IThumb = new Thumb(new LabelStab(), new ViewHandlerStab());
    // - проверка
    expect(thumb.getElem().childNodes.length).toBe(0);
  });
  it('Элемент должен содержать один элемент при флаге в опциях отражающем наличии подписи', () => {
    // - действие
    const thumb: IThumb = new Thumb(
      new LabelStab(),
      new ViewHandlerStab(),
      {
        className: 'stab',
        id: 0,
        withLabel: true,
      },
    );
    // - проверка
    expect(thumb.getElem().childNodes.length).toBe(1);
  });
  it('Элемент должен содержать дефолтный класс', () => {
    const expectedClassName = 'thumb';
    // - действие
    const thumb: IThumb = new Thumb(new LabelStab(), new ViewHandlerStab());
    // - проверка
    expect(thumb.getElem().classList.contains(expectedClassName)).toBeTruthy();
  });
  it('Элемент должен содержать класс заданный в опциях', () => {
    const testClassName = 'my-thumb';
    // - действие
    const thumb: IThumb = new Thumb(
      new LabelStab(), new ViewHandlerStab(), { className: testClassName, id: 0 },
    );
    // - проверка
    expect(thumb.getElem().classList.contains(testClassName)).toBeTruthy();
  });
  it('Должен возвращать флаг отражающий обработанное состояние', () => {
    const thumb: IThumb = new Thumb(new LabelStab(), new ViewHandlerStab());
    // - действие / проверка
    expect(thumb.isProcessed()).toBeTruthy();
  });
  it('Должен возвращать флаг отражающий необработанное состояние, после активации', () => {
    const thumb: IThumb = new Thumb(new LabelStab(), new ViewHandlerStab());
    // - действие
    thumb.activate();
    // - проверка
    expect(thumb.isProcessed()).toBeFalsy();
  });
  it('Должен возвращать флаг отражающий необработанное состояние, после опускания указателя на элементе', () => {
    const thumb: IThumb = new Thumb(new LabelStab(), new ViewHandlerStab());
    // - действие
    thumb.getElem().dispatchEvent(new Event('pointerdown'));
    // - проверка
    expect(thumb.isProcessed()).toBeFalsy();
  });
  it('В обработчик вью должен быть передан идентификатор, после активации', () => {
    const viewHandlerStab = new ViewHandlerStab();
    const spy = jest.spyOn(viewHandlerStab, 'handleSelectRange');
    const expectedId = 23;
    const thumb: IThumb = new Thumb(new LabelStab(), viewHandlerStab, { className: 'stab', id: expectedId });
    // - действие
    thumb.activate();
    // - проверка
    expect(spy).toHaveBeenCalledWith(expectedId);
  });
  it('В обработчик вью должен быть передан идентификатор, после фокусировки на элементе', () => {
    const viewHandlerStab = new ViewHandlerStab();
    const spy = jest.spyOn(viewHandlerStab, 'handleFocus');
    const expectedId = 23;
    const thumb: IThumb = new Thumb(new LabelStab(), viewHandlerStab, { className: 'stab', id: expectedId });
    // - действие
    thumb.getElem().dispatchEvent(new Event('focus'));
    // - проверка
    expect(spy).toHaveBeenCalledWith(expectedId);
  });
  it('Обработчики сдвига не должны быть вызваны, при нажатии клавиши', () => {
    const viewHandlerStab = new ViewHandlerStab();
    const spy1 = jest.spyOn(viewHandlerStab, 'handleStepForward');
    const spy2 = jest.spyOn(viewHandlerStab, 'handleStepBackward');
    const thumb: IThumb = new Thumb(new LabelStab(), viewHandlerStab, { className: 'stab', id: 0 });
    // - действие
    thumb.getElem().dispatchEvent(new Event('keydown'));
    // - проверка
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });
  it('Обработчик сдвига вперед должен быть вызван, при нажатии клавиши вправо', () => {
    const viewHandlerStab = new ViewHandlerStab();
    const spy = jest.spyOn(viewHandlerStab, 'handleStepForward');
    const thumb: IThumb = new Thumb(new LabelStab(), viewHandlerStab, { className: 'stab', id: 0 });
    // - действие
    thumb.getElem().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    // - проверка
    expect(spy).toHaveBeenCalled();
  });
  it('Обработчик сдвига вперед должен быть вызван, при нажатии клавиши вверх', () => {
    const viewHandlerStab = new ViewHandlerStab();
    const spy = jest.spyOn(viewHandlerStab, 'handleStepForward');
    const thumb: IThumb = new Thumb(new LabelStab(), viewHandlerStab, { className: 'stab', id: 0 });
    // - действие
    thumb.getElem().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    // - проверка
    expect(spy).toHaveBeenCalled();
  });
  it('Обработчик сдвига назад должен быть вызван, при нажатии клавиши влево', () => {
    const viewHandlerStab = new ViewHandlerStab();
    const spy = jest.spyOn(viewHandlerStab, 'handleStepBackward');
    const thumb: IThumb = new Thumb(new LabelStab(), viewHandlerStab, { className: 'stab', id: 0 });
    // - действие
    thumb.getElem().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    // - проверка
    expect(spy).toHaveBeenCalled();
  });
  it('Обработчик сдвига назад должен быть вызван, при нажатии клавиши вниз', () => {
    const viewHandlerStab = new ViewHandlerStab();
    const spy = jest.spyOn(viewHandlerStab, 'handleStepBackward');
    const thumb: IThumb = new Thumb(new LabelStab(), viewHandlerStab, { className: 'stab', id: 0 });
    // - действие
    thumb.getElem().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    // - проверка
    expect(spy).toHaveBeenCalled();
  });
  it('Должен возвращать флаг отражающий обработанное состояние, после активации и подъеме указателя на элементе', () => {
    const thumb: IThumb = new Thumb(new LabelStab(), new ViewHandlerStab());
    thumb.activate();
    // - действие
    document.dispatchEvent(new Event('pointerup'));
    // - проверка
    expect(thumb.isProcessed()).toBeTruthy();
  });
  it('Элемент должен содержать один элемент после обновления с флагом отражающим наличие подписи', () => {
    const thumb: IThumb = new Thumb(new LabelStab(), new ViewHandlerStab());
    // - действие
    thumb.update({ className: 'stab', id: 0, withLabel: true });
    // - проверка
    expect(thumb.getElem().childNodes.length).toBe(1);
  });
  it('Элемент должен быть пустым после обновления', () => {
    const thumb: IThumb = new Thumb(
      new LabelStab(),
      new ViewHandlerStab(),
      {
        className: 'stab',
        id: 0,
        withLabel: true,
      },
    );
    // - действие
    thumb.update({ className: 'stab', id: 0, withLabel: false });
    // - проверка
    expect(thumb.getElem().childNodes.length).toBe(0);
  });
  it('Элемент должен содержать один элемент после обновления', () => {
    const thumb: IThumb = new Thumb(
      new LabelStab(),
      new ViewHandlerStab(),
      {
        className: 'stab',
        id: 0,
        withLabel: true,
      },
    );
    // - действие
    thumb.update({ className: 'stab', id: 0 });
    // - проверка
    expect(thumb.getElem().childNodes.length).toBe(1);
  });
});
