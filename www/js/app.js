
// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

define(function(require) {
    // Zepto (http://zeptojs.com/) and Backbone (http://backbonejs.org/)
    var $ = require('zepto');
    var Backbone = require('backbone');
    alert('hi');

    // Receipt verification (https://github.com/mozilla/receiptverifier)
    require('receiptverifier');

    // Installation button
    require('./install-button');

    // Write your app here.

    var Item = Backbone.Model.extend({});
    var ItemList = Backbone.Collection.extend({
        model: Item
    });

    // var DetailView = Backbone.View.extend({
    //     events: {
    //         'click button.back': 'back',
    //         'click button.edit': 'edit'
    //     },

    //     open: function(item) {
    //         this.model = item;
    //         $('#todos .view').removeClass('open');
    //         $('#todos .details').addClass('open');
    //         this.render();
    //     },

    //     back: function() {
    //         listView.open();
    //     },

    //     edit: function() {
    //         window.location.hash = '#edit/' + this.model.id;
    //     },

    //     render: function() {
    //         var m = this.model;

    //         $('.content', this.el).html(
    //             '<h1>' + m.get('title') + '</h1>' +
    //             '<p>' + m.get('desc') + '</p>' +
    //             '<p>' + formatDate(m.get('date')) + '</p>'
    //         );
    //     }
    // });

    // var detailView = new DetailView({ el: $('#todos .details') });

    var ListView = Backbone.View.extend({
        initialize: function() {
            this.collection.bind('add', _.bind(this.appendItem, this));
            this.render();
        },

        // open: function() {
        //     $('#todos .view').removeClass('open');
        //     $('#todos .list').addClass('open');
        // },

        render: function() {
            var el = $(this.el);
            el.html('<ul></ul>');

            _.each(this.collection.models, function(item) {
                this.appendItem(item);
            }, this);
        },

        appendItem: function(item) {
            var row = new ListViewRow({ model: item });
            $('ul', this.el).append(row.render().el);

            // if(!this.hasSelected) {
            //     row.open();
            //     this.hasSelected = true;
            // }
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

            if(detailView.model == this.model) {
                detailView.render();
            }

            return this;
        },

        open: function() {
            // $(this.el).parent().find('li').removeClass('open');
            // $(this.el).addClass('open');
            //window.location.hash = '#details/' + this.model.id;
        }
    });

    var items = new ItemList();
    items.add(new Item({ id: 0,
                         title: 'Cook yummy food',
                         desc: 'COOK ALL THE THINGS',
                         date: new Date() }));
    items.add(new Item({ id: 1,
                         title: 'Make things',
                         desc: 'Make this look like that',
                         date: new Date(12, 9, 5) }));
    items.add(new Item({ id: 2,
                         title: 'Move stuff',
                         desc: 'Move this over there',
                         date: new Date(12, 10, 1) }));

    var listView = new ListView({ collection: items,
                                  el: $('#app .list')});

});

