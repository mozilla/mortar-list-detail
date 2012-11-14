
// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

define(function(require) {
    // Receipt verification (https://github.com/mozilla/receiptverifier)
    require('receiptverifier');

    // Installation button
    require('./install-button');

    // Write your app here.

    require('layouts/view');
    require('layouts/list');

    function formatDate(d) {
        return (d.getMonth()+1) + '/' +
            d.getDate() + '/' +
            d.getFullYear();
    }

    var list = $('.list').get(0);
    list.add({ id: 0,
               title: 'Cook yummy food',
               desc: 'COOK ALL THE THINGS',
               date: new Date() });
    list.add({ id: 1,
               title: 'Make things',
               desc: 'Make this look like that',
               date: new Date(12, 9, 5) });
    list.add({ id: 2,
               title: 'Move stuff',
               desc: 'Move this over there',
               date: new Date(12, 10, 1) });

    var detail = $('.detail').get(0);
    detail.render = function(item) {
        $('.title', this).text(item.get('title'));
        $('.desc', this).text(item.get('desc'));
        $('.date', this).text(formatDate(item.get('date')));
    };

    var edit = $('.edit').get(0);
    edit.render = function(item) {
        $('input[name=id]', this).val(item.id);
        $('input[name=title]', this).val(item.get('title'));
        $('input[name=desc]', this).val(item.get('desc'));
    };

    $('.edit button.add').click(function() {
        var el = $(this);
        var title = el.find('input[name=title]');
        var desc = el.find('input[name=desc]');
        var model = edit.model;

        if(model) {
            model.set({ title: title.val(), desc: desc.val() });
        }
        else {
            list.add({ title: title,
                       desc: desc,
                       date: new Date() });
        }

        edit.pop();
    });

    // function renderEdit(view) {
    //     var model = view.model;
    //     var el = $(this.el);

    //     if(model) {
    //         el.find('input[name=id]').val(model.id);
    //         el.find('input[name=title]').val(model.get('title'));
    //         el.find('input[name=desc]').val(model.get('desc'));
    //     }
    // }

    // app.init(renderRow, renderDetail, renderEdit);
});