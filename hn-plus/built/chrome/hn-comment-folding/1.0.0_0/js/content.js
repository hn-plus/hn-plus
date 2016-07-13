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
}
// Remove existing stylesheet.
var stylesheet = document.querySelector('link[rel="stylesheet"]');
stylesheet.parentNode.removeChild(stylesheet);
// Remove existing background color.
document.querySelector('table[bgcolor]').removeAttribute('bgcolor');