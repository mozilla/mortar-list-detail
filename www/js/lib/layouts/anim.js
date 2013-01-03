
define(function(require) {
    var $ = require('zepto');
    var animations = require('./css-animations');

    var zindex = 100;

    // Utility

    function vendorized(prop, val, obj) {
        obj = obj || {};
        obj['-webkit-' + prop] = val;
        obj['-moz-' + prop] = val;
        obj['-ms-' + prop] = val;
        obj['-o-' + prop] = val;
        obj[prop] = val;
        return obj;
    }

    function addSingleEvent(node, event, func) {
        node = $(node);
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
        animate(node,
                vendorized('transform', 'translateX(' + Math.floor(start) + 'px)'),
                vendorized('transform', 'translateX(' + Math.floor(end) + 'px)'),
                duration,
                bury);
    }

    function animateY(node, start, end, duration, bury) {
        animate(node,
                vendorized('transform', 'translateY(' + Math.floor(start) + 'px)'),
                vendorized('transform', 'translateY(' + Math.floor(end) + 'px)'),
                duration,
                bury);
    }

    function animate(node, start, end, duration, bury) {
        node = $(node);
        var anim = animations.create();

        anim.setKeyframe('0%', start);
        anim.setKeyframe('100%', end);

        node.css(
            vendorized('animation-duration', duration,
                vendorized('animation-name', anim.name, {
                    'z-index': zindex++
                })
            )
        );

        addSingleEvent(node, 'animationend', function() {
            if(bury) {
                node.css({ zIndex: 0 });
            }

            animations.remove(anim);         
        });
    }

    // Animations

    function instant(srcNode, destNode) {
        $(destNode).css(vendorized('transition', 'none', {
            zIndex: zindex++
        }));
    }

    function instantOut(srcNode, destNode) {
        $(destNode).css(vendorized('transition', 'none', {
            zIndex: 0
        }));
    }

    function slideLeft(srcNode, destNode) {
        animateX(srcNode, 0, -$(srcNode).width(), '500ms');
        animateX(destNode, $(destNode).width(), 0, '500ms');
    }

    function slideLeftOut(srcNode, destNode) {
        slideLeft(destNode, srcNode);
    }

    function slideRight(srcNode, destNode) {
        animateX(srcNode, 0, $(srcNode).width(), '500ms');
        animateX(destNode, -$(destNode).width(), 0, '500ms');
    }

    function slideRightOut(srcNode, destNode) {
        slideRight(destNode, srcNode);
    }

    function slideDown(srcNode, destNode) {
        animateY(destNode, -$(destNode).height(), 0, '500ms');
    }

    function slideDownOut(srcNode, destNode) {
        animateY(destNode, 0, $(destNode).height(), '500ms', true);
    }

    function slideUp(srcNode, destNode) {
        animateY(destNode, $(destNode).height(), 0, '500ms');
    }

    function slideUpOut(srcNode, destNode) {
        animateY(destNode, 0, -$(destNode).height(), '500ms', true);
    }

    function flip(srcNode, destNode) {
        var bg = $('<div class="anim-background"></div>');
        bg.css({ zIndex: zindex++ });
        bg.insertBefore(destNode);

        animate(srcNode,
                vendorized('transform', 'rotate3d(0, 1, 0, 0deg)'),
                vendorized('transform', 'rotate3d(0, 1, 0, 180deg)'),
                '1s');

        animate(destNode,
                vendorized('transform', 'rotate3d(0, 1, 0, 180deg)'),
                vendorized('transform', 'rotate3d(0, 1, 0, 0deg)'),
                '1s');

        addSingleEvent(destNode, 'animationend', function() {
            bg.remove();            
        });
    }

    function flipOut(srcNode, destNode) {
        flip(destNode, srcNode);
    }

    return {
        instant: instant,
        instantOut: instantOut,
        slideLeft: slideLeft,
        slideLeftOut: slideLeftOut,
        slideRight: slideRight,
        slideRightOut: slideRightOut,
        slideDown: slideDown,
        slideDownOut: slideDownOut,
        slideUp: slideUp,
        slideUpOut: slideUpOut,
        flip: flip,
        flipOut: flipOut
    };
});