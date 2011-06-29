//js remotesupport/plugins/list/scripts/doc.js

load('steal/rhino/steal.js');
steal.plugins("documentjs").then(function(){
	DocumentJS('remotesupport/plugins/list/list.html');
});