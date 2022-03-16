import { SliderLabel, SliderOrientation, SliderScale } from '../../TMyJQuerySlider';
import { IModelView, ModelView, ModelViewConfig } from '../ModelView';

describe('Модель визуализации', () => {
  it('Экземпляр должен быть создан', () => {
    const modelView: IModelView = new ModelView();

    expect(modelView).toBeDefined();
  });
  it('Конфигурация должна быть дефолтной', () => {
    const defaults: ModelViewConfig = {
      orientation: SliderOrientation.horizontal,
      withLabel: false,
      withIndent: true,
      withNotch: true,
      label: null,
      scale: null,
      scaleSegments: null,
      lengthPx: null,
    };
    const modelView: IModelView = new ModelView();

    expect(modelView.getConfig()).toEqual(defaults);
  });
  it('Конфигурация должна соответствовать опциям', () => {
    const options: ModelViewConfig = {
      orientation: SliderOrientation.vertical,
      withLabel: true,
      withIndent: false,
      withNotch: false,
      label: SliderLabel.name,
      scale: SliderScale.basic,
      scaleSegments: 10,
      lengthPx: 100,
    };
    const modelView: IModelView = new ModelView(options);

    expect(modelView.getConfig()).toEqual(options);
  });
  it('Ориентация должна быть обновлена', () => {
    const modelView: IModelView = new ModelView({
      orientation: SliderOrientation.vertical,
    });

    modelView.update({ orientation: SliderOrientation.horizontal });

    const { orientation } = modelView.getConfig();
    expect(orientation).toBe(SliderOrientation.horizontal);
    expect(orientation).not.toBe(SliderOrientation.vertical);
  });
});
