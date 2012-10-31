
// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

define(function(require) {
    // Receipt verification (https://github.com/mozilla/receiptverifier)
    require('receiptverifier');

    // Installation button
    require('./install-button');

    // Write your app here.

    var app = require('./list-detail');

    app.addItem(new app.Item({ id: 0,
                               title: 'Cook yummy food',
                               desc: 'COOK ALL THE THINGS',
                               date: new Date() }));
    app.addItem(new app.Item({ id: 1,
                               title: 'Make things',
                               desc: 'Make this look like that',
                               date: new Date(12, 9, 5) }));
    app.addItem(new app.Item({ id: 2,
                               title: 'Move stuff',
                               desc: 'Move this over there',
                               date: new Date(12, 10, 1) }));

    function renderRow(view) {
        var model = view.model;
        view.el.innerHTML = model.get('title') + ' - ' +
            '<em>' + formatDate(model.get('date')) + '</em>';
    }

    function renderDetail(view) {
        var model = view.model;

        $('.contents', view.el).html(
            '<h1>' + model.get('title') + '</h1>' +
                '<p>' + model.get('desc') + '</p>' +
                '<p>' + formatDate(model.get('date')) + '</p>'
        );
    }

    function renderEdit(view) {
        var model = view.model;
        var el = $(this.el);

        if(model) {
            el.find('input[name=id]').val(model.id);
            el.find('input[name=title]').val(model.get('title'));
            el.find('input[name=desc]').val(model.get('desc'));
        }
    }

    app.init(renderRow, renderDetail, renderEdit);
});