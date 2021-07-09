/**
 * @jest-environment jsdom
 */

// import { Slot, ISlot } from "../Slot";

// describe('Бар', () => {

//   describe('Инициализация', () => {

//     describe('Без параметров', () => {
//       let slot: ISlot;
//       beforeAll(() => {
//         slot = new Slot();
//       })

//       test('Элемент создан', ()=>{
//         expect(slot.getElem()).toBeDefined();
//       });

//       test('У элемента есть класс slot', ()=>{
//         expect(slot.getElem().classList.contains('slot')).toBeTruthy();
//       });

//       test('Внутри слота должен быть бар', ()=>{
//         expect(slot.getElem().querySelector('.bar')).toBeTruthy();
//       });
//     });
//   });
// });