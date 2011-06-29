// Load what we need
steal.plugins('jquery/model',
		'jquery/controller',
		'jquery/view/ejs',
		'jquery/lang/json',
		'tcozui/dirty_bit',
		'remotesupport/plugins/radio',
		'tcozui/checkbox')
	 
.then(function($){

	$.Model.extend("Person", {
		
	},
	{
		
	});

	$(function(){
		
		var p = new Person({
			"name": "Mikey",
			"age": "35",
			"sex": "m",
			"likesJS": true,
			"password": "jmvc",
			"description": "This dude is pretty cool..."
		});
		
		$("#model").append("modelEJS", {person: p}).tcozui_dirty_bit({model: new Person()});
		$("input:radio").remotesupport_plugins_radio();
		$("input:checkbox").remotesupport_plugins_checkbox();
		
	});


});