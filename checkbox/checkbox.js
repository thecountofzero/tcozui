steal.plugins('jquery/controller')

.css('checkbox')

.then(function($) {
	
	/**
	 * @class Tcozui.Checkbox
	 * @tag controllers, checkbox
	 * @author Michael Malamud (mike.malamud@hp.com)
	 * 
	 * Attaches to a checkbox and uses image replacement to allow a checkbox to visually support the following states: checked/unchecked, enabled/disabed,
	 * active/inactive, and clean/dirty. Since all browsers do not support using css to change background color or other aspects of a checkbox, image replacement
	 * is the logical solution. 
	 */	
	$.Controller.extend("Tcozui.Checkbox", 
	{	
		defaults: { // default css class names
			classes: {
				checkboxMain: 'checkbox-main',
				checkbox: 'checkbox',
				checkboxChecked: 'checkbox-checked',
				checkboxDirty: 'checkbox-dirty',
				checkboxCheckedDirty: 'checkbox-checked-dirty',
				checkboxActive: 'checkbox-active',
				checkboxCheckedActive: 'checkbox-checked-active',
				checkboxDisabled: 'checkbox-disabled',
				checkboxCheckedDisabled: 'checkbox-checked-disabled'
			}
		},
		listensTo: ['dirty', 'clean', 'enable', 'disable']
	}, 
	{	
		/**
		 * Initializes a new instance of a the checkbox plugin
		 */
		init: function() {	
			
			// This plugin only works on checkboxes
			if(this.element.attr("type").toLowerCase() !== "checkbox") {
				this.destroy();
				return;
			}
			
			// Keeps track of the current state of the checkbox
			this.curState = {};
			
			// Set the initial state
			this._setState({ checked: false, disabled: false, active: false, dirty: false });
			
			if( this.element.is(":checked") ) { // If checked
				this._setState({ checked: true });
			}
			if( this.element.is(":disabled") ) { // If disabled
				this._setState({ disabled: true });
			}
			
			// Hide the real checkbox and wrap it in a new div which will use css to display our checkbox image using css
			this.element.addClass("checkbox-hide").wrap('<div class="' + this.options.classes.checkboxMain + '">');
			
			// Retrieve the css classes based on the current state
			this._getClasses();
		},
		
		/**
		 * Internal function for setting the state of the checkbox
		 * @param {Object} state
		 */
		_setState: function(state) {
			$.extend(this.curState, state);
		},
		
		/**
		 * Internal function to retrieve the css classes based on the current state of the checkbox
		 */
		_getClasses: function() {
			
			this.element.parent().addClass( this.curState.checked ? this.options.classes.checkboxChecked : this.options.classes.checkbox );
			
			if(this.curState.dirty) {
				this.element.parent().addClass( this.curState.checked ? this.options.classes.checkboxCheckedDirty : this.options.classes.checkboxDirty );
			}
			
			if(this.curState.active) {
				this.element.parent().addClass( this.curState.checked ? this.options.classes.checkboxCheckedActive : this.options.classes.checkboxActive );
			}
			
			if(this.curState.disabled) {
				this.element.parent().addClass( this.curState.checked ? this.options.classes.checkboxCheckedDisabled : this.options.classes.checkboxDisabled );
			}			
			
		},
		
		/**
		 * Internal function to set the css classes which determine which checkbox image to display
		 */
		_setClass: function() {
			
			// Remove all classes and then add the main checkbox class
			this.element.parent().removeClass().addClass(this.options.classes.checkboxMain);
			
			// Retrieve the rest of the css classes based on the current state
			this._getClasses();
		},
		
		/**
		 * Bind to the change event.
		 * @param {Object} el The element that the event was called on
		 * @param {Object} ev The event that was called
		 */
		"change": function(el, ev) {
			
			this._setState({ checked: this.element.is(":checked") ? true : false });
			this._setClass();
			this.element.trigger("focusout");
		},
		
		/**
		 * Allow the checkbox to be programatically enabled
		 */
		"enable": function() {
			this.element.removeAttr("disabled");
			this._setState({ disabled: false });
			this._setClass();
		},
		
		/**
		 * Allow the checkbox to be programatically disabled
		 */
		"disable": function() {
			this.element.attr("disabled", "disabled");
			this._setState({ disabled: true });
			this._setClass();
		},
		
		/**
		 * Allow the checkbox to be programatically set to dirty
		 */
		"dirty": function() {
			this._setState({ dirty: true });
			this._setClass();
		},
		
		/**
		 * Allow the checkbox to be programatically set to clean
		 */
		"clean": function() {
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
		 * Allow checkbox to be programatically selected
		 */
		"select": function() {
			this.element.trigger("click").trigger("change");
		}		
				
	});	

});