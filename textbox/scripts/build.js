//steal/js tcozui/textbox/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('tcozui/textbox/scripts/build.html',{to: 'tcozui/textbox'});
});
