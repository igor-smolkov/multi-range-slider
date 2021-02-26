import EventEmitter from './EventEmitter';
import Model from './Model';

export default class View {
    elem :HTMLElement;
    $elem :JQuery;
    options: ImyJquerySlider;
    eventEmitter :EventEmitter;
    model :Model;
    constructor(elem :HTMLElement, options :ImyJquerySlider) {
        this.elem = elem;
        this.$elem = $(elem);

        this.options = $.extend({}, this.$elem.data('options'), options);

        this.eventEmitter = new EventEmitter();
        this.eventEmitter.subscribe('init', (config :ImyJquerySlider)=>this.initModel(config));
        this.model = new Model(this.options, this.eventEmitter);
    }
    initModel(config :ImyJquerySlider) {
        this.$elem.data(config);
    }
}