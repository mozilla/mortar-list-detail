
define(function(require) {
    var $ = require('zepto');

    var zindex = 100;

    // Utility

    function vendorized(prop, val, obj) {
        obj['-webkit-' + prop] = val;
        obj['-moz-' + prop] = val;
        obj['-ms-' + prop] = val;
        obj['-o-' + prop] = val;
        obj[prop] = val;
        return obj;
    }

    function onOnce(node, event, func) {
        var props = ['', 'webkit', 'moz', 'ms', 'o'];
        for(var k in props) {
            (function(prefix) {
                node.on(prefix + event, function() {
                    func();
                    node.off(prefix + event);
                });
            })(props[k]);
        }
    }

    function animateX(node, start, end, duration, bury) {
        animate(node, start, end, 'left', duration, bury);
    }

    function animate(node, start, end, property, duration, bury) {
        node = $(node);

        node.css(vendorized('transitionDuration', 0, {
            left: start
        }));

        // Triggers a layout which forces the above style to be
        // applied before the transition starts
        var forced = node[0].offsetLeft;

        var styles = {
            left: end,
            zIndex: zindex++
        };

        styles = vendorized('transitionDuration', duration, styles);
        styles = vendorized('transitionProperty', property, styles);
        styles = vendorized('transitionTimingFunction', 'ease-in-out', styles);
        node.css(styles);

        if(bury) {
            onOnce(node, 'transitionend', function() {
                // Bury the element in case the window is resized
                // larger
                node.css({ zIndex: 100 });
            });
        }
    }

    // Animations

    function instant(node) {
        node = $(node);
        node.css(vendorized('transition', 'none', {
            left: 0,
            zIndex: zindex++
        }));
    }

    function instantOut(node) {
        node = $(node);
        node.css(vendorized('transition', 'none', {
            left: node.width()
        }));
    }

    function slideLeft(node) {
        animateX(node, $(node).width(), 0, '300ms');
    }

    function slideRightOut(node) {
        animateX(node, 0, $(node).width(), '300ms', true);
    }

    return {
        instant: instant,
        instantOut: instantOut,
        slideLeft: slideLeft,
        slideRightOut: slideRightOut
    };
});