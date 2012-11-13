
define(function(require) {
    function ViewStack() {
    }

    ViewStack.prototype.push = function(view) {
        if(!this._stack) {
            this._stack = [];
        }

        this._stack.push(view);

        var methods = view.stack;

        if(methods && methods.open) {
            var args = Array.prototype.slice.call(arguments, 1);
            view[methods.open].apply(view, args);
        }

        this.animatePush(view);
        if(view.getTitle) {
            view.header.setTitle(view.getTitle.call(view));
        }

        if(this._stack.length > 1) {
            view.header.addBack(this);
        }
    };

    ViewStack.prototype.animatePush = function(view) {
        var section = $(view.el);

        if(this._stack.length > 1) {
            section.css({
                left: section.width()
            });

            setTimeout(function() {
                section.addClass('moving');
                section.css({
                    left: 0
                });
            }, 0);
        }

        section.css({ zIndex: 100 + this._stack.length });
    };

    ViewStack.prototype.pop = function() {
        if(this._stack) {
            var view = this._stack.pop();
            var methods = view.stack;

            if(methods && methods.close) {
                var args = Array.prototype.slice.call(arguments, 1);
                view[methods.close].apply(view, args);
            }

            $(view.el).css({
                left: $(this._stack[this._stack.length-1].el).width()
            });
        }
    };

    return ViewStack;
});