steal.plugins('jquery',
	'jquery/dom/fixture',
	'jquery/model/list',
	'tcozui/list',
	'tcozui/textbox')

.models('//models/team')

.then(function($) {
	
	$(function(){
	
		var myList = new Team.List(),
			list = [],
			listController = null;
		
		Team.findAll({}, (function(items) {
			list = items;
			listController = $("#list-app").tcozui_list({
				list: list
			}).controller();
		}));		
		
		var console = $("#console").tcozui_textbox();
		
		$("#add").click(function(el, ev) {
			var dg = new DeviceGroup();
			dg.attr("name", "Windows Boxes");
			list.push(dg);
		});
		
		$("#delete").click(function(el, ev) {
			list.pop();
		});		
		
		$("#update").click(function(el, ev) {
			debugger;
			ggg.attr("name", "mikey");
			ggg.update({},function(a,b,c) {
				debugger;
			});
		});
		
		$("#refresh").click(function(el, ev) {
			DeviceGroup.findAll({}, (function(items) {
				listController.refresh(items);
			}));
		});				
		
		$(document).bind("listItemSelected", function(event, item) {
			console.val("Selected: " + item.name);
		});
		
		$(document).bind("listItemDeleted", function(event, item) {
			console.val("Delete: " + item.name);
		});		
		
	});
	
});
