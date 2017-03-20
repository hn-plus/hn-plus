/*! Example v1.0.0 | (c) 2017 Example, Inc. | example.com/license */
function openBackgroundTab(url) {
    console.info('openBackgroundTab:', url);
    chrome.runtime.sendMessage({
        'action': 'chrome.tabs.create',
        'data': {
            'url': url,
        },
    });
}
var url = window.location.toString();
var parser = document.createElement('a');
parser.href = url;
var pathname = parser.pathname;
if ( pathname === '/' ||
     pathname === '/news' ||
     pathname === '/ask' ) {
    console.log('/, /news, or /ask');
    $('.itemlist a').each(function() {
        $(this).click(function(event) {
            console.log(event.target);
            event.preventDefault();
            var linkUrl = $(this).prop('href');
            openBackgroundTab(linkUrl);
        });
    });
    function Interpolate(start, end, steps, count) {
        var s = start;
        var e = end;
        var final = s + (((e - s) / steps) * count);
        return Math.floor(final);
    }
    function Color(_r, _g, _b) {
        var r, g, b;
        var setColors = function(_r, _g, _b) {
            r = _r;
            g = _g;
            b = _b;
        };
        setColors(_r, _g, _b);
        this.getColors = function() {
            var colors = {
                r: r,
                g: g,
                b: b
            };
            return colors;
        };
    }
    function colorscaleNodes(nodes, re) {
        var max = 0;
        var nodesList = [];
        nodes.each(function() {
            var str = $(this).text();
            var found = str.match(re);
            if ( found ) {
                var count = parseInt(found['1']);
                if ( count > max ) {
                    max = count;
                    console.log('max is now: %s', max);
                }
                nodesList.push([$(this), count]);
            }
        });
        $(nodesList).each(function() {
            var node = $(this)[0];
            var count = $(this)[1];
            var val = count / max * 100;
            if ( ! ( val > 15 ) ) {
                return true; // "continue"
            }
            var red = new Color(230, 124, 115); // #e67c73
            var yellow = new Color(255, 214, 102); // #ffd666
            var green = new Color(87, 187, 138); // #57bb8a
            var start = green;
            var end = yellow;
            if ( val > 50 ) {
                start = yellow;
                end = red;
                val = val % 51;
            }
            var startColors = start.getColors();
            var endColors = end.getColors();
            var r = Interpolate(startColors.r, endColors.r, 50, val);
            var g = Interpolate(startColors.g, endColors.g, 50, val);
            var b = Interpolate(startColors.b, endColors.b, 50, val);
            node.css({
                color: '#000',
                backgroundColor: 'rgb(' + r + ',' + g + ',' + b + ')',
            });
        });
    }
    var pointsLinks = $('.score');
    var re = /(\d+) points/;
    colorscaleNodes(pointsLinks, re);
    var commentLinks = $('a[href^=item]:nth-child(2n+0)');
    var re = /(\d+)\xa0comments/;
    colorscaleNodes(commentLinks, re);
} else if ( /^https:\/\/news\.ycombinator\.com\/item\?id=/.test( url ) ) {
    console.info('item page');
    $(document).click(function(event) {
        var target = $(event.target);
        if ( event.target.nodeName === 'A' ) {
            var linkUrl = target.prop('href');
            if ( linkUrl === 'javascript:void(0)' ) {
                return;
            }
            openBackgroundTab(linkUrl);
            event.preventDefault();
            return;
        }
        if ( ! ( window.getSelection().toString() === '' ) ) {
            console.log('selection made');
            return;
        }
        if ( target.hasClass('comment') ||
             target.parents('.comment').length ) {
            var comment = target.parents('.athing');
            var togg = comment.find('.togg');
            togg.get(0).click();
        }
    });
}
// Remove existing stylesheet.
var stylesheet = document.querySelector('link[rel="stylesheet"]');
stylesheet.parentNode.removeChild(stylesheet);
// Remove existing background color.
document.querySelector('table[bgcolor]').removeAttribute('bgcolor');