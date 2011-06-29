//steal/js tcozui/checkbox/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('tcozui/checkbox/scripts/build.html',{to: 'tcozui/checkbox'});
});
