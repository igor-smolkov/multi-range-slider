/**
 * @jest-environment jsdom
 */

import { ILabel, Label } from "../Label";

describe('Подпись', () => {
  // - подготовка
  it('Инстанс должен быть создан', () => {
    // - действие
    const label: ILabel = new Label();
    // - проверка
    expect(label).toBeDefined();
  })
  it('Элемент должен быть создан', () => {
    // - действие
    const label: ILabel = new Label();
    // - проверка
    expect(label.getElem()).toBeDefined();
  })
  it('Элемент должен содержать дефолтную подпись', () => {
    const expectedText = '?'
    // - действие
    const label: ILabel = new Label();
    // - проверка
    expect(label.getElem().innerText).toBe(expectedText);
  })
  it('Элемент должен содержать дефолтный класс', () => {
    const expectedClassName = 'label'
    // - действие
    const label: ILabel = new Label();
    // - проверка
    expect(label.getElem().classList.contains(expectedClassName)).toBeTruthy();
  })
  it('Элемент должен содержать класс переданный в опциях', () => {
    const testClassName = 'my-label'
    // - действие
    const label: ILabel = new Label({ className: testClassName, text: 'stab' });
    // - проверка
    expect(label.getElem().classList.contains(testClassName)).toBeTruthy();
  })
  it('Элемент должен содержать текст переданный в опциях', () => {
    const testText = 'my-value'
    // - действие
    const label: ILabel = new Label({ className: 'stab', text: testText });
    // - проверка
    expect(label.getElem().innerText).toBe(testText);
  })
  it('Элемент должен содержать текст переданный в опциях, после обновления', () => {
    const label: ILabel = new Label({ className: 'stab', text: 'my-value' });
    const testText = 'my-new-value';
    // - действие
    label.update({ className: 'stab', text: testText });
    // - проверка
    expect(label.getElem().innerText).toBe(testText);
  })
})