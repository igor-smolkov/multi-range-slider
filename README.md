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
  
Сборка проекта:  
```
npm run build
```  
  
Сборка проекта в режиме разработки:  
```
npm run dev
```  
  
Команды запуска тестов:  
```
npm test
npm run test:watch
npm run test:coverage
```  
  
Команда запуска линтера:  
```
npm run lint
```  
  
Запустить проверку или исправление стилей:  
```
npm run style
npm run style:fix
```  
  
Версия Node.js: 14.17.3  
Версия npm: 6.14.13  
  
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
  activeRange:  // (number) индекс активного диапазона
  withLabel:    // (boolean) указать наличие подписи над бегунком
  label:        // ('number' | 'name') тип подписи над бегунком: числовое значение / именная подпись
  scale:        // ('basic' | 'numeric' | 'named' | 'mixed' | null) включить шкалу с указанным типом: 
                // только деления / деления с числовыми значениями / деления с именной подписью / 
                // деления с именной подписью и числовым значением, для значений без имени / отключить
  scaleSegments:     // (number) ограничить количество сегментов шакалы нужным числом
  withNotch:    // (boolean) указать наличие засечек у делений
  labelsList:   // ((string | [number, string])[]) список имен, например:
                // ['a', 'б', 'в'], где первое имя будет соответствовать минимальной границе, 
                // а остальные последующим значениям в соответствии с шагом
                // или ['a', [4, 'd'], 'e', [16, 'f']], где соответствие имени и значения у некоторых задано явно
  actualRanges: // (number[]) список индексов актуальных диапазонов, которые будут визуально выделены
                // пустой список - не выделять диапазоны; null или отсутствие опции - выделить по-умолчанию
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
.my-jquery-slider__scale-segment{ /* сегмент шкалы */ }
.my-jquery-slider__scale-segment::before{ /* засечка деления */ }
.my-jquery-slider__scale-segment_long::before{ /* длинная засечка деления */ }
.my-jquery-slider__scale-segment_short::before{ /* короткая засечка деления */ }
.my-jquery-slider__scale-segment_with-number::after{ /* числовая подпись деления */ }
.my-jquery-slider__scale-segment_with-name::after{ /* именная подпись деления */ }
.my-jquery-slider__scale-segment_last{ /* последнее деление */ }
```  
  
UML-диаграммы
-----
Диаграмма слоев MVP-архитектуры с Passive View:  
![MVP-диаграмма](https://github.com/igor-smolkov/my-jquery-slider/raw/master/diagrams/mvppv.jpg)  
Презентер подписан на модель и, при возникновении события ее изменения, собирает из модели данные для конфигурации вью и рендерит его.  
Презентер подписан на вью и, при возникновении его событий делегирует модели соответствующую событиям работу, используя ее публичные методы.  
Также, для элемента к которому подключен слайдер, презентер создает глобальные события инициализации и обновления, и снабжает пользователя информацией о текущей конфигурации.  
Вью, обрабатывая пользовательские события, испускает свои собственные, прикладывая к ним полезные для подписчиков данные.  
Модель оповещает подписчиков о завершении перемен в ее состоянии в результате инициализации или обновления.  
Для простого оповещения, в случае модели, или множества событий с данными, в случае со вью, модель и вью используют экземпляры одного отдельного класса, интерфейс которого позволяет реализовать функционал издателя событий.  
  
Диаграмма фасада модели:  
![Диаграмма модели](https://github.com/igor-smolkov/my-jquery-slider/raw/master/diagrams/model.jpg)  
Модель, опираясь на пользовательскую конфигурацию, инициализирует или обновляет слайдер, диапазоны и список, а затем собирает итоговую конфигурацию.  
Слайдер получает набор диапазонов и параметры ролей и ограничений этих диапазонов, затем формирует массив последовательно-пересекающихся диапазонов из этого набора.  
Диапазон - независимая единица этой системы, которая конфигурируется моделью и управляется слайдером.  
Список - отдельный объект из имен соотнесенных со значениями, который настраивается моделью.  
После создания списка, модель может скорректировать слайдер, если предельные значения списка не вписываются в предельные значения слайдера.  
  
Диаграмма вью и сабвью:  
![Диаграмма вью](https://github.com/igor-smolkov/my-jquery-slider/raw/master/diagrams/view.jpg)  
Вью имеет 3 отдельных интерфейса: для рендера всей картинки, для обработки пользовательских событий и для конфигурации сабвью.  
На основе конфигурации полученной от презентера, вью создает конфигурации для каждого сабвью и инициализирует или обновляет их при рендере.  
В зависимости от ориентации вью создает экземпляры рута, слота и бара горизонтального или вертикального типа, классы которых наследуются от абстрактных.  
Все взаимодействие с сабвью происходит через их интерфейсы.  
Рут нужен для настройки корневого элемента. Все остальные сабвью для создания и обновления одноименных элементов слайдера.  
Слот, палец и сегмент шкалы используют интерфейс обработки событий вью, для оповещения о пользовательском событии.  
В процессе перемещения бегунка вью находится в необработанном состоянии и самостоятельно определят текущее значение в рамках получаемой от презентера конфигурации.  
После подъема пользовательского указателя вью переходит в обработанное состояние и становится зависим от получаемой конфигурации в полном объеме.  
  