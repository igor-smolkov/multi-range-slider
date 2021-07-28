import { IRange, Range } from "../Range";
import { ISlider, Slider } from "../Slider";

describe('Слайдер', () => {
  // - подготовка
  it('Инстанс должен быть создан', () => {
    let slider: ISlider;
    // - действие
    slider = new Slider();
    // - проверка
    expect(slider).toBeDefined();
  })
  it('Лимиты должны отобржать дефолтные значения слайдера', () => {
    const expectedLimits = [0, 50, 100]
    let slider: ISlider;
    // - действие
    slider = new Slider();
    // - проверка
    expect(slider.getLimits()).toEqual(expectedLimits);
  })
  it('Лимиты должны отображать максимум, минимумум и текущее значение диапазона в опциях', () => {
    const testMin = 10;
    const testMax = 30;
    const testValue = 20;
    const expectedLimits = [testMin, testValue, testMax];
    const range: IRange = new Range({min: testMin, max: testMax, current: testValue});
    let slider: ISlider;
    // - действие
    slider = new Slider({ranges: [range]});
    // - проверка
    expect(slider.getLimits()).toEqual(expectedLimits);
  })
  it('Минимум слайдера должен отражать, что диапазоны отсортированы по минимуму и минимум слайдера равен минимуму второго диапазона', () => {
    const range1: IRange = new Range({min: 40, max: 50});
    const range2: IRange = new Range({min: 10, max: 45});
    let slider: ISlider;
    // - действие
    slider = new Slider({ranges: [range1, range2]});
    // - проверка
    expect(slider.getMin()).toBe(range2.getMin());
  })
  it('Максимум слайдера должен отражать, что диапазоны с одинаковым минимумом отсортированы по максимуму и максимум слайдера равен максимуму первого диапазона', () => {
    const range1: IRange = new Range({min: 10, max: 50});
    const range2: IRange = new Range({min: 10, max: 45});
    let slider: ISlider;
    // - действие
    slider = new Slider({ranges: [range1, range2]});
    // - проверка
    expect(slider.getMax()).toBe(range1.getMax());
  })
  it('Проверка на двойной слайдер должна отражать, что при непересекающихся диапазонах последний диапазон отбрасывается', () => {
    const range1: IRange = new Range({min: 10, max: 20});
    const range2: IRange = new Range({min: 30, max: 45});
    let slider: ISlider;
    // - действие
    slider = new Slider({ranges: [range1, range2]});
    // - проверка
    expect(slider.isDouble()).toBeFalsy();
  })
  it('Индекс активного диапазона должен быть 0 по-умолчанию', () => {
    let slider: ISlider;
    // - действие
    slider = new Slider();
    // - проверка
    expect(slider.getActive()).toBe(0);
  })
  it('Индекс активного диапазона должен быть 2, при установке его в опциях и колличестве диапазонов больше 2', () => {
    let slider: ISlider;
    // - действие
    slider = new Slider({
      ranges: [new Range(), new Range(), new Range()],
      active: 2,
    });
    // - проверка
    expect(slider.getActive()).toBe(2);
  })
  it('Индекс активного диапазона должен быть 0, если превышает число диапазонов', () => {
    let slider: ISlider;
    // - действие
    slider = new Slider({
      ranges: [new Range(), new Range()],
      active: 2,
    });
    // - проверка
    expect(slider.getActive()).toBe(0);
  })
  it('Индекс активного диапазона должен быть 0, если некорректен', () => {
    let slider: ISlider;
    // - действие
    slider = new Slider({
      ranges: [new Range()],
      active: -1,
    });
    // - проверка
    expect(slider.getActive()).toBe(0);
  })
  it('Шаг должен быть 4, при установке его в опциях', () => {
    let slider: ISlider;
    // - действие
    slider = new Slider({
      ranges: [new Range()],
      step: 4,
    });
    // - проверка
    expect(slider.getStep()).toBe(4);
  })
  it('Шаг должен быть 1, если некорректен', () => {
    let slider: ISlider;
    // - действие
    slider = new Slider({
      ranges: [new Range()],
      step: 0,
    });
    // - проверка
    expect(slider.getStep()).toBe(1);
  })
  it('Индекс актуального диапазона должен быть 0 по-умолчанию, при одном диапазоне', () => {
    let slider: ISlider;
    const testActuals = [0];
    // - действие
    slider = new Slider();
    // - проверка
    expect(slider.getActuals()).toEqual(testActuals);
  })
  it('Индекс актуального диапазона должен быть 1 по-умолчанию, при двух диапазонах', () => {
    let slider: ISlider;
    const testActuals = [1];
    // - действие
    slider = new Slider({
      ranges: [new Range(), new Range()],
    });
    // - проверка
    expect(slider.getActuals()).toEqual(testActuals);
  })
  it('Индексы актуальных диапазонов должны быть 1 и 2 по-умолчанию, при трех диапазонах', () => {
    let slider: ISlider;
    const testActuals = [1, 2];
    // - действие
    slider = new Slider({
      ranges: [new Range(), new Range(), new Range()],
    });
    // - проверка
    expect(slider.getActuals()).toEqual(testActuals);
  })
  it('Индексы актуальных диапазонов должны быть 1 и 3 по-умолчанию, при четырех диапазонах', () => {
    let slider: ISlider;
    const testActuals = [1, 3];
    // - действие
    slider = new Slider({
      ranges: [new Range(), new Range(), new Range(), new Range()],
    });
    // - проверка
    expect(slider.getActuals()).toEqual(testActuals);
  })
  it('Индексы актуальных диапазонов должны быть 1, 2, 3, 4 по-умолчанию, при пяти диапазонах', () => {
    let slider: ISlider;
    const testActuals = [1, 2, 3, 4];
    // - действие
    slider = new Slider({
      ranges: [new Range(), new Range(), new Range(), new Range(), new Range()],
    });
    // - проверка
    expect(slider.getActuals()).toEqual(testActuals);
  })
  it('Индексы актуальных диапазонов должны быть 0 и 2, при уставновке их в опциях и колличестве диапазонов больше 2', () => {
    let slider: ISlider;
    const testActuals = [0, 2];
    // - действие
    slider = new Slider({
      ranges: [new Range(), new Range(), new Range()],
      actuals: testActuals,
    });
    // - проверка
    expect(slider.getActuals()).toEqual(testActuals);
  })
  it('Индексы актуальных диапазонов должны быть 1 и 2 по-умолчанию, при некорректных индексах', () => {
    let slider: ISlider;
    const testActuals = [-1, 5];
    const expectedActuals = [1, 2];
    // - действие
    slider = new Slider({
      ranges: [new Range(), new Range(), new Range()],
      actuals: testActuals,
    });
    // - проверка
    expect(slider.getActuals()).toEqual(expectedActuals);
  })
  describe('Установка минимума и максимума', () => {
    let slider: ISlider;
    beforeEach(() => {
      slider = new Slider({
        ranges: [
          new Range({min: 10, max: 20}),
          new Range({min: 15, max: 45}),
        ]
      });
    })
    it('Минимум не должен быть установлен, если он больше максимумов всех диапазонов', () => {
      const oldMin = slider.getMin();
      const newMin = 150;
      // - действие
      slider.setMin(newMin);
      // - проверка
      expect(slider.getMin()).not.toBe(newMin);
      expect(slider.getMin()).toBe(oldMin);
    })
    it('Минимум должен быть установлен в 5 и не влиять на колличество диапазонов', () => {
      const oldMin = slider.getMin();
      const newMin = 5;
      // - действие
      slider.setMin(newMin);
      // - проверка
      expect(slider.getMin()).not.toBe(oldMin);
      expect(slider.getMin()).toBe(newMin);
      expect(slider.isDouble()).toBeTruthy();
    })
    it('Минимум должен быть установлен в 12 и не влиять на колличество диапазонов', () => {
      const oldMin = slider.getMin();
      const newMin = 12;
      // - действие
      slider.setMin(newMin);
      // - проверка
      expect(slider.getMin()).not.toBe(oldMin);
      expect(slider.getMin()).toBe(newMin);
      expect(slider.isDouble()).toBeTruthy();
    })
    it('Минимум должен быть установлен в 25 и отбросить диапазоны с меньшим максимумом', () => {
      const oldMin = slider.getMin();
      const newMin = 25;
      // - действие
      slider.setMin(newMin);
      // - проверка
      expect(slider.getMin()).not.toBe(oldMin);
      expect(slider.getMin()).toBe(newMin);
      expect(slider.isDouble()).toBeFalsy();
    })
    it('Максимум не должен быть установлен, если он меньше минимумов всех диапазонов', () => {
      const oldMax = slider.getMax();
      const newMax = 5;
      // - действие
      slider.setMax(newMax);
      // - проверка
      expect(slider.getMax()).not.toBe(newMax);
      expect(slider.getMax()).toBe(oldMax);
    })
    it('Максимум должен быть установлен в 50 и не влиять на колличество диапазонов', () => {
      const oldMax = slider.getMax();
      const newMax = 50;
      // - действие
      slider.setMax(newMax);
      // - проверка
      expect(slider.getMax()).not.toBe(oldMax);
      expect(slider.getMax()).toBe(newMax);
      expect(slider.isDouble()).toBeTruthy();
    })
    it('Максимум должен быть установлен в 40 и не влиять на колличество диапазонов', () => {
      const oldMax = slider.getMax();
      const newMax = 40;
      // - действие
      slider.setMax(newMax);
      // - проверка
      expect(slider.getMax()).not.toBe(oldMax);
      expect(slider.getMax()).toBe(newMax);
      expect(slider.isDouble()).toBeTruthy();
    })
    it('Максимум должен быть установлен в 12 и отбросить диапазоны с большим минимумом', () => {
      const oldMax = slider.getMax();
      const newMax = 12;
      // - действие
      slider.setMax(newMax);
      // - проверка
      expect(slider.getMax()).not.toBe(oldMax);
      expect(slider.getMax()).toBe(newMax);
      expect(slider.isDouble()).toBeFalsy();
    })
  })
  it('Текущее значение должно отображать текущее значение диапазона по выбранному индексу 1', () => {
    const testValue = 20;
    const slider: ISlider = new Slider({
      ranges: [
        new Range({min: 10, max: 20, current: 12}),
        new Range({min: 15, max: 45, current: testValue}),
      ]
    });
    const oldCurrentValue = slider.getValue()
    // - действие
    slider.setActive(1);
    // - проверка
    expect(slider.getValue()).not.toBe(oldCurrentValue);
    expect(slider.getValue()).toBe(testValue);
  })
  it('Индекс активного диапазона не должен изменится при некорректном значении', () => {
    const slider: ISlider = new Slider({
      ranges: [ new Range(), new Range() ]
    });
    const oldActive = slider.getActive();
    const newActive = -1;
    // - действие
    slider.setActive(newActive);
    // - проверка
    expect(slider.getActive()).not.toBe(newActive);
    expect(slider.getValue()).toBe(oldActive);
  })
  it('Текущее значение должно быть равно максимальному при установке в 100% и последнем активном диапазоне', () => {
    const slider: ISlider = new Slider({
      ranges: [
        new Range({min: 10, max: 20, current: 12}),
        new Range({min: 15, max: 45, current: 30}),
      ],
      active: 1,
    });
    // - действие
    slider.setPerValue(100);
    // - проверка
    expect(slider.getValue()).toBe(slider.getMax());
  })
  it('Минимальный интервал должен быть равен текущему значению при первом выбранном диапазоне двойного слайдера', () => {
    const slider: ISlider = new Slider({
      ranges: [new Range(), new Range()],
      active: 0,
    });
    // - действие
    slider.setMinInterval(23);
    // - проверка
    expect(slider.getMinInterval()).toBe(slider.getValue());
  })
  it('Минимальный интервал должен быт равен максимуму при устанавливаемом значении больше максимума', () => {
    const slider: ISlider = new Slider({
      ranges: [new Range({min: 10, max: 20})],
    });
    // - действие
    slider.setMinInterval(30);
    // - проверка
    expect(slider.getMinInterval()).toBe(slider.getMax());
  })
  it('Минимальный интервал должен быть равен текущему значению первого и второго диапазона при установке значения больше текущего значения второго диапазона', () => {
    const slider: ISlider = new Slider({
      ranges: [
        new Range({min: 10, max: 20, current: 12}),
        new Range({min: 15, max: 45, current: 30}),
      ]
    });
    // - действие
    slider.setMinInterval(40);
    // - проверка
    expect(slider.getMinInterval()).toBe(slider.getValue());
    slider.setActive(1);
    expect(slider.getMinInterval()).toBe(slider.getValue());
  })
  it('Максимальный интервал должен быть равен текущему значению при втором выбранном диапазоне', () => {
    const slider: ISlider = new Slider({
      ranges: [new Range(), new Range()],
      active: 1,
    });
    // - действие
    slider.setMaxInterval(90);
    // - проверка
    expect(slider.getMaxInterval()).toBe(slider.getValue());
  })
  it('Максимальный интервал должен быт равен минимуму при устанавливаемом значении меньше минимума', () => {
    const slider: ISlider = new Slider({
      ranges: [new Range({min: 10, max: 20})],
    });
    // - действие
    slider.setMaxInterval(5);
    // - проверка
    expect(slider.getMaxInterval()).toBe(slider.getMin());
  })
  it('Максимальный интервал должен быть равен текущему значению первого и второго диапазона при установке значения меньше текущего значения первого диапазона', () => {
    const slider: ISlider = new Slider({
      ranges: [
        new Range({min: 10, max: 20, current: 12}),
        new Range({min: 15, max: 45, current: 30}),
      ]
    });
    // - действие
    slider.setMaxInterval(11);
    // - проверка
    expect(slider.getMaxInterval()).toBe(slider.getValue());
    slider.setActive(1);
    expect(slider.getMaxInterval()).toBe(slider.getValue());
  })
  it('Индекс активного диапазона должен быть 1, при его установке по ближайшему значению 21', () => {
    const slider: ISlider = new Slider({
      ranges: [
        new Range({min: 10, max: 20, current: 12}),
        new Range({min: 15, max: 45, current: 30}),
      ],
      active: 0,
    });
    // - действие
    slider.setActiveCloseOfValue(21);
    // - проверка
    expect(slider.getActive()).toBe(1);
  })
  it('Индекс активного диапазона должен быть 1, при его установке по ближайшему значению 41', () => {
    const slider: ISlider = new Slider({
      ranges: [
        new Range({min: 10, max: 20, current: 15}),
        new Range({min: 15, max: 45, current: 40}),
        new Range({min: 40, max: 65, current: 45}),
      ],
      active: 0,
    });
    // - действие
    slider.setActiveCloseOfValue(41);
    // - проверка
    expect(slider.getActive()).toBe(1);
  })
  it('Устанавливаемое значение должно быть скорректировано в соответсвии с шагом', () => {
    const slider: ISlider = new Slider({ ranges: [new Range()], step: 20 });
    const testValue = 17;
    const expectedValue = 20;
    // - действие
    slider.setValue(testValue)
    // - проверка
    expect(slider.getValue()).toBe(expectedValue);
  })
})