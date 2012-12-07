
define(function(require) {
    var anims = require('./anim');

    function ViewStack() {
    }

    ViewStack.prototype.push = function(viewDOM) {
        var stack = this._stack;

        if(!stack) {
            stack = this._stack = [];
        }

        // If it's already in the stack, don't do anything
        if(stack.indexOf(viewDOM) !== -1) {
            return;
        }

        stack.push(viewDOM);

        var view = viewDOM.view;
        var methods = view.stack;

        if(methods && methods.open) {
            var args = Array.prototype.slice.call(arguments, 1);
            view[methods.open].apply(view, args);
        }

        this.animatePush(viewDOM);

        if(stack.length > 1 && view.header) {
            view.header.addBack(this);
        }
    };

    ViewStack.prototype.animatePush = function(viewDOM) {
        viewDOM = $(viewDOM);

        if(this._stack.length > 1) {
            anim.slideLeft(viewDOM);
        }

        viewDOM.css({ zIndex: 100 + this._stack.length });
    };

    ViewStack.prototype.pop = function() {
        if(this._stack) {
            var viewDOM = this._stack.pop();
            var view = viewDOM.view;
            var methods = view.stack;

            if(methods && methods.close) {
                var args = Array.prototype.slice.call(arguments, 1);
                view[methods.close].apply(view, args);
            }

            $(viewDOM).css({
                // TODO: cleanup
                left: $(this._stack[this._stack.length-1]).width()
            });
        }
    };

    ViewStack.prototype.iterate = function(func) {
        this._stack.forEach(function(viewDOM) {
            func(viewDOM);
        });
    };

    ViewStack.prototype.find = function(el) {
        return this._stack.indexOf(el) !== -1;
    };

    return ViewStack;
});