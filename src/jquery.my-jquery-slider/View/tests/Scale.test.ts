// /**
//  * @jest-environment jsdom
//  */

// import { Scale, IScale } from "../Scale";
// import { Segment } from "../Segment";

// describe('Шкала', () => {

//   describe('Инициализация', () => {

//     describe('Без параметров', () => {
//       let scale: IScale;
//       beforeAll(() => {
//         scale = new Scale();
//       })

//       test('Элемент создан', ()=>{
//         expect(scale.getElem()).toBeDefined();
//       });

//       test('У элемента есть класс scale', ()=>{
//         expect(scale.getElem().classList.contains('scale')).toBeTruthy();
//       });
//     });
//   });

//   describe('С параметрами', () => {
//     let scale: IScale;
//     beforeAll(() => {
//       scale = new Scale({
//         segments: [new Segment(), new Segment()],
//         className: 'block__scale',
//         type: 'numeric',
//         min: 10,
//         max: 20,
//         step: 5,
//         maxLengthPx: 100,
//         withIndent: false,
//         isVertical: true,
//       });
//     })

//     test('Элемент создан', ()=>{
//       expect(scale.getElem()).toBeDefined();
//     });

//     test('У элемента есть класс block__scale', ()=>{
//       expect(scale.getElem().classList.contains('block__scale')).toBeTruthy();
//     });

//     test('Внутри шкалы должено быть два сегмента', ()=>{
//       expect(scale.getElem().querySelectorAll('.segment').length).toBe(2);
//     });

//     test('У элемента нет внешних отступов', ()=>{
//       expect(scale.getElem().style.margin).toBe('0px');
//     });
//   });

//   describe('Методы', () => {

//     describe('Получение разумного шага шкалы', () => {

//       test('Разумный шаг должен быть равен 1', ()=>{
//         let scale = new Scale({
//           segments: [new Segment(), new Segment()],
//           className: 'block__scale',
//           type: 'basic',
//           min: 0,
//           max: 100,
//           step: 0.001,
//           maxLengthPx: 1000,
//           withIndent: false,
//           isVertical: true,
//         });
//         expect(scale.getResonableStep()).toBe(1);
//       });

//       test('Разумный шаг должен быть равен 2', ()=>{
//         let scale = new Scale({
//           segments: [new Segment(), new Segment()],
//           className: 'block__scale',
//           type: 'numeric',
//           min: 0,
//           max: 100,
//           step: 0.001,
//           maxLengthPx: 1000,
//           withIndent: false,
//           isVertical: true,
//         });
//         expect(scale.getResonableStep()).toBe(2);
//       });

//       test('Разумный шаг должен быть равен 0.01', ()=>{
//         let scale = new Scale({
//           segments: [new Segment(), new Segment()],
//           className: 'block__scale',
//           type: 'numeric',
//           min: -0.1,
//           max: 0.1,
//           step: 0.00001,
//           maxLengthPx: 1000,
//           withIndent: false,
//           isVertical: false,
//         });
//         expect(scale.getResonableStep()).toBe(0.01);
//       });
//     });
//   });
// });