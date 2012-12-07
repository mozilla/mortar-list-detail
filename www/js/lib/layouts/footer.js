
define(function(require) {
    var $ = require('zepto');

    function Footer(parent) {
        this.parent = parent;

        var el = $(parent.el).children('footer');
        var _this = this;

        // Add click handlers to each button
        $('button', el).each(function() {
            var btn = $(this);

            // If it has a `data-view` attribute, call `openView` with
            // the value when pressed
            var view = btn.data('view');
            if(view) {
                btn.click(function() {
                    _this.openView(view);
                });
            }
        });

        this.el = el.get(0);
    }

    Footer.prototype.openView = function(viewSelector) {
        var viewDOM = $(viewSelector).get(0);

        if(viewDOM) {
            var view = viewDOM.view;
            var parentDOM = view.parent && view.parent.el;

            // If the target view is going to cover up this view, we
            // want to push it on the stack. Otherwise, simply open it.
            // Also, if there is no parent, push it onto the global stack.
            if(!parentDOM || (parentDOM.contains(this.parent.el) &&
                              parentDOM != this.parent.el)) {
                view.open(null, 'slideLeft');
            }
            else {
                view.openAlone();                            
            }
        }
    };

    return Footer;
});
