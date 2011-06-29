//steal/js tcozui/radio/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('tcozui/radio/scripts/build.html',{to: 'tcozui/radio'});
});
