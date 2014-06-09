/*! Example v1.0.0 | (c) 2014 Example, Inc. | example.com/license */
var loc = window.location.toString();
if ( loc.match(/^https:\/\/news\.ycombinator\.com\/$/) ) {
    $()
        .add( '.title > a' )
        .add( '.subtext a[href^=item\\?id\\=]' )
            .prop( 'target', '_blank' );
}
else if ( loc.match(/^https:\/\/news\.ycombinator\.com\/item\?id=*/) ) {
    function collapseChildren( $commentWrapper, indentation ) {
        var collapsed = $commentWrapper.data( 'collapsed' );
        var $parent = $commentWrapper.find( 'td > table > tbody > tr' );
        var $spacer = $parent.find( 'td:first' )
        var collapsedIcon = "\u229E"; // Squared Plus ("⊞")
        var expandedIcon = "\u229F"; // Squared Minus ("⊟")
        var $collapsible = $spacer.find( 'span' );
        if ( ! $collapsible.length ) {
            $spacer.append( $( '<span>' ) );
            $spacer.css( 'display', 'block' ); // FIXME: Move to css.
            $spacer.css( 'position', 'relative' ); // FIXME: Move to css.
            $collapsible = $spacer.find( 'span' );
            $collapsible.css( 'position', 'absolute' ); // FIXME: Move to css.
            $collapsible.css( 'top', '-5px' ); // FIXME: Move to css.
            $collapsible.css( 'right', '0' ); // FIXME: Move to css.
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
    var commentsSelector = 'html > body > center > table > tbody > tr:eq(2) > td > table:last > tbody > tr';
    $( commentsSelector ).each(function() {
        var $commentWrapper = $(this);
        var $parent = $commentWrapper.find( 'td > table > tbody > tr' );
        var $spacer = $parent.find( 'td:first' )
        var indentation = $spacer.find( 'img' ).prop( 'width' );
        var $vote = $parent.find( 'td[valign]' )
        var $comment = $parent.find( 'td:last' )
        var $commentBody = $comment.find( 'span.comment' );
        $commentBody.click(function( event ) {
            if ( $( event.target ).is( 'a' ) ) {
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
    });
}
else {
}