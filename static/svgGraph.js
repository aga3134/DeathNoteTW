
var g_SvgGraph = function(){
	var PopulationPyramid = function(selector,data,pyramidScale){
		var graph = $(selector);
		var w = graph.width(), h = graph.height();
		var svg = d3.select(selector);
		svg.selectAll("*").remove();
		var scaleW = d3.scale.linear().domain([0,pyramidScale]).range([0,w*0.5]);
		var scaleH = d3.scale.linear().domain([0,105]).range([0,h]);

		var maleGroup = svg.append("g");
		//console.log(data["男"]);
		maleGroup.selectAll("rect").data(data["男"])
			.enter().append("rect")
			.attr("width", function(d){return scaleW(d.count);})
			.attr("height", function(d){return scaleH(d.maxAge-d.minAge+1);})
			.attr("stroke","#ffffff")
			.attr("fill","#A1AFC9")
			.attr("x", function(d){return w*0.5-scaleW(d.count);})
			.attr("y", function(d){return h-scaleH(d.maxAge+1);});

		var femaleGroup = svg.append("g");
		femaleGroup.selectAll("rect").data(data["女"])
			.enter().append("rect")
			.attr("width", function(d){return scaleW(d.count);})
			.attr("height", function(d){return scaleH(d.maxAge-d.minAge+1);})
			.attr("stroke","#ffffff")
			.attr("fill","#F47983")
			.attr("x", function(d){return w*0.5;})
			.attr("y", function(d){return h-scaleH(d.maxAge+1);});
	}

	return {
		PopulationPyramid: PopulationPyramid
	}
}();