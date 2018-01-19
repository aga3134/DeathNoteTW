
var g_Util = function(){
	var NumberWithCommas = function(x){
	  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};
	var ColorCategory = function(size){
		var step = 360.0/size;
		var arr = [];
		for(var i=0;i<size;i++){
			arr.push(d3.hsl(i*step,0.6,0.7));
		}
		return function(i){return arr[i].toString();};
	};
	return {
		NumberWithCommas: NumberWithCommas,
		ColorCategory: ColorCategory
	};
}();