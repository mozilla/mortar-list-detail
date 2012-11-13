
define(function(require) {
    var $ = require('zepto');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Stack = require('layouts/stack');
    var Header = require('layouts/header');

    var stack = new Stack();

    var Item = Backbone.Model.extend({});
    var ItemList = Backbone.Collection.extend({
        model: Item
    });

    var BasicView = Backbone.View.extend({
        initialize: function() {
            this.initMarkup();
        },

        initMarkup: function() {
            var el = $(this.el);
            var appEl = el.parent('x-app');
            var appHeight = appEl.height();

            el.width(appEl.width());

            var headerView = new Header(this.el);
            var header = el.children('header').remove();

            var contents = el.children();
            if(!contents.length) {
                el.append('<div class="contents"></div>');
            }
            else {
                contents.wrapAll('<div class="contents"></div>');
            }
            el.prepend(header);

            var height = el.children('header').height();
            el.children('.contents').css({ height: appHeight - height });

            headerView.setTitle(header.children('h1').text());
            this.header = headerView;
        }
    });

    var ListView = BasicView.extend({
        initialize: function() {
            this.initMarkup();
            this.collection.bind('add', _.bind(this.appendItem, this));

            $('.contents', this.el).append('<ul class="_list"></ul>');
            this.render();
        },

        render: function() {
            $('._list', this.el).html('');

            _.each(this.collection.models, function(item) {
                this.appendItem(item);
            }, this);
        },

        appendItem: function(item) {
            var row = new ListViewRow({ model: item,
                                        titleField: this.options.titleField,
                                        render: this.options.renderRow,
                                        nextView: this.options.nextView,
                                        parent: this });
            $('._list', this.el).append(row.render().el);
        }
    });

    var ListViewRow = Backbone.View.extend({
        tagName: 'li',

        events: {
            'click': 'open'
        },

        initialize: function() {
            this.model.on('change', _.bind(this.render, this));
        },

        render: function() {
            var model = this.model;
            var titleField = this.options.titleField || 'title';

            if(this.options.render) {
                this.options.render(this);
            }
            else if(model.get(titleField)) {
                this.el.innerHTML = model.get(titleField);
            }
            else {
                console.log('[ListViewRow] WARNING: item does not have ' +
                            'a "title" field, the titleField property ' +
                            'is not set, and no custom ' +
                            'render function is set');
            }

            return this;
        },

        open: function() {
            var opts = this.options;

            var item = opts.parent.collection.get(this.model.id);
            var sel = opts.nextView || 'x-view.detail';
            stack.push($(sel).get(0).view, item);
        }
    });


    // TODO: see if I can get it to work with onCreate
    xtag.register('x-view', {
        onInsert: function() {
            this.view = new BasicView({ el: this });

            if(this.dataset.first == 'true') {
                this.style.zIndex = 100;
            }
        }
    });

    xtag.register('x-listview', {
        onInsert: function() {
            this.view = new ListView({ el: this,
                                       collection: new ItemList() });

            if(this.dataset.first == 'true') {
                stack.push(this.view);
            }
        },
        setters: {
            'titleField': function(name) {
                this.view.opts.titleField = name;
            },
            'renderRow': function(func) {
                this.view.opts.renderRow = func;
            },
            'nextView': function(sel) {
                this.view.opts.nextView = sel;
            },
            'collection': function(col) {
                this.view.collection = col;
            }
        },
        methods: {
            add: function(item) {
                this.view.collection.add(item);
            }
        }
    });
});