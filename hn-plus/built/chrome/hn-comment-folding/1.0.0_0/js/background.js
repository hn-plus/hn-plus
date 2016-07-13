/*! Example v1.0.0 | (c) 2016 Example, Inc. | example.com/license */
console.log('background.js');
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log('background message received:', message);
    console.log('sender:', sender);
    if ( message.action === 'chrome.tabs.create' ) {
        var index = sender.tab.index + 1;
        var createProperties = {
            'active': false,
            'index': index,
            'url': message.data.url,
        };
        chrome.tabs.create(createProperties);
    }
});