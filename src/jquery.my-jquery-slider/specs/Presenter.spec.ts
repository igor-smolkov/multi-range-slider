/**
 * @jest-environment jsdom
 */

import { Presenter } from "../Presenter";

const rootElem = document.createElement('div');

it('Инстанс должен быть создан', () => {
  const presenter = new Presenter(rootElem);
  expect(presenter).toBeDefined();
})