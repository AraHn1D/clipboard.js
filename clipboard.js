( function() {

	/**
	 * This construction adds method clipboard to Window prototype
	 *
	 * @package clipboard.js
	 * @version 2.0.1.1
	 * @author Yurii Martyshchenko (AraHnID)
	 *
	 * @param {*} mixed The mixed arguments
	 * @returns {*|boolean|*}
	 */
	window.clipboard = function( mixed ) {
		if ( clipboardMethods[ mixed ] ) {
			return clipboardMethods[ mixed ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
		}
		else if ( clipboardMethods[ mixed ] === undefined || typeof mixed === 'object' || !mixed ) {
			return clipboardMethods.copy.apply( this, arguments );
		}
		else {
			throw new Error( 'Method ' + mixed + ' doesn\'t exists for clipboard' );
		}
	};

	var clipboardMethods = {

		/**
		 * Method copies selector's content to clipboard
		 *
		 * @param {Node|Node[]|HTMLCollection|HTMLAllCollection|jQuery|NodeList|string} selector DOM selector to search info
		 * @param {string|boolean} [soughtAttribute] The data attribute which be searched in selector (Can be as the trim argument)
		 * @param {boolean} [trim] Argument determines would selector's info will be cleared from unnecessary whitespaces
		 * @returns {boolean}
		 */
		copy : function( selector, soughtAttribute, trim ) {
			if ( !clipboard( 'isSupported' ) ) {
				return false;
			}

			if ( typeof selector === 'string' ) {
				selector = document.querySelectorAll( selector );
			}
			else if ( !!window.jQuery && selector instanceof window.jQuery ) {
				selector = window.jQuery.makeArray( selector );
			}
			else if ( selector instanceof Node ) {
				selector = [ selector ];
			}
			else if ( !( selector instanceof HTMLAllCollection || selector instanceof HTMLCollection || selector instanceof NodeList ) ) {
				return false;
			}

			if ( selector.length === 0 ) {
				return false;
			}

			trim = typeof soughtAttribute === 'boolean' && trim === undefined ? soughtAttribute : !!trim;

			var receivedValues = [];

			for ( var index = 0, node = selector[ index ]; index < selector.length; node = selector[ ++index ] ) {
				var attributeValue = typeof soughtAttribute === 'string' && soughtAttribute !== '' ? node.getAttribute( soughtAttribute ) : undefined,
					receivedValue;

				if ( typeof attributeValue === 'string' && attributeValue !== '' ) {
					receivedValue = attributeValue;
				}
				else if ( node.tagName === 'INPUT' || node.tagName === 'TEXTAREA' ) {
					receivedValue = node.value;
				}
				else {
					receivedValue = node.textContent;
				}

				// replaces unnecessary chars
				if ( trim ) {
					// this replace is realization of String.prototype.trim method for legacy browsers
					receivedValue = receivedValue.replace( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '' );
				}

				if ( receivedValue !== undefined && receivedValue !== '' ) {
					receivedValues.push( receivedValue );
				}
			}

			if ( receivedValues.length === 0 ) {
				return false;
			}

			var html         = document.querySelector( 'html' ),
				tempTextArea = document.createElement( 'textarea' );

			tempTextArea.style.opacity = '0';
			tempTextArea.style.width = '0';
			tempTextArea.style.height = '0';
			html.appendChild( tempTextArea );
			tempTextArea.value = receivedValues.join( '\n' );

			try {
				tempTextArea.select();
				document.execCommand( 'copy' );
				tempTextArea.parentNode.removeChild( tempTextArea );
				return true;
			}
			catch ( error ) {
				console.error( 'Fallback: Oops, unable to copy', error );
				tempTextArea.parentNode.removeChild( tempTextArea );
				return false;
			}
		},

		/**
		 * Method allows inserting information into user's clipboard
		 *
		 * @param {string|number|array|boolean} [string] The string which will be inserted into user's clipboard
		 * @returns {boolean} The result of inserting
		 */
		insert : function( string ) {
			if ( !clipboard( 'isSupported' ) ) {
				return false;
			}

			string = string === undefined || string === '' ? '\0' : '' + string;

			if ( typeof string !== 'string' ) {
				return false;
			}

			var html         = document.querySelector( 'html' ),
				tempTextArea = document.createElement( 'textarea' );

			tempTextArea.style.opacity = '0';
			tempTextArea.style.width = '0';
			tempTextArea.style.height = '0';
			html.appendChild( tempTextArea );
			tempTextArea.value = string;

			try {
				tempTextArea.select();
				document.execCommand( 'copy' );
				tempTextArea.parentNode.removeChild( tempTextArea );
				return true;
			}
			catch ( error ) {
				console.error( 'Fallback: Oops, unable to insert', error );
				tempTextArea.parentNode.removeChild( tempTextArea );
				return false;
			}
		},

		/**
		 * Method allows clearing user's clipboard
		 *
		 * @returns {boolean} The result of clearing
		 */
		clear : function() {
			if ( !clipboard( 'isSupported' ) ) {
				return false;
			}

			var html         = document.querySelector( 'html' ),
				tempTextArea = document.createElement( 'textarea' );

			tempTextArea.style.opacity = '0';
			tempTextArea.style.width = '0';
			tempTextArea.style.height = '0';
			html.appendChild( tempTextArea );
			tempTextArea.value = '\0';

			try {
				tempTextArea.select();
				document.execCommand( 'copy' );
				tempTextArea.parentNode.removeChild( tempTextArea );
				return true;
			}
			catch ( error ) {
				console.error( 'Fallback: Oops, unable to clear', error );
				tempTextArea.parentNode.removeChild( tempTextArea );
				return false;
			}
		},

		/**
		 * Method verifies is browser supports functionality which is necessary for proper operations
		 *
		 * @returns {boolean}
		 */
		isSupported : function() {
			var support = !!document.queryCommandSupported && !!document.queryCommandSupported( 'copy' );

			if ( !support ) {
				console.warn('Clipboard.js:\n\tThis browser doesn\'t support functionality which is necessary for proper operations!' );
			}

			return support;
		}
	};
} )();