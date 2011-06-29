module("list test", { 
	setup: function(){
		S.open("//remotesupport/plugins/list/list.html");
	}
});

test("Copy Test", function(){
	equals(S("h1").text(), "Welcome to JavaScriptMVC 3.0!","welcome text");
});