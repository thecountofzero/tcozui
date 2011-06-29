//steal/js remotesupport/plugins/tree/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('remotesupport/plugins/tree/scripts/build.html',{to: 'remotesupport/plugins/tree'});
});
