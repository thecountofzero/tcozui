//steal/js tcozui/dirty_bit/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('tcozui/dirty_bit/scripts/build.html',{to: 'tcozui/dirty_bit'});
});
