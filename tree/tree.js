steal.plugins('jquery/controller',
	'jquery/view/ejs',
	'remotesupport/lib/remotesupport/localization',
	'remotesupport/plugins/textbox')
	
.css('tree',
	'../../../jqueryui/css/base/jquery.ui.core',
	'../../../jqueryui/css/base/jquery.ui.theme')

.views('//remotesupport/plugins/tree/views/init.ejs',
	'//remotesupport/plugins/tree/views/list.ejs')

.then(function($){
		
	/**
	 * @class Remotesupport.Plugins.List
	 * @tag controllers, UI, list
	 * @author Michael Malamud (mike.malamud@hp.com)
	 * 
	 * This is the controller responsible for creating a tree plugin. You pass it a list of models that has some attribute is another list that you want
	 * displayed in tree form. A good example of this would be if you had a list of baseball teams and each team had a list of players. You could use this
	 * plugin to display the list of teams and their players in a tree form. In this example, the players are the child elements. 
	 * 
	 * This plugin only handles one level of child elements. So, in the above example, the tree will not display any sub elements/attributes of a player.
	 */			
	$.Controller.extend('Remotesupport.Plugins.Tree', 
	{	
		defaults: {
			list: [],
			getId: function() { return this.getId(); },
			getName: function() { return this.getName(); },
			getChildren: function() { return this.getChildren(); },
			getChildName: function() { return this.getName(); },
			allowDelete: false,
			deleteLogic: function() { return true; },
			enableSearch: true,		
			spinner: true
		}
	}, 
	{	
		/**
		 * Initializes a new instance of a this controller
		 */		
		init: function() {
			var self = this,
				tempItem = null,
				tempChildren = [];
				
			// Used to retrieve instances of this type of model
			this.itemCssName = this.options.list.Class.namespace._shortName;
			
			// Used to retrieve instances of the child model type
			this.childCssName = this._getChildCssName();

			// Place holder for current selected item
			this.selectedItem = null;

			$IRS.localization.init(function() {
							
				// Load html from template
				self.element.html('//remotesupport/plugins/tree/views/init.ejs', self.options, null, self.callback("createPage"));				
			}, {localesPath: "/remotesupport/plugins/tree/locales"});			
			
		},
		
		/**
		 * Retrieve the css (JMVC model _shortname) for the type of model that represents the child items
		 */
		_getChildCssName: function() {
			var tempItem = null,
				tempChildren = [];
				
			tempItem = this.options.list[0];
			if(tempItem) {
				tempChildren = this.options.getChildren.call(tempItem);
				if(tempChildren.length > 0) {
					return tempChildren[0].Class._shortName;
				}
			}
			return "";
		},
		
		/**
		 * Generate the tree
		 */
		createPage: function() {
			this.searchBox = $('#treeSearcher');
			this.displayItems(this.options.list);
		},
		
		/**
		 * Reload/refresh the tree with the new list
		 * @param {Object} list
		 */
		refresh: function(list) {
			this.displayItems(list);
		},
		
		/**
		 * Accepts JSON which is then used to filter the current list by hiding any list items not in the JSON 
		 * @param {Object} json
		 */
		filter: function(json) {
			
		},		
		
		/**
		 * Add the items to the tree
		 * @param {Object} items
		 */
		displayItems : function(items) {
			
			var self = this;
						
			$('#tree-plugin-main').html('//remotesupport/plugins/tree/views/tree.ejs', {
					items: items, 
					getId: this.options.getId,
					getName: this.options.getName,
					allowDelete: this.options.allowDelete, 
					deleteLogic: this.options.deleteLogic,
					getChildren: this.options.getChildren,
					getChildName: this.options.getChildName
				}, null, function() {
				
					// Add hover effect to the group names so the delete icon appears.
					$('.invoke-showOnHover').each(function(){
						var el = $(this), parent = el.parent();
						el.hide();
						$(parent).hover(function(){ el.show(); }, function(){ el.hide(); });
					});
			});			
		},
		
		/**
		 * Retrieve the item (model) associated with the selected (clicked) tree node
		 * @param {Object} el
		 * @param {Object} isChild
		 */
		_getItem: function(el, isChild) {
			isChild = isChild || false;
			return (isChild ? $(el).closest("." + this.childCssName).model() : $(el).closest("." + this.itemCssName).model());
		},
		
		
		/**
		 * Update the currently selected tree node
		 * @param {Object} el
		 */
		_toggleSelected: function(el) {
			
			if(this.selectedItem) {
				this.selectedItem.removeClass("selected");
				$(this.selectedItem).find(".trash").removeClass("selected");
			}
			this.selectedItem = el;
			this.selectedItem.addClass("selected");
			$(this.selectedItem).find(".trash").addClass("selected");			
		},		
		
		/**
		 * Listens for clicks on items in the tree
		 * @param {Object} el
		 * @param {Object} ev
		 */
		".invoke-showitem click": function(el, ev) {
			
			// Retrieve the associated model
			var item = this._getItem(el);
			this._toggleSelected(el);
			this.element.trigger("listItemSelected", item);
	  	},
		
		/**
		 * Listens for clicks on child items in the tree
		 * @param {Object} el
		 * @param {Object} ev
		 */
		".invoke-show-subitem click": function(el, ev) {
			
			// Retrieve the associated model
			var item = this._getItem(el, true);
			this._toggleSelected(el);
			this.element.trigger("listItemSelected", item);
	  	},
		
		/**
		 * Listen for clicks on the the trash (delete) icon for items
		 * @param {Object} el
		 * @param {Object} ev
		 */
		".invoke-deleteitem click": function(el, ev) {
			ev.stopPropagation();
			
			// Retrieve the associated model
			var item = this._getItem(el);
			
			this.element.trigger("listItemDeleted", item);		
		},
		
		/**
		 * Listen for clicks on the the trash (delete) icon for child items 
		 * @param {Object} el
		 * @param {Object} ev
		 */
		".invoke-delete-subitem click": function(el, ev) {
			ev.stopPropagation();
			
			// Retrieve the associated model
			var item = this._getItem(el, true);
			
			this.element.trigger("listItemDelete", item);		
		},
		
		/**
		 * Listen for clicks to expand/collapse tree nodes
		 * @param {Object} el
		 * @param {Object} ev
		 */
		".invoke-expandItem click": function(el, ev) {
			var item = this._getItem(el);
			ev.stopPropagation();
			this._expandNode(el.parent().parent());
		},
		
		/**
		 * Listen for clicks to expand/collapse tree nodes
		 * @param {Object} el
		 * @param {Object} ev
		 */
		".invoke-collapseItem click": function(el, ev) {
			var item = this._getItem(el);
			ev.stopPropagation();
			this._collapseNode(el.parent().parent());
		},				
		
		/**
		 * Responds to when a new model is added to the master list
		 * @param {Object} list
		 * @param {Object} ev
		 * @param {Object} items
		 */
		"{list} add": function(list, ev, items) {
			for(var i=0, len=items.length; i<len; i++) {
				$("#node-list").append("//remotesupport/plugins/tree/views/item.ejs", {
					'item': items[i], 
					'getId': this.options.getId, 
					'getName': this.options.getName, 
					'allowDelete': this.options.allowDelete, 
					'deleteLogic': this.options.deleteLogic,
					'getChildren': this.options.getChildren,
					'getChildName': this.options.getChildName
				});
			}			
		},
		
		/**
		 * Filter tree nodes based on the value in the search textbox
		 * @param {Object} keyword
		 * @param {Object} node
		 */
		_processSearch: function(keyword, node) {

			var self = this,
				rows, 
				matches = [],
				parents = $('ul.dl-std ul').find('.parent-node'),
				cache = [];
				
			// Check if a node was passed in. A node will be passed in when we want to limit the search to just that node. This happens when the
			// search box is not empty and a node is expanded. We will only want to show child nodes that match the search box value
			if(node === undefined) {
				
				// Find all leaf nodes (we are actually getting the div containing the label)
				rows = $('ul.dl-std ul').find('.leaf-node-label');
			}
			else {
				
				// Find all leaf nodes for the specific node
				rows = node.parent().find('.leaf-node-label');
			}
			
			// Create an array of leaf node labels
			cache = rows.map(function() {
				return $(this).text().toLowerCase();
			});	
				
			// If the search box has been set to empty string, show all leaf nodes
			if(!keyword) {
				
				// Show all leaf nodes
				rows.each(function() {
					self._showNode($(this).parent());
				})
			} 
			else {
				
				// Hide all leaf nodes
				rows.each(function() {
					self._hideNode($(this).parent());
					
					// Hiding all nodes so let's set the parent tree node's icon to expand mode to keept state in order
					// TODO: We really only need to do this once for a given parent node. 
					self._setExpandIconMode(self._getIcon(self._getParentNode($(this).parent())));
				});
				
				// Find the nodes that match the search box value
				cache.each(function(i) {
					if (this.indexOf(keyword) > -1) { 
						matches.push(i); 
					}
				});
				
				// For all matches, show them
				$.each(matches, function() {	
					var node = $(rows[this]).parent(),
						parent = self._getParentNode(node);
						
					self._showNode(node);
				});
			}			
		},
		
		/**
		 * Performs a search on all child item names and limits the tree view to the results
		 * @param {Object} el
		 * @param {Object} ev
		 */
		"#treeSearcher keyup": function(el, ev) {
			
			this._processSearch($.trim(el.val().toLowerCase()));
		},
		
		/**
		 * Get the parent tree node of a given tree node
		 * @param {Object} node
		 */
		_getParentNode: function(node) {
			if(!node.hasClass('node')) {
				steal.dev.warn('Current node (' + node.attr("id") + ') is not a tree node.')
			}
			return node.parent().parent().siblings().filter('.parent-node');
		},
		
		/**
		 * Retrieve the expand or collapse icon associated with a tree node
		 * @param {Object} node
		 */
		_getIcon: function(node) {
			return $(node).find('.ui-icon');
		},
		
		/**
		 * See a tree node's expand/collapse icon to collapse mode
		 * @param {Object} el
		 */
		_setCollapseIconMode: function(el) {
			el.removeClass('ui-icon-circle-plus').addClass('ui-icon-circle-minus').removeClass('invoke-expandItem').addClass('invoke-collapseItem');
		},
		
		/**
		 * See a tree node's expand/collapse icon to expand mode
		 * @param {Object} el
		 */
		_setExpandIconMode: function(el) {
			el.removeClass('ui-icon-circle-minus').addClass('ui-icon-circle-plus').removeClass('invoke-collapseItem').addClass('invoke-expandItem');
		},		
		
		/**
		 * Expand a tree node and show it's child nodes. The list of child nodes displayed might be filtered if the search box is not empty
		 * @param {Object} node
		 */
		_expandNode: function(node) {			
			var nodeId = node.attr("id");
			
			if(this.options.enableSearch && this.searchBox.val() !== "") {
				var sb = this.searchBox;
				this._processSearch($.trim(this.searchBox.val().toLowerCase()), node);
			}
			else {
				$('#node-list').find('.' + nodeId).each(function(index, el) {				
					$(this).removeClass('collapsed');
				});				
			}
			
			this._setCollapseIconMode(this._getIcon(node));
		},
		
		/**
		 * Collapse a tree node and hide its child nodes
		 * @param {Object} node
		 */
		_collapseNode: function(node) {
			var nodeId = node.attr("id");
			
			$('#node-list').find('.' + nodeId).each(function(index, el) {				
				$(this).addClass('collapsed');
			});
			
			this._setExpandIconMode(this._getIcon(node));			
		},
		
		/**
		 * Display/show a given tree node. This will also have the affect of setting the icon of its parent node to collapse mode
		 * @param {Object} node
		 */
		_showNode: function(node) {
			node.removeClass('collapsed');
			this._setCollapseIconMode(this._getIcon(this._getParentNode(node)));	
		},
		
		/**
		 * Hide a given tree node.
		 * @param {Object} node
		 */
		_hideNode: function(node) {
			node.removeClass('selected').addClass('collapsed');
		}
		
	});			
		
});