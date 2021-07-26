import { IModel, Model } from "../Model";

describe('Издатель и фасад модели', () => {
  // - подготовка
  it('Инстанс должен быть создан', () => {
    let model: IModel;
    // - действие
    model = new Model();
    // - проверка
    expect(model).toBeDefined();
  })
  it('Все подписчики должены быть оповещены после обновления', () => {
    const model: IModel = new Model();
    const subscriber1: jest.Mock = jest.fn();
    const subscriber2: jest.Mock = jest.fn();
    model.subscribe(subscriber1);
    model.subscribe(subscriber2);
    // - действие
    model.update();
    // - проверка
    expect(subscriber1).toBeCalledTimes(1);
    expect(subscriber2).toBeCalledTimes(1);
  })
  it('После отписки подписчик больше не уведомляется', () => {
    const model: IModel = new Model();
    const subscriber1: jest.Mock = jest.fn();
    const subscriber2: jest.Mock = jest.fn();
    model.subscribe(subscriber1);
    model.subscribe(subscriber2);
    // - действие
    model.update();
    model.unsubscribe(subscriber1);
    model.update();
    // - проверка
    expect(subscriber1).toBeCalledTimes(1);
    expect(subscriber2).toBeCalledTimes(2);
  })
})