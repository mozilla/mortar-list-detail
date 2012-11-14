
define(function(require) {
    var $ = require('zepto');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Stack = require('layouts/stack');
    var Header = require('layouts/header');

    var APP_SELECTOR = '#app';

    // The default model and collection
    var Item = Backbone.Model.extend({});
    var ItemList = Backbone.Collection.extend({
        model: Item
    });

    var stack = new Stack();

    var EditView = Backbone.View.extend({
        events: {
            'click button.add': 'save'
        },

        stack: {
            'open': 'open'
        },

        getTitle: function() {
            return 'Editing: ' + this.model.get('title');
        },

        open: function(item) {
            this.model = item;

            var el = $(this.el);
            if(item === undefined || item === null) {
                el.find('input').val('');
            }

            if(this.options.render) {
                this.options.render(this);
            }
        },

        back: function() {
            stack.pop();
        },

        save: function() {
            var el = $(this.el);
            var id = el.find('input[name=id]');
            var title = el.find('input[name=title]');
            var desc = el.find('input[name=desc]');

            if(id.val()) {
                var model = itemList.get(id.val());
                model.set({ title: title.val(),
                            desc: desc.val() });
            }
            else {
                itemList.add(new itemList.model({ id: itemList.length,
                                                  title: title.val(),
                                                  desc: desc.val(),
                                                  date: new Date() }));
            }

            stack.pop();
        }
    });

    var DetailView = Backbone.View.extend({
        events: {
            'click button.edit': 'edit'
        },

        stack: {
            'open': 'open'
        },

        getTitle: function() {
            return this.model.get('title');
        },

        open: function(item) {
            this.model = item;

            // Todo: don't bind this multiple times
            this.model.on('change', _.bind(this.render, this));
            this.render();
        },

        edit: function() {
            //window.location.hash = '#edit/' + this.model.id;
            stack.push(editView, this.model);
        },

        render: function() {
            if(this.options.render) {
                this.options.render(this);
            }
        }
    });

    var ListView = Backbone.View.extend({
        initialize: function() {
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
                                        render: this.options.render });
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
            if(this.options.render) {
                this.options.render(this);
            }
            return this;
        },

        open: function() {
            //window.location.hash = '#details/' + this.model.id;
            stack.push(detailView, itemList.get(this.model.id));
        }
    });

    var Workspace = Backbone.Router.extend({
        routes: {
            "": "todos",
            "details/:id": "details",
            "edit/:id": "edit",
            "new": "new_"
        },

        todos: function() {
        },

        details: function(id) {
        },

        edit: function(id) {
        },

        new_: function() {
        }
    });

    window.app = new Workspace();
    Backbone.history.start();

    var BasicView = Backbone.View.extend({
        initMarkup: function() {
            var appHeight = $(APP_SELECTOR).height();

            var el = $(this.el);
            el.width($('body').width());

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

    var itemList = new ItemList();

    return {
        init: function(renderRow, renderDetail, renderEdit) {
            var app = new App({ el: $('#app') });

            $('#app > section').each(function() {
                var el = $(this);
                var view;

                if(el.is('.list')) {
                    view = new ListView({ collection: list,
                                          el: this,
                                          render: renderRow });
                }
                else {
                    view = new BasicView({ el: this });
                }

                view.initMarkup();
            });


            // editView = new EditView({ el: $('#app > section.edit'),
            //                           render: renderEdit});

            // detailView = new DetailView({ el: $('#app > section.detail'),
            //                               render: renderDetail });
            
            // listView = new ListView({ collection: itemList,
            //                           el: $('#app > section.list'),
            //                           render: renderRow });
            
            app.addView(listView);
            app.addView(detailView);
            app.addView(editView);

            stack.push(listView);
        },

        addItem: function(item) {
            itemList.add(item);
        },

        setItems: function(collection) {
            itemList = collection;
        },

        Item: Item
    };
});
