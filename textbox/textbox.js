steal.plugins('jquery/controller')

.css('textbox')

.then(function($){
	
	/**
	 * @class Tcozui.Plugins.Textbox
	 * @tag controllers, textbox
	 * @author Michael Malamud (mike.malamud@hp.com)
	 * 
	 * Attaches to a textbox, textarea or password form field and applies Remote Support specific styles
	 * and functionality
	 */	
	$.Controller.extend("Tcozui.Textbox", 
	{	
		defaults: {},
		listensTo: ['enable', 'disable']

	}, 
	{	
		/**
		 * Initializes a new instance of a the textbook plugin
		 */
		init: function() {		
			var self = this, e = self.element,
				tagName = self.element.prop("tagName").toLowerCase();
			
			// Only attach controller to elements that have a tag name of "input" or "textarea"
			if(!(tagName === "input" || tagName === "textarea")) {
				this.destroy();
				return;
			}
			
			// If the element's type is not "text" or "password" and it has a tag name of "input", then do not attach the controller
			if(!(self.element.attr("type").toLowerCase() === "text" || self.element.attr("type").toLowerCase() === "password")) {
				if(tagName === "input") {
					this.destroy();
					return;
				}
			}
			
			//this.element.bind('ddd', this.ddd());
			
			// Add the styling to the element
			e.addClass('tcozui-textbox');		
		},
		
		/**
		 * Highlight element on focus (focusin is used because focus does not bubble and JMVC uses event delegation)
		 * @param {Object} el The element that the event was called on
		 * @param {Object} ev The event that was called
		 */
		"focusin": function(el, ev) {	
			$(el).addClass("tcozui-textbox-active");
		},
		 
		/**
		 * Remove highlight when focus is lost (focusout is used because blur does not bubble and JMVC uses event delegation)
		 * @param {Object} el The element that the event was called on
		 * @param {Object} ev The event that was called
		 */
		"focusout": function(el, ev) {			
			$(el).removeClass("tcozui-textbox-active");
		},
		
		"enable": function() {
			this.element.removeClass("tcozui-textbox-disabled");
			this.element.removeAttr("disabled");
		},
		
		"disable": function() {
			this.element.addClass("tcozui-textbox-disabled");
			this.element.attr("disabled", "disabled");
		}
				
	});	

});