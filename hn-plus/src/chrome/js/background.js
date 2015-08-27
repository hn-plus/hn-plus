console.log( 'background.js' );

chrome.runtime.onMessage.addListener(function( message, sender, sendResponse ) {
    console.log( 'background message received:', message );
    //console.log( 'sender:', sender );
    if ( message.action === 'chrome.tabs.create' ) {
        chrome.tabs.create( message.createProperties );
    }
});
