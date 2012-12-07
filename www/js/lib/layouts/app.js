
define(function(require) {
    var $ = require('zepto');
    var Header = require('./header');
    var Footer = require('./footer');

    xtag.register('x-app', {
        onInsert: function() {
            var el = $(this);

            if(el.children('header').length) {
                this.header = new Header(this);
            }

            if(el.children('footer').length) {
                this.footer = new Footer(this);
            }
        }
    });
});