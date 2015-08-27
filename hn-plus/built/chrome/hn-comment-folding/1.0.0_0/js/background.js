/*! Example v1.0.0 | (c) 2015 Example, Inc. | example.com/license */
console.log( 'background.js' );
chrome.runtime.onMessage.addListener(function( message, sender, sendResponse ) {
    console.log( 'background message received:', message );
    if ( message.action === 'chrome.tabs.create' ) {
        chrome.tabs.create( message.createProperties );
    }
});