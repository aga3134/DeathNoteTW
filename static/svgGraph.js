
var g_SvgGraph = function(){
	var PopulationPyramid = function(param){
		if(param.data == null) return;

		var graph = $(param.selector);
		var w = graph.width(), h = graph.height();
		var svg = d3.select(param.selector);
		svg.selectAll("*").remove();
		var scaleW = d3.scale.linear().domain([0,param.pyramidScale]).range([0,w*0.5]);
		var scaleH = d3.scale.linear().domain([0,100]).range([0,h]);

		//console.log(param.data["男"]);
		var maleGroup = svg.append("g");
		maleGroup.selectAll("rect").data(param.data["男"])
			.enter().append("rect")
			.attr("data-info",function(d){
				var num = g_Util.NumberWithCommas(d.count);
				return d.minAge+"~"+d.maxAge+"歲 男: "+num+" 人";
			})
			.attr("width", function(d){return scaleW(d.count);})
			.attr("height", function(d){return scaleH(d.maxAge-d.minAge+1);})
			.attr("stroke","#ffffff")
			.attr("fill","#A1AFC9")
			.attr("x", function(d){return w*0.5-scaleW(d.count);})
			.attr("y", function(d){return h-scaleH(d.maxAge+1);})
			.on("mouseover",function(){
				var cur = d3.select(this);
				hoverRect
					.attr("x",cur.attr("x"))
					.attr("y",cur.attr("y"))
					.attr("width",cur.attr("width"))
					.attr("height",cur.attr("height"));
				$(param.textInfo).text(cur.attr("data-info"));
			});

		var femaleGroup = svg.append("g");
		femaleGroup.selectAll("rect").data(param.data["女"])
			.enter().append("rect")
			.attr("data-info",function(d){
				var num = g_Util.NumberWithCommas(d.count);
				return d.minAge+"~"+d.maxAge+"歲 女: "+num+" 人";
			})
			.attr("width", function(d){return scaleW(d.count);})
			.attr("height", function(d){return scaleH(d.maxAge-d.minAge+1);})
			.attr("stroke","#ffffff")
			.attr("fill","#F47983")
			.attr("x", function(d){return w*0.5;})
			.attr("y", function(d){return h-scaleH(d.maxAge+1);})
			.on("mouseover",function(){
				var cur = d3.select(this);
				hoverRect
					.attr("x",cur.attr("x"))
					.attr("y",cur.attr("y"))
					.attr("width",cur.attr("width"))
					.attr("height",cur.attr("height"));
				$(param.textInfo).text(cur.attr("data-info"));
			});

		var hoverRect = svg.append("rect").attr("class","hoverRect")
			.attr("stroke","#FFAA0D")
			.attr("stroke-width",2)
			.attr("fill","none");
	}

	return {
		PopulationPyramid: PopulationPyramid
	}
}();