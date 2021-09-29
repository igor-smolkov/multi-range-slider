My-jQuery-Slider  
=====
Многофункциональный range-слайдер  
в формате плагина для jQuery  
спроектированный по MVP-архитектуре с Passive View  
имеющий гибкую конфигурацию для связи:  
одного, двух, множества числовых диапазонов друг с другом и списком строк  
  
Демо-страница:  
https://igor-smolkov.github.io/my-jquery-slider/  
  
Установка и запуск проекта:  
```
git clone https://github.com/igor-smolkov/my-jquery-slider.git  
cd my-jquery-slider  
npm i  
npm start
```  
  
Быстрый старт
-----
Подключение слайдера:  
```
import $ from 'jquery'
import myJQuerySliderFactory from './jquery.my-jquery-slider'

myJQuerySliderFactory($)

$('.my-root-element-for-slider').myJQuerySlider()
```  
  
Доступные опции:
```
$('.my-root-element-for-slider').myJQuerySlider({
  min:          // (number) минимальная граница диапазонов
  max:          // (number) максимальная граница диапазонов
  value:        // (number) текущее значение
  step:         // (number) шаг
  orientation:  // ('vertical' | 'horizontal') ориентация: вертикальная / горизонтальная;
  isDouble:     // (boolean) указать что слайдер - двойной 
  minInterval:  // (number) значение минимального интервала 
  maxInterval:  // (number) значение максимального интервала
  limits:       // (number[]) список текущих значений диапазонов + их минимальная и максимальная граница, 
                // например: [0, 25, 75, 100] - для двойного слайдера
  active:       // (number) индекс активного диапазона
  withLabel:    // (boolean) указать наличие подписи над бегунком
  label:        // ('number' | 'name') тип подписи над бегунком: числовое значение / именная подпись
  scale:        // ('basic' | 'numeric' | 'named' | 'mixed') включить шкалу с указанным типом: 
                // только деления / деления с числовыми значениями / деления с именной подписью / 
                // деления с именной подписью и числовым значением, для значений без имени
  segments:     // (number) ограничить количество сегментов шакалы нужным числом
  withNotch:    // (boolean) указать наличие засечек у делений
  list:         // ((string | [number, string])[]) список имен, например:
                // ['a', 'б', 'в'], где первое имя будет соответствовать минимальной границе, 
                // а остальные последующим значениям в соответствии с шагом
                // или ['a', [4, 'd'], 'e', [16, 'f']], где соответствие имени и значения у некоторых задано явно
  actualRanges: // (number[]) список индексов актуальных диапазонов, которые будут визуально выделены
  lengthPx:     // (number) абсолютная длина слайдера в пикселях
  withIndent:   // (boolean) указать наличие отступов
})
```
  
Подписка на события:  
```
const $slider = $('.my-root-element-for-slider')

// событие инициализации
$slider.on('my-jquery-slider-init', handleInit)
// событие обновления
$slider.on('my-jquery-slider-update', handleUpdate)

$slider.myJQuerySlider()
```
  
Получение данных:  
```
const $slider = $('.my-root-element-for-slider')
$slider.myJQuerySlider()

// в консоль выведется текущая конфигурация слайдера
console.log( $slider.data() )
```
  
Переопределение стилей:  
```
.my-jquery-slider{ /* корневой элемент */ }
.my-jquery-slider_vertical{ /* вертикальный вид */ }
.my-jquery-slider__slot{ /* слот */ }
.my-jquery-slider__bar{ /* бар */ }
.my-jquery-slider__bar_actual{ /* актуальный бар */ }
.my-jquery-slider__bar_even{ /* четный бар */ }
.my-jquery-slider__bar_active{ /* активный бар */ }
.my-jquery-slider__thumb{ /* бегунок */ }
.my-jquery-slider__label{ /* подпись над бегунком */ }
.my-jquery-slider__scale{ /* контейнер шкалы */ }
.my-jquery-slider__segment{ /* сегмент шкалы */ }
.my-jquery-slider__segment::before{ /* засечка деления */ }
.my-jquery-slider__segment_long::before{ /* длинная засечка деления */ }
.my-jquery-slider__segment_short::before{ /* короткая засечка деления */ }
.my-jquery-slider__segment_with-number::after{ /* числовая подпись деления */ }
.my-jquery-slider__segment_with-name::after{ /* именная подпись деления */ }
.my-jquery-slider__segment_last{ /* последнее деление */ }
```  
  
UML-диаграммы
-----
Диаграмма слоев MVP-архитектуры:  
![MVP-диаграмма](https://github.com/igor-smolkov/my-jquery-slider/raw/master/diagrams/mvp.jpg)  
Презентер подписан на модель и, при возникновении события обновления, собирает из модели данные для конфигурации вью и рендерит его.  
У вью есть ссылка на презентер, по которой оно вызывает его публичные методы, обрабатывая пользовательские события.  
Методы презентера делегируют работу публичным методам модели, после завершения работы которых модель оповещает подписчиков об обновлении.  
  
Диаграмма фасада модели:  
![Диаграмма модели](https://github.com/igor-smolkov/my-jquery-slider/raw/master/diagrams/model.jpg)  
  
Диаграмма вью и сабвью:  
![Диаграмма вью](https://github.com/igor-smolkov/my-jquery-slider/raw/master/diagrams/view.jpg)  
  