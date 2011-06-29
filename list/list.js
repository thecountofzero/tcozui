steal.plugins('jquery/controller',
	'jquery/view/ejs')
	
.css('list',
	'../../jqueryui/css/base/jquery.ui.core',
	'../../jqueryui/css/base/jquery.ui.theme')

.views('//tcozui/list/views/init.ejs',
	'//tcozui/list/views/list.ejs')

.then(function($){
		
	/**
	 * @class Remotesupport.Plugins.List
	 * @tag controllers, UI, list
	 * @author Michael Malamud (mike.malamud@hp.com)
	 * 
	 * This is the controller responsible for creating a list plugin. You pass it a list of models that you want displayed in list form. A good example of
	 * this would be a list of devices. This plugin will not display any attributes of the models shown in the list other than it's name. You must use the 
	 * getName option to tell the list plugin how to get the name attribute and getId option for retreiving the ID. Alternatively, you could provide both
	 * getName() and getId() functions on the prototype of the model being listed.
	 */			
	$.Controller.extend('Tcozui.List', 
	{	
		defaults: {
			list: [],
			getId: function() { return this.getId(); },
			getName: function() { return this.getName(); },
			allowDelete: true,
			enableSearch: true,	
			deleteLogic: function() { return true; },
			heading: ""
		}
	}, 
	{	
		/**
		 * Initializes a new instance of a this controller
		 */		
		init: function() {
			
			var self = this;
			
			// Used to retrieve instances of this type of model
			this.cssName = this.options.list.Class.namespace._shortName;

			if (this.options.heading === "") {
				this.options.heading = "List of " + this.options.list.Class.namespace.fullName + "s";
			}

			// Place holder for current selected item
			this.selectedItem = null;

			this.element.html('//tcozui/list/views/init.ejs', this.options, null, this.callback("createPage"));			
			
		},
		
		/**
		 * Generate the list
		 */
		createPage: function() {
			this._setSearchState();
			this.displayItems(this.options.list);
		},
		
		_setSearchState: function() {
			
			if(this.options.list.length === 0) {
				$('#listSearcher').trigger('disable');
			}
			else {
				$('#listSearcher').trigger('enable');
			}
		},
		
		/**
		 * Refresh/reload the list
		 * @param {Object} list
		 */
		refresh: function(list) {
			this.options.list = list;
			this._setSearchState();
			this.displayItems(list);
		},
		
		/**
		 * Add the items to the list
		 * @param {Object} items
		 */
		displayItems : function(items){
			var self = this;
			
			if (this.options.list.length > 0) {
				$('#list-plugin-main').html('//tcozui/list/views/list.ejs', 
					this.options
				, null, function(){
				
					// Add hover effect to the group names so the delete icon appears.
					self._initTrashIcon();
				});
			}
			else {
				$('#list-plugin-main').html('//tcozui/list/views/empty.ejs', {});
			}		
		},
		
		/**
		 * Retrieve the item (model) associated with the selected (clicked) l node
		 * @param {Object} el
		 * @param {Object} isChild
		 */
		_getItem: function(el) {
			return $(el).closest("." + this.cssName).model();
		},		
		
		/**
		 * Listen for clicks on a list node
		 * @param {Object} el
		 * @param {Object} ev
		 */
		".invoke-showitem click": function(el, ev) {
			
			// Retrieve the associated model
			var item = this._getItem(el);

			if(this.selectedItem) {
				this.selectedItem.removeClass("selected");
				$(this.selectedItem).find(".trash").removeClass("selected");
			}
			this.selectedItem = el;
			this.selectedItem.addClass("selected");
			$(this.selectedItem).find(".trash").addClass("selected");
			this.element.trigger("listItemSelected", item);
	  	},
		
		/**
		 * Listen for clicks on the trash (delete) icon for a list node
		 * @param {Object} el
		 * @param {Object} ev
		 */
		".invoke-deleteitem click": function(el, ev){
			ev.stopPropagation();
			// Retrieve the associated model
			var item = this._getItem(el);
			
			this.element.trigger("listItemDeleted", item);		
		},

		/**
		 * Performs a search on all items names and lists the view to the results
		 * @param {Object} el
		 * @param {Object} ev
		 */
		"#listSearcher keyup": function(el, ev) {
			
			var input = el,
				rows = $('ul.dl-std').children('li').children('div .dl_grid_5'),
				term = $.trim(input.val().toLowerCase()), 
				matches = [];
				cache = rows.map(function() {
					return $(this).text().toLowerCase();
				});

			if (!term) {
				rows.parent().show();
			} 
			else {
				rows.parent().hide();
				cache.each(function(i) {
					if (this.indexOf(term) > -1) { 
						matches.push(i); 
					}
				});
				$.each(matches, function() {
					$(rows[this]).parent().show();
				});
			}
		},		
		
		/**
		 * Respond to when an item is added to the list
		 * @param {Object} list
		 * @param {Object} ev
		 * @param {Object} items
		 */
		"{list} add": function(list, ev, items) {
			var self = this;
			
			for(var i=0, len=items.length; i<len; i++) {
				$("#tag-list").append("//tcozui/list/views/item.ejs", {
					'item': items[i], 
					'getId': this.options.getId, 
					'getName': this.options.getName, 
					'allowDelete': this.options.allowDelete, 
					'deleteLogic': this.options.deleteLogic					
				}, null, function(el) {
					self._initTrashIcon();					
				});
			}			
		},
		
		_initTrashIcon: function() {
			
			$('.invoke-showOnHover').each(function(){
				var el = $(this), parent = el.parent();
				el.hide();
				$(parent).hover(function(){ el.show(); }, function(){ el.hide(); });
			});
		}		
		
	});			
		
});