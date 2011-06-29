steal.plugins('jquery/controller',
		'jquery/model',
		'jquery/model/backup')

.then(function($){

	/**
	 * This controller keeps track of changes to model attribute values represented by form elements and uses css to highlight the changed
	 * (dirty) form elements. This allows the user to quickly look at the page and see what they have changed before submitting the changes. 
	 * It also provides an easy way to programmatically select the models that have dirty fields so that only those can be updated. It should
	 * be instantiated on the highest level DOM element containing model data.
	 */
	$.Controller.extend('Tcozui.Dirty_Bit', 
	{	
		defaults: {
			dirtyCssClass: 'dirty',
			autoBackup: true
		},
		listensTo: ['cleanBit']
	}, 
	{	
		/**
		 * Initializes a new instance of a the change tracker
		 */
		init: function() {
			
			// Make sure the model option has been set
			if(this.options.model === undefined) {
				steal.dev.warn('A model must be specified for dirty bit to work');
				this.destroy();
				return;
			}
			
			// Make sure the model option has been set to an instance of a model
			if(!(this.options.model instanceof $.Model)) {
				steal.dev.warn('A valid instance of a model must be specified for dirty bit to work');
				this.destroy();
				return
			}
		},
		
		/**
		 * Responds to the change event of elements below it in the DOM. These elements would typically be form inputs that represent an attribute of a model
		 * @param el
		 * @param ev
		 */
		'change': function(el, ev) {
			var target = $(ev.target),
				val,
				model = target.closest('.' + this.options.model.Class._shortName).model(),
				attr = target.attr('name');

			// If the model has not been backed up yet, do a backup
			if(model._backupStore === undefined && this.options.autoBackup) {
				model.backup();
			}
			
			// Retrieve the changed model attribute value from the form element
			val = (target.attr('type').toLowerCase() === 'checkbox') ? target.is(':checked') : target.val();
	
			if(model.attr(attr) !== undefined) { // If the attribute name exists on the model
				
				// Set the current value on the model
				model.attr(attr, val);
				
				if(model.isDirty(attr)) { // Check if the attribute value is the same as its original
					
					// Add the dirty class to the target object and trigger the dirty event for target objects listening
					if(this._cleanRadio(target)) {
						if(target.is(':checked')) {
							target.addClass(this.options.dirtyCssClass).trigger('dirty');
						}
					}
					else {
						target.addClass(this.options.dirtyCssClass).trigger('dirty');
					}
				}
				else {
					
					// Remove the dirty class from the target object and trigger the clean event for target objects listening
					if(!this._cleanRadio(target)) {
						target.removeClass(this.options.dirtyCssClass).trigger('clean');
					}
				}
			}
			else steal.dev.log('Attribute named: [' + attr + '] does not exist on the model');
		},
		
		/**
		 * For radio buttons it's cleanest if we remove the dirty bit from all options in the radio group before adding or removing the bit
		 * @param radio
		 * @returns {Boolean} Was this a radio button
		 */
		_cleanRadio: function(radio) {
			if(radio.attr('type') === 'radio') {
				$('input:radio[name=' + radio.attr('name') + ']', radio.parent()).removeClass(this.options.dirtyCssClass).trigger('clean');
				return true;
			}
			return false;
		},
		
		/**
		 * Responds to the cleanBit event that is triggered on elements below it in the DOM. This is used for when a model has been changed and the updates have been saved. At
		 * this point that attribute is no longer dirty.
		 * @param el
		 * @param ev
		 */
		'cleanBit': function(el, ev) {
			var target = $(ev.target),
				model = target.closest('.' + this.options.model.Class._shortName).model(),
				attr = target.attr('name');
			
			// Update the attribute in the backup store to reflect the newly saved value
			if(this.options.autoBackup) {
				model._backupStore[attr] = model[attr];
			}
			
			if(!this._cleanRadio(target)) {
				$(ev.target).removeClass(this.options.dirtyCssClass).trigger('clean');
			}
		},
		
		/**
		 * Responds to the resetBit event that is triggered on elements below it in the DOM. This helps support clicking a "clear all changes" type button to reset a form
		 * @param el
		 * @param ev
		 */
		'resetBit': function(el, ev) {
			var target = $(ev.target),
				model = target.closest('.' + this.options.model.Class._shortName).model(),
				attr = target.attr('name');
			
			model[attr] = model._backupStore[attr];
			// TODO: Do we need to update the value of the form element (target)?
			target.removeClass(this.options.dirtyCssClass).trigger('clean');
		}
				
	});	

});