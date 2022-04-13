/**
 * @jest-environment jsdom
 */

import { ILabel, Label, TLabelConfig } from '../Label';

const labelConfig: TLabelConfig = {
  className: 'label',
  text: '?',
};
describe('Подпись', () => {
  it('Экземпляр должен быть создан', () => {
    const label: ILabel = new Label({ ...labelConfig });

    expect(label).toBeDefined();
  });
  it('Элемент должен быть создан', () => {
    const label: ILabel = new Label({ ...labelConfig });

    expect(label.getElem()).toBeDefined();
  });
  it('Элемент должен содержать класс переданный в опциях', () => {
    const testClassName = 'my-label';

    const label: ILabel = new Label({ className: testClassName, text: 'stab' });

    expect(label.getElem().classList.contains(testClassName)).toBeTruthy();
  });
  it('Элемент должен содержать текст переданный в опциях', () => {
    const testText = 'my-value';

    const label: ILabel = new Label({ className: 'stab', text: testText });

    expect(label.getElem().innerText).toBe(testText);
  });
  it('Элемент должен содержать текст переданный в опциях, после обновления', () => {
    const label: ILabel = new Label({ className: 'stab', text: 'my-value' });
    const testText = 'my-new-value';

    label.update({ className: 'stab', text: testText });

    expect(label.getElem().innerText).toBe(testText);
  });
});
