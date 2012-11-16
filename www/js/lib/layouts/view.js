
define(function(require) {
    var $ = require('zepto');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Header = require('./header');
    var Stack = require('./stack');
    var stack = new Stack();

    var BasicView = Backbone.View.extend({
        stack: {
            'open': 'onOpen'
        },

        initialize: function() {
            this.initMarkup();
        },

        initMarkup: function() {
            // TODO: clean this up and simplify expansion
            var el = $(this.el);
            var appEl = el.parent('x-app');
            var appHeight = appEl.height();

            el.width(appEl.width());

            var headerView = new Header(this.el, stack);
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
        },

        setTitle: function() {
            var titleField = this.options.titleField || 'title';
            var model = this.model;
            var text;

            if(this.getTitle) {
                text = this.getTitle();
            }
            else if(model && model.get(titleField)) {
                text = model.get(titleField);
            }
            else {
                // Since the header may have changed (buttons, etc),
                // reorient the header anyway
                text = this.header.getTitle();
            }

            this.header.setTitle(text);
        },

        onOpen: function() {
            // This method fires when this view appears in the app, so bind
            // the render function to the current model's change event
            if(this.model) {
                this.model.on('change', _.bind(this.render, this));
            }

            this.render();
        },

        open: function(model) {
            this.model = model;
            stack.push(this.el);
        },

        close: function() {
            this.model = null;
            stack.pop();
        },

        render: function() {
            var model = this.model;

            if(this.options.render) {
                this.options.render.call(this.el, model);
            }
            else {
                console.log('[BasicView] WARNING: No render function ' +
                            'available. Set one on the "render" property ' +
                            'of the x-view.');
            }
        }
    });

    // TODO: see if I can get it to work with onCreate
    xtag.register('x-view', {
        onInsert: function() {
            this.view = new BasicView({ el: this });

            if(this.dataset.first == 'true') {
                stack.push(this);
            }
        },
        getters: {
            'model': function() {
                return this.view.model;
            }
        },
        setters: {
            'titleField': function(name) {
                this.view.options.titleField = name;
            },
            'render': function(func) {
                this.view.options.render = func;
            },
            'model': function(model) {
                this.view.model = model;
            }
        },
        methods: {
            'open': function(model) {
                this.view.open(model);
            },
            'close': function() {
                this.view.close();
            }
        }
    });

    return {
        stack: stack,
        BasicView: BasicView
    };
});