//js remotesupport/plugins/tree/scripts/doc.js

load('steal/rhino/steal.js');
steal.plugins("documentjs").then(function(){
	DocumentJS('remotesupport/plugins/tree/tree.html');
});