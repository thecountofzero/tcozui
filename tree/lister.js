steal.plugins('jquery',
	'jquery/dom/fixture',
	'jquery/model/list',
	'remotesupport/plugins/tree',
	'remotesupport/plugins/textbox',
	'remotesupport/plugins/spinner')

.models('//remotesupport/models/devicegroup',
	'//remotesupport/models/site')

.then(function($) {
	
	$(function(){
	
		var self = this,
			tree;
		
		Site.getTree({}, (function(items) {
			
			self.myList = items;
			tree = $("#list-app").remotesupport_plugins_tree({
				list: items,
				getId: function() {
					return this.siteKey;
				},
				getName: function() {
					return this.siteName;
				},
				getChildren: function() {
					return this.devices;
				},
				getChildName: function() {
					return this.name;
				}
			}).controller();
		}));
		
		/*Site.findOne({id: "site1"}, function(s) {
			debugger;
			s.save(function(a,b,c) {
				debugger;
			});
		});*/
		
		var console = $("#console").remotesupport_plugins_textbox();
		
		$("#add").click(function(el, ev) {
			var site = new Site({"siteKey": "somekey", "siteName": "Hoboken Office"});
			self.myList.push(site);
		});
		
		$("#addDevice").click(function(el, ev) {
			var dev = new Device({"name": "harry.potter.com"}),
				site = self.myList[0];
			
			site.devices.push(dev);
			debugger;
			site.save(function(a,b,c) {
				debugger;
			});
		});		
		
		$("#update").click(function(el, ev) {
			debugger;
			ggg.attr("name", "mikey");
			ggg.update({},function(a,b,c) {
				debugger;
			});
		});
		
		$("#refresh").click(function(el, ev) {
			Site.getTree({}, (function(items) {
				tree.refresh(items);
			}));
		});
		
		$(document).bind("listItemSelected", function(event, item) {

			if(item instanceof Device) {
				console.val("Selected: " + item.name);
			}
			else {
				console.val("Selected: " + item.siteName);
			}
		});
		
		$(document).bind("listItemDeleted", function(event, item) {
			if(item instanceof Device) {
				console.val("Deleted: " + item.name);
			}
			else {
				console.val("Deleted: " + item.siteName);
			}
		});		
		
	});
	
});
