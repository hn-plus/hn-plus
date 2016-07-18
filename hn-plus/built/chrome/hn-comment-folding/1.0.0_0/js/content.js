/*! Example v1.0.0 | (c) 2016 Example, Inc. | example.com/license */
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
if ( /^https:\/\/news\.ycombinator\.com\/(news)?$/.test(url) ) {
    console.info('home page');
    $('.itemlist a').each(function() {
        $(this).click(function(event) {
            console.log(event.target);
            event.preventDefault();
            var linkUrl = $(this).prop('href');
            openBackgroundTab(linkUrl);
        });
    });
} else if ( /^https:\/\/news\.ycombinator\.com\/item\?id=/.test( url ) ) {
    console.info('item page');
    $('#hnmain > tbody > tr:nth-child(3) > td > table:nth-child(1) a').click(function(event) {
        event.preventDefault();
        var linkUrl = $(this).prop('href');
        openBackgroundTab(linkUrl);
    });
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