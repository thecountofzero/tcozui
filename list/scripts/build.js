//steal/js remotesupport/plugins/list/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('remotesupport/plugins/list/scripts/build.html',{to: 'remotesupport/plugins/list'});
});
