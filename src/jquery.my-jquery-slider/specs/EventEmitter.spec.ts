import { IEventEmitter, EventEmitter } from '../EventEmitter';

describe('Наблюдатель', () => {
  let eventEmitter: IEventEmitter;
  let callback: jest.Mock;
  beforeEach(() => {
    eventEmitter = new EventEmitter();
    callback = jest.fn();
    eventEmitter.subscribe('my-event', callback);
  });
  it('Функция обратного вызова подписчика должна быть вызвана один раз', () => {
    eventEmitter.emit('my-event');

    expect(callback).toBeCalledTimes(1);
  });
  it('Функция обратного вызова подписчика не должна быть вызвана после отписки', () => {
    eventEmitter.unsubscribe('my-event', callback);

    eventEmitter.emit('my-event');

    expect(callback).not.toBeCalled();
  });
  it('Все подписчики по событию должны быть оповещены', () => {
    const callbackAnother1 = jest.fn();
    const callbackAnother2 = jest.fn();
    eventEmitter.subscribe('my-event-another', callbackAnother1);
    eventEmitter.subscribe('my-event-another', callbackAnother2);

    eventEmitter.emit('my-event-another');

    expect(callbackAnother1).toBeCalledTimes(1);
    expect(callbackAnother2).toBeCalledTimes(1);
    expect(callback).not.toBeCalled();
  });
  it('Функция обратного вызова подписчика должна быть вызвана с переданными данными', () => {
    const expectedData = 'my-data';
    eventEmitter.emit('my-event', expectedData);

    expect(callback).toBeCalledWith(expectedData);
  });
});
