
var g_Util = function(){
	var NumberWithCommas = function(x){
	  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};
	return {
		NumberWithCommas: NumberWithCommas
	};
}();