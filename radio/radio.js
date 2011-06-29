steal.plugins('jquery/controller')

.css('radio')

.then(function($) {
	
	/**
	 * @class Tcozui.Radio
	 * @tag controllers, radio
	 * @author Michael Malamud (mike.malamud@hp.com)
	 * 
	 * Attaches to a radio button and uses image replacement to allow a radio button to visually support the following states: selected/unselected, enabled/disabed,
	 * active/inactive, and clean/dirty. Since all browsers do not support using css to change background color or other aspects of a radio button, image replacement
	 * is the logical solution. 
	 */	
	$.Controller.extend("Tcozui.Radio", 
	{	
		defaults: { // default css class names
			classes: {
				radioMain: 'radio-main',
				radio: 'radio',
				radioChecked: 'radio-checked',
				radioDirty: 'radio-dirty',
				radioCheckedDirty: 'radio-checked-dirty',
				radioActive: 'radio-active',
				radioCheckedActive: 'radio-checked-active',
				radioDisabled: 'radio-disabled',
				radioCheckedDisabled: 'radio-checked-disabled'
			}
		},
		listensTo: ['dirty', 'clean', 'enable', 'disable']
	}, 
	{	
		/**
		 * Initializes a new instance of a the radio plugin
		 */
		init: function() {	
			
			// This plugin only works on radioes
			if(this.element.attr("type").toLowerCase() !== "radio") {
				this.destroy();
				return;
			}
			
			this.element.addClass("tcozui-radio-button");
			
			// Keeps track of the current state of the radio
			this.curState = {};
			
			// Set the initial state
			this._setState({ checked: false, disabled: false, active: false, dirty: false });
			
			if( this.element.is(":checked") ) { // If checked
				this._setState({ checked: true });
			}
			if( this.element.is(":disabled") ) { // If disabled
				this._setState({ disabled: true });
			}
			
			// Hide the real radio and wrap it in a new div which will use css to display our radio image using css
			this.element.addClass("radio-hide").wrap('<div class="' + this.options.classes.radioMain + '">');
			
			// Retrieve the css classes based on the current state
			this._getClasses();
		},
		
		/**
		 * Destructor method
		 */
		destroy: function() {
			this.element.removeClass("tcozui-radio-button");
			this._super();
		},
		
		/**
		 * Internal function for setting the state of the radio
		 * @param {Object} state
		 */
		_setState: function(state) {
			$.extend(this.curState, state);
		},
		
		/**
		 * Internal function to retrieve the css classes based on the current state of the radio
		 */
		_getClasses: function() {
			
			this.element.parent().addClass( this.curState.checked ? this.options.classes.radioChecked : this.options.classes.radio );
			
			if(this.curState.dirty) {
				this.element.parent().addClass( this.curState.checked ? this.options.classes.radioCheckedDirty : this.options.classes.radioDirty );
			}
			
			if(this.curState.active) {
				this.element.parent().addClass( this.curState.checked ? this.options.classes.radioCheckedActive : this.options.classes.radioActive );
			}
			
			if(this.curState.disabled) {
				this.element.parent().addClass( this.curState.checked ? this.options.classes.radioCheckedDisabled : this.options.classes.radioDisabled );
			}			
			
		},
		
		/**
		 * Internal function to set the css classes which determine which radio image to display
		 */
		_setClass: function() {
			
			// Remove all classes and then add the main radio class
			this.element.parent().removeClass().addClass(this.options.classes.radioMain);
			
			// Retrieve the rest of the css classes based on the current state
			this._getClasses();
		},
		
		/**
		 * Bind to the change event.
		 * @param {Object} el The element that the event was called on
		 * @param {Object} ev The event that was called
		 */
		change: function(el, ev) {			
			var self = this,
				target = ev.target;
			
			this._setState({ checked: this.element.is(":checked") ? true : false });
			this._setClass();
			
			if(this.curState.checked) {
				// Find any other related radio buttons and uncheck them if this one was checked
				$("input[type=radio].tcozui-radio-button").each(function() {
					if(target !== this) {
						$(this).trigger("change");
					}
				});
			}
			
			this.element.trigger("focusout");
		},
		
		/**
		 * Allow the radio to be programatically enabled
		 */
		enable: function() {
			this.element.removeAttr("disabled");
			this._setState({ disabled: false });
			this._setClass();
		},
		
		/**
		 * Allow the radio to be programatically disabled
		 */
		disable: function() {
			this.element.attr("disabled", "disabled");
			this._setState({ disabled: true });
			this._setClass();
		},
		
		/**
		 * Allow the radio to be programatically set to dirty
		 */
		dirty: function() {
			this._setState({ dirty: true });
			this._setClass();
		},
		
		/**
		 * Allow the radio to be programatically set to clean
		 */
		clean: function() {
			this._setState({ dirty: false });
			this._setClass();
		},
		
		/**
		 * Highlight element on focus (focusin is used because focus does not bubble and JMVC uses event delegation)
		 * @param {Object} el The element that the event was called on
		 * @param {Object} ev The event that was called
		 */
		"focusin": function(el, ev) {	
			this._setState({ active: true });
			this._setClass();
		},
		 
		/**
		 * Remove highlight when focus is lost (focusout is used because blur does not bubble and JMVC uses event delegation)
		 * @param {Object} el The element that the event was called on
		 * @param {Object} ev The event that was called
		 */
		"focusout": function(el, ev) {	
			this._setState({ active: false });
			this._setClass();
		},
		
		/**
		 * Allow an option to be programatically selected
		 */
		"select": function() {
			this.element.trigger("click").trigger("change");
		}
				
	});	

});