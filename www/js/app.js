
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
    //require('backbone.statemanager');

    var addData = require('./data');

    // Receipt verification (https://github.com/mozilla/receiptverifier)
    require('receiptverifier');

    // Installation button
    require('./install-button');

    // Write your app here.

    function openSection(name) {
        $('#app > section').hide();
        $('#app > section.' + name).show();
    }

    var Item = Backbone.Model.extend({});
    var ItemList = Backbone.Collection.extend({
        model: Item
    });

    var DetailView = Backbone.View.extend({
        events: {
            'click button.back': 'back',
            'click button.edit': 'edit'
        },

        open: function(item) {
            this.model = item;
            this.render();
        },

        back: function() {
            window.location.hash = '';
        },

        edit: function() {
            window.location.hash = '#edit/' + this.model.id;
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

    var detailView = new DetailView({ el: $('#app .detail') });

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
            window.location.hash = '#details/' + this.model.id;
        }
    });

    var items = new ItemList();
    addData(Item, items);

    var listView = new ListView({ collection: items,
                                  el: $('#app .list')});

    $('button.add').click(function() {
        var el = $(this).parent();
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

        window.location.hash = '#';
    });

    var Workspace = Backbone.Router.extend({
        routes: {
            "": "todos",
            "details/:id": "details",
            "edit/:id": "edit",
            "new": "new_"
        },

        todos: function() {
            openSection('list');
        },

        details: function(id) {
            openSection('detail');
            detailView.open(items.get(id));
        },

        edit: function(id) {
            openSection('edit');
            var el = $('#app .edit').show();
            var model = items.get(id);

            el.find('input[name=id]').val(model.id);
            el.find('input[name=title]').val(model.get('title'));
            el.find('input[name=desc]').val(model.get('desc'));
        },

        new_: function() {
            openSection('edit');
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

        els.slice(0, i).wrapAll('<div class="left"></div>');
        els.slice(i+1, els.length).wrapAll('<div></div>');
        $('header').show();

        var height = $('#app').height();
        var headerHeight = $('#app > header').height();

        var s = $('section.open');
        s.css({ height: height - headerHeight });
    }

    initUI();
});
