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

function openBackgroundTab( url ) {
    console.info( 'openBackgroundTab:', url );
    chrome.runtime.sendMessage({
        'action': 'chrome.tabs.create',
        'createProperties': {
            'active': false,
            'url': url,
        },
    });
}

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

var url = window.location.toString();
console.log( 'url:', url );

if ( /^https:\/\/news\.ycombinator\.com\/(news)?$/.test( url ) ) {
    console.info( 'home page' );

    // Open home page links and comments in new background windows.
    var homePageLinks = $( '.title > a' );
    var commentLinks = $( '.subtext a[href^=item\\?id\\=]' );
    var links = $().add(homePageLinks).add(commentLinks);
    $( links ).each(function() {
        $(this).click(function( event ) {
            console.log( event.target );
            event.preventDefault();
            /*
            console.log( 'current position:', currentPosition );
            if ( event.target.parentElement.classList.contains( 'title' ) ) {
                currentPosition = entries.index( event.target.parentElement.parentElement );
            } else {
                currentPosition = entries.index( $( event.target ).parents( 'tr' ).prev() );
            }
            moveToPosition( currentPosition );
            */
            openBackgroundTab( $(this).prop( 'href' ) );
        });
    });

    // Add search field.
    var $searchInput = $( '<input placeholder="Search" type="text" />' );
    $searchInput.keypress(function( event ) {
        if ( event.which === keyCode.ENTER ) {
            console.log( 'enter pressed', $(this).val() );
            window.location = 'https://hn.algolia.com/#!/all/forever/0/' + encodeURIComponent( $(this).val() );
        }
    });
    $( '.pagetop:first' ).append( ' | ' ).append( $searchInput ).parent().css({'white-space': 'nowrap'});

    $( document ).keyup(function( event ) {
        if ( event.which === keyCode.FORWARD_SLASH ) {
            $searchInput.focus();
        }
    });

    vimNavigation.init( $( 'tr.athing > .title > a' ) );
} else if ( /^https:\/\/news\.ycombinator\.com\/item\?id=/.test( url ) ) {
    console.info( 'item page' );

    vimNavigation.init( $( 'html > body > center > table > tbody > tr:eq(2) > td > table:eq(1) > tbody > tr.athing' ) );

    // Open title in background tab.
    $( 'td[class="title"]:last > a' ).click(function( event ) {
        event.preventDefault();
        openBackgroundTab( $(this).prop( 'href' ) );
    });

    function collapseChildren( $commentWrapper, indentation ) {
        console.info( 'collapseChildren', $commentWrapper, indentation );

        var collapsed = $commentWrapper.data( 'collapsed' );
        console.log( 'collapsed', collapsed );

        var $parent = $commentWrapper.find( 'td > table > tbody > tr' );
        console.log( 'parent', $parent );

        var $spacer = $parent.find( 'td:first' )
        console.log( 'spacer', $spacer );

        var collapsedIcon = "\u229E"; // Squared Plus ("⊞")
        var expandedIcon = "\u229F"; // Squared Minus ("⊟")

        var $collapsible = $spacer.find( 'span' );
        if ( ! $collapsible.length ) {
            $spacer.append( $( '<span>' ) );
            $spacer.css( 'display', 'block' ); // FIXME: Move to css.
            $spacer.css( 'position', 'relative' ); // FIXME: Move to css.
            $collapsible = $spacer.find( 'span' );
            $collapsible.css( 'position', 'absolute' ); // FIXME: Move to css.
            $collapsible.css( 'bottom', '0' ); // FIXME: Move to css.
            $collapsible.css( 'right', '-19px' ); // FIXME: Move to css.
            $collapsible.css( 'font-size', '27px' ); // FIXME: Move to css.
            $collapsible.css( 'opacity', '.5' ); // FIXME: Move to css.
        }

        if ( collapsed ) {
            $collapsible.text( expandedIcon );
        }
        else {
            $collapsible.text( collapsedIcon );
        }

        var $next = $commentWrapper.next();
        while ( $next.length ) {
            var nextIndentation = $next.find( 'td > table > tbody > tr > td:first > img' ).prop( 'width' );
            if ( ! ( nextIndentation > indentation ) ) {
                break;
            }

            if ( collapsed ) {
                $next.show();
            }
            else {
                $next.hide();
            }

            $next = $next.next();
        }

        $commentWrapper.data( 'collapsed', ! collapsed );
    }

    var commentsSelector = 'html > body > center > table > tbody > tr:nth-last-child(2) > td > table:last > tbody > tr';
    $( commentsSelector ).each(function() {
        var $commentWrapper = $(this);
        console.info( 'comment wrapper', $commentWrapper );

        var $parent = $commentWrapper.find( 'td > table > tbody > tr' );
        console.log( 'parent', $parent );

        var $spacer = $parent.find( 'td:first' )
        console.log( 'spacer', $spacer );

        var indentation = $spacer.find( 'img' ).prop( 'width' );
        console.log( 'indentation', indentation );

        var $vote = $parent.find( 'td[valign]' )
        console.log( 'vote', $vote );

        var $comment = $parent.find( 'td:last' )
        console.log( 'comment', $comment );

        var $commentBody = $comment.find( 'span.comment' );
        console.log( 'comment body', $commentBody );
        $commentBody.click(function( event ) {
            console.log( 'comment body clicked', $(this) );

            if ( $( event.target ).is( 'a' ) ) {
                console.log( 'link in comment body clicked ');
                return;
            }

            collapseChildren( $commentWrapper, indentation );
        });
        $commentBody.hover(function() {
            $(this).parent( 'td.default' ).css( 'background-color', '#e0e0e0' );
            $(this).css( 'cursor', 'pointer' ); // FIXME: Maybe move to css.
            $(this).css( 'display', 'block' ); // FIXME: Move to css.
        }, function() {
            $(this).parent( 'td.default' ).css( 'background-color', '' );
        });

        console.log( '---' );
    });
} else {
    console.info( 'other page' );
}
