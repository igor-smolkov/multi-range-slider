import { Range } from "../Range";

describe('Тест диапазона', ()=>{
  let range: Range = null;
  beforeAll(()=>{
    range = new Range();
  })
  test('Минимальное значение должно быть 0', ()=>{
    expect(range.getMin()).toBe(0);
  })
  test('Максимальное значение должно быть 100', ()=>{
    expect(range.getMax()).toBe(100);
  })
  test('Текущее значение должно быть 60?', ()=>{
    expect(range.getCurrent()).toBe(60);
  })
})