module("dirty_bit test", { 
	setup: function(){
		S.open("//tcozui/dirty_bit/dirty_bit.html");
	}
});

test("Copy Test", function(){
	equals(S("h1").text(), "Welcome to JavaScriptMVC 3.0!","welcome text");
});