module("tree test", { 
	setup: function(){
		S.open("//remotesupport/plugins/tree/tree.html");
	}
});

test("Copy Test", function(){
	equals(S("h1").text(), "Welcome to JavaScriptMVC 3.0!","welcome text");
});