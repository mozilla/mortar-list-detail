
// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

function formatDate(d) {
    return (d.getMonth()+1) + '/' +
        d.getDate() + '/' +
        d.getFullYear();
}


define(function(require) {
    // Zepto (http://zeptojs.com/) and Backbone (http://backbonejs.org/)
    var $ = require('zepto');

    var _ = require('underscore');
    var Backbone = require('backbone');

    var addData = require('./data');

    // Receipt verification (https://github.com/mozilla/receiptverifier)
    require('receiptverifier');

    // Installation button
    require('./install-button');

    // Write your app here.

    var Item = Backbone.Model.extend({});
    var ItemList = Backbone.Collection.extend({
        model: Item
    });

    function ViewStack(opts) {
        this.opts = opts;
    }

    ViewStack.prototype.push = function(view) {
        if(!this._stack) {
            this._stack = [];
        }

        if(this.opts.onPush) {
            this.opts.onPush.call(this, view);
        }

        this._stack.push(view);
        
        var methods = view.stack;

        if(methods && methods.open) {
            var args = Array.prototype.slice.call(arguments, 1);
            view[methods.open].apply(view, args);
        }
    };

    ViewStack.prototype.pop = function() {
        if(this._stack) {
            var view = this._stack.pop();
            var methods = view.stack;

            if(methods && methods.close) {
                var args = Array.prototype.slice.call(arguments, 1);
                view[methods.close].apply(view, args);
            }

            if(this.opts.onPop) {
                this.opts.onPop.call(this, view);
            }
        }
    };

    var stack = new ViewStack({ 
        onPush: function(view) {
            this._stack.forEach(function(view) {
                $(view.el).removeClass('open');
            });

            $(view.el).addClass('open');
        },

        onPop: function(view) {
            $(view.el).removeClass('open');

            var last = this._stack[this._stack.length-1];
            $(last.el).addClass('open');
        }
    });

    var EditView = Backbone.View.extend({
        events: {
            'click button.add': 'save'
        },

        stack: {
            'open': 'open'
        },

        open: function(id) {
            if(id) {
                var model = items.get(id);
                var el = $(this.el);

                el.find('input[name=id]').val(model.id);
                el.find('input[name=title]').val(model.get('title'));
                el.find('input[name=desc]').val(model.get('desc'));
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
                var model = items.get(id.val());
                model.set({ title: title.val(),
                            desc: desc.val() });
            }
            else {
                items.add(new Item({ id: items.length,
                                     title: title.val(),
                                     desc: desc.val(),
                                     date: new Date() }));
            }

            id.val('');
            title.val('');
            desc.val('');

            stack.pop();
        }
    });

    var DetailView = Backbone.View.extend({
        events: {
            'click button.back': 'back',
            'click button.edit': 'edit'
        },

        stack: {
            'open': 'open'
        },

        open: function(item) {
            this.model = item;
            
            // Todo: don't bind this multiple times
            this.model.on('change', _.bind(this.render, this));

            this.render();
        },

        back: function() {
            stack.pop();
        },

        edit: function() {
            //window.location.hash = '#edit/' + this.model.id;
            stack.push(editView, this.model.id);
        },

        render: function() {
            var m = this.model;

            $('.content', this.el).html(
                '<div class="contents">' +
                '<h1>' + m.get('title') + '</h1>' +
                '<p>' + m.get('desc') + '</p>' +
                '<p>' + formatDate(m.get('date')) + '</p>' +
                '</div>'
            );
        }
    });

    var ListView = Backbone.View.extend({
        initialize: function() {
            this.collection.bind('add', _.bind(this.appendItem, this));
            this.render();
        },

        render: function() {
            var el = $(this.el);
            el.html('<div class="contents"><ul></ul></div>');

            _.each(this.collection.models, function(item) {
                this.appendItem(item);
            }, this);
        },

        appendItem: function(item) {
            var row = new ListViewRow({ model: item });
            $('ul', this.el).append(row.render().el);
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
            var m = this.model;

            this.el.innerHTML = m.get('title') + ' - ' +
                '<em>' + formatDate(m.get('date')) + '</em>';

            return this;
        },

        open: function() {
            $(this.el).parent().find('li').removeClass('open');
            $(this.el).addClass('open');
            
            //window.location.hash = '#details/' + this.model.id;
            stack.push(detailView, items.get(this.model.id));
        }
    });

    var items = new ItemList();
    addData(Item, items);

    var editView = new EditView({ el: $('#app > section.edit') });
    var detailView = new DetailView({ el: $('#app > section.detail') });
    var listView = new ListView({ collection: items,
                                  el: $('#app > section.list')});
    stack.push(listView);

    $('header button.add').click(function() {
        stack.push(editView);
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

    window.app.Item = Item;
    window.app.items = items;

    function initUI() {
        var h1 = $('header > h1')[0];
        var els = $('header > *');
        var i = els.get().indexOf(h1);
        var wrapper = '<div class="navitems"></div>';

        els.slice(0, i).wrapAll($(wrapper).addClass('left'));
        els.slice(i+1, els.length).wrapAll($(wrapper).addClass('right'));
        $('header').show();

        var height = $('#app').height();
        var headerHeight = $('#app > header').height();

        var s = $('section.open');
        s.css({ height: height - headerHeight });

        
        //var w = $('#app > section').wrapAll('<div class="views"></div>').width();
        // var cur = 0;
        // $('#app > section').each(function() {
        //     $(this).
        // });
    }

    initUI();

    // window.onresize = function() {
    //     initUI();
    // };

});
