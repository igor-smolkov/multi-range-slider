// /**
//  * @jest-environment jsdom
//  */

// import { Thumb, IThumb } from "../Thumb";

// describe('Палец', () => {

//   describe('Инициализация', () => {

//     describe('Без параметров', () => {
//       let thumb: IThumb;
//       beforeAll(() => {
//         thumb = new Thumb();
//       })

//       test('Элемент создан', ()=>{
//         expect(thumb.getElem()).toBeDefined();
//       });

//       test('Класс элемента - thumb', ()=>{
//         expect(thumb.getElem().className).toBe('thumb');
//       });
//     });
//     describe('C параметрами', () => {
//       let thumb: IThumb;
//       beforeAll(() => {
//         thumb = new Thumb({
//           id: 0,
//           className: 'block__thumb'
//         });
//       })

//       test('Элемент создан', ()=>{
//         expect(thumb.getElem()).toBeDefined();
//       });

//       test('Класс элемента - block__thumb', ()=>{
//         expect(thumb.getElem().className).toBe('block__thumb');
//       });
//     });
//   });
//   describe('Взаимодействие', () => {

//     describe('Без параметров', () => {

//       describe('Обработка клика', () => {
//         let thumb: IThumb, spy: jest.SpyInstance;
//         beforeAll(() => {
//           thumb = new Thumb();
//           spy = jest.spyOn(thumb.getElem(), 'dispatchEvent');
//           thumb.getElem().dispatchEvent(new Event('click'));
//         })

//         test('Один клик обработан один раз', ()=>{
//           expect(spy).toHaveBeenCalledTimes(1);
//         });

//         test('Объект в состоянии "обработан" - по-умолчанию', ()=>{
//           expect(thumb.isProcessed()).toBeTruthy();
//         });
//       });

//       describe('Обработка нажатия указателя', () => {
//         let thumb: IThumb, spy: jest.SpyInstance;
//         beforeAll(() => {
//           thumb = new Thumb();
//           spy = jest.spyOn(thumb.getElem(), 'dispatchEvent');
//           thumb.getElem().dispatchEvent(new Event('pointerdown'));
//         })

//         test('Одно нажатие обработано один раз', ()=>{
//           expect(spy).toHaveBeenCalledTimes(1);
//         });

//         test('Объект в состоянии "в процессе обработки"', ()=>{
//           expect(thumb.isProcessed()).toBeFalsy();
//         });
//       });
//     });

//     describe('С параметрами', () => {

//       describe('Обработка клика', () => {
//         let thumb: IThumb, spy: jest.SpyInstance;
//         beforeAll(() => {
//           thumb = new Thumb({
//             id: 0,
//             className: 'block__thumb',
//           });
//           spy = jest.spyOn(thumb.getElem(), 'dispatchEvent');
//           thumb.getElem().dispatchEvent(new Event('click'));
//         })

//         test('Один клик обработан один раз', ()=>{
//           expect(spy).toHaveBeenCalledTimes(1);
//         });

//         test('Объект в состоянии "обработан" - по-умолчанию', ()=>{
//           expect(thumb.isProcessed()).toBeTruthy();
//         });
//       });

//       describe('Обработка нажатия указателя', () => {
//         let thumb: IThumb, callback: (id:number) => void, spy: jest.SpyInstance;
//         beforeAll(() => {
//           callback = jest.fn();
//           thumb = new Thumb({
//             id: 0,
//             className: 'block__thumb',
//             onProcess: callback,
//           });
//           spy = jest.spyOn(thumb.getElem(), 'dispatchEvent');
//           thumb.getElem().dispatchEvent(new Event('pointerdown'));
//         })

//         test('Одно нажатие обработано один раз', ()=>{
//           expect(spy).toHaveBeenCalledTimes(1);
//         });
        
//         test('Объект в состоянии "в процессе обработки"', ()=>{
//           expect(thumb.isProcessed()).toBeFalsy();
//         });

//         test('Вызван обработчик с параметром равным 0', ()=>{
//           expect(callback).toHaveBeenCalledTimes(1);
//           expect(callback).toHaveBeenCalledWith(0);
//         });
//       });
//     });
//   });

//   describe('Методы', () => {

//     describe('Активация', () => {
//       let thumb: IThumb;
//       beforeAll(() => {
//         thumb = new Thumb();
//       })

//       test('Объект в состоянии "обработан" - по-умолчанию', ()=>{
//         expect(thumb.isProcessed()).toBeTruthy();
//       });

//       test('Объект в состоянии "в процессе обработки"', ()=>{
//         thumb.activate();
//         expect(thumb.isProcessed()).toBeFalsy();
//       });
//     });

//     describe('Деактивация', () => {
//       let thumb: IThumb;
//       beforeAll(() => {
//         thumb = new Thumb();
//       })

//       test('Объект в состоянии "в процессе обработки"', ()=>{
//         thumb.activate();
//         expect(thumb.isProcessed()).toBeFalsy();
//       });

//       test('Объект в состоянии "обработан"', ()=>{
//         thumb.release();
//         expect(thumb.isProcessed()).toBeTruthy();
//       });
//     });
//   });
// });