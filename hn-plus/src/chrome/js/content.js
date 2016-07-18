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

    // Open page links in background tabs.
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

    // Open item links in background tab.
    $('#hnmain > tbody > tr:nth-child(3) > td > table:nth-child(1) a').click(function(event) {
        event.preventDefault();
        var linkUrl = $(this).prop('href');
        openBackgroundTab(linkUrl);
    });

    // Toggle comment collapse when comment is clicked.
    $(document).click(function(event) {
        var target = $(event.target);

        // Open links in background tabs and allow link clicks without toggling
        // comment collapse.
        if ( event.target.nodeName === 'A' ) {
            var linkUrl = target.prop('href');

            // Ignore javascript links.
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

/*
var keyCode = {
    BACKSPACE: 8,
    COMMA: 188,
    DELETE: 46,
    DOWN: 40,
    END: 35,
    ENTER: 13,
    ESCAPE: 27,
    FORWARD_SLASH: 191,
    HOME: 36,
    LEFT: 37,
    PAGE_DOWN: 34,
    PAGE_UP: 33,
    PERIOD: 190,
    RIGHT: 39,
    SPACE: 32,
    TAB: 9,
    UP: 38,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
};

var vimNavigation = {
    currentPosition: -1,
    init: function( entries ) {
        console.info( 'init' );
        this._addStyle();
        this._setEntries( entries );
        this._bindKeyboardEvents();
    },
    _addStyle: function() {
        var style = document.createElement( 'style' );
        style.type = 'text/css';
        style.innerHTML =
            // Highlight active entry.
            '._vimNavActive {' +
                'background-color: #bbccff;' +
            '}' +
            '.athing > td {' +
                'border-bottom: 1px solid transparent;' +
                'border-top: 1px solid transparent;' +
            '}' +
            '._vimNavActive > td {' +
                'border-bottom: 1px solid #888888;' +
                'border-top: 1px solid #888888;' +
            '}' +
            '._vimNavActive > td:first-child {' +
                'border-left: 1px solid #888888;' +
            '}' +
            '._vimNavActive > td:last-child {' +
                'border-right: 1px solid #888888;' +
            '}' +
            '';
        var head = document.getElementsByTagName( 'head' )[ '0' ];
        head.appendChild( style );
    },
    _bindKeyboardEvents: function() {
        console.info( '_bindKeyboardEvents' );
        $( document ).keyup(function( event ) {
            if ( event.which === keyCode.J ) {
                vimNavigation._goToNext();
            } else if ( event.which === keyCode.K ) {
                vimNavigation._goToPrevious();
            } else if ( event.which === keyCode.G && event.shiftKey ) {
                vimNavigation._goToLast();
            }
        });
    },
    _goToCurrentPosition: function() {
        console.info( '_goToCurrentPosition', this.currentPosition );
        var activeEntry = this.entries.get( this.currentPosition );
        if ( activeEntry ) {
            console.log( 'focus on active entry:', activeEntry );
            activeEntry.focus();
            this.entries.removeClass( '_vimNavActive' );
            $( activeEntry ).addClass( '_vimNavActive' );
            var activeEntryOffset = $( activeEntry ).offset();
            var activeEntryTop = activeEntryOffset.top;
            var activeEntryBottom = activeEntryTop + $(activeEntry).height();
            var scrollTop = $( window ).scrollTop();
            var newScrollTop = 0;
            if ( activeEntryBottom > scrollTop + document.body.clientHeight ) {
                newScrollTop = activeEntryTop;
            } else if ( activeEntryTop < scrollTop ) {
                newScrollTop = activeEntryBottom - document.body.clientHeight;
            }

            if ( newScrollTop ) {
                console.info( 'animating to', newScrollTop );
                $( 'html,body' ).stop().animate({
                    'scrollTop': newScrollTop,
                }, 400 );
            }
            console.log( '---' );
        }
    },
    _goToFirst: function() {
        console.info( '_goToFirst' );
        currentPosition = 0;
        this._goToCurrentPosition();
    },
    _goToLast: function() {
        console.info( '_goToLast' );
        currentPosition = this.entries.length - 1;
        this._goToCurrentPosition();
    },
    _goToNext: function() {
        console.info( '_goToNext' );
        if ( this.currentPosition >= this.entries.length - 1 ) {
            this.currentPosition = 0;
        } else {
            this.currentPosition += 1;
        }
        this._goToCurrentPosition();
    },
    _goToPrevious: function() {
        console.info( '_goToPrevious' );
        if ( this.currentPosition > 0 ) {
            this.currentPosition -= 1;
        } else {
            this.currentPosition = this.entries.length - 1;
        }
        this._goToCurrentPosition();
    },
    _setEntries: function( entries ) {
        console.info( '_setEntries', entries );
        this.entries = entries;
        if ( ! ( this.entries.length >= 1 ) ) {
            console.warn( 'entries found:', this.entries.length );
        } else {
            console.log( 'entries found:', this.entries.length );
        }
    },
};


if ( /^https:\/\/news\.ycombinator\.com\/(news)?$/.test( url ) ) {
    console.info('home page');
    vimNavigation.init( $( 'tr.athing > .title > a' ) );
} else if ( /^https:\/\/news\.ycombinator\.com\/item\?id=/.test( url ) ) {
    console.info('item page');

    vimNavigation.init( $( 'html > body > center > table > tbody > tr:eq(2) > td > table:eq(1) > tbody > tr.athing' ) );
}
*/

// Remove existing stylesheet.
var stylesheet = document.querySelector('link[rel="stylesheet"]');
stylesheet.parentNode.removeChild(stylesheet);

// Remove existing background color.
document.querySelector('table[bgcolor]').removeAttribute('bgcolor');
