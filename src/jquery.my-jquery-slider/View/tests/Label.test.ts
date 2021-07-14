// /**
//  * @jest-environment jsdom
//  */

// import { Label, ILabel } from "../Label";

// describe('Подпись', () => {

//   describe('Инициализация', () => {

//     describe('Без параметров', () => {
//       let label: ILabel;
//       beforeAll(() => {
//         label = new Label();
//       })

//       test('Элемент создан', ()=>{
//         expect(label.getElem()).toBeDefined();
//       });

//       test('У элемента есть класс label', ()=>{
//         expect(label.getElem().classList.contains('label')).toBeTruthy();
//       });
//     });

//     describe('С параметром', () => {
//       let label: ILabel;
//       beforeAll(() => {
//         label = new Label('block__label');
//       })

//       test('Элемент создан', ()=>{
//         expect(label.getElem()).toBeDefined();
//       });

//       test('У элемента есть класс block__label', ()=>{
//         expect(label.getElem().classList.contains('block__label')).toBeTruthy();
//       });
//     });
//   });

//   describe('Методы', () => {

//     describe('Показать значение', () => {
//       let label: ILabel;
//       beforeAll(() => {
//         label = new Label();
//       })

//       test('Показываем 5, элемент должен содержать "5"', ()=>{
//         label.show(5);
//         expect(label.getElem().innerText).toBe('5');
//       });

//       test('Показываем "яблоко", элемент должен содержать "яблоко"', ()=>{
//         label.show('яблоко');
//         expect(label.getElem().innerText).toBe('яблоко');
//       });
//     });
//   });
// });