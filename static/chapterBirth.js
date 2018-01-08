
var g_ChapterBirth = function(){
	var pyramidData = {};
	var selectCounty = "總計";
	var pyramidScale = {};
	var loadGraph = function(graphType,optionType){
	  	switch(graphType){
			case 1:	//人口分佈
	  		{
				switch(optionType){
					case 1:	//地圖
						DrawPopMap();
						DrawPopPyramid();
						break;
					case 2:	//排序
						DrawPopSort();
						DrawPopPyramid();
						break;
				}
	  			break;
	  		}
	  		case 2:	//婚姻狀況
	  			break;
	  		case 3:	//出生統計
	  			break;
	  		case 4:	//人口推估
	  			break;
	  	}
	};

	var DrawPopMap = function(){
	  	var year = 1974;
	  	$.get("/populationByAge?sum=1", function(data){
	  		var countySum = d3.nest()
		  		.key(function(d) {return d.year;})
				.key(function(d) {return d.county;})
				.map(JSON.parse(data));
			//console.log(countySum);
			var map = new MapTW();
			var color = d3.scale.log().domain([1e6,1e8]).range(["#CCCCCC",'#333333']);
			map.SetData(countySum[year],color);
		  	map.OnHover(function(){
		  		if(map.GetHoverKey() != ""){
		  			var num = g_Util.NumberWithCommas(map.GetHoverValue());
		  			$("#countyInfo").text(map.GetHoverKey()+": "+num+"人");
		  		}
		  		else if(map.GetSelectKey() != ""){
		  			var num = g_Util.NumberWithCommas(map.GetSelectValue());
		  			$("#countyInfo").text(map.GetSelectKey()+": "+num+"人");
		  		}
		  		else{
		  			$("#countyInfo").text("");
		  		}
		  	});
		  	map.OnHoverOut(function(){
		  		if(map.GetSelectKey() != ""){
		  			var num = g_Util.NumberWithCommas(map.GetSelectValue());
		  			$("#countyInfo").text(map.GetSelectKey()+": "+num+"人");
		  		}
		  		else{
		  			$("#countyInfo").text("");
		  		}
		  	});
		  	map.OnClick(function(){
		  		selectCounty = map.GetSelectKey();
		  		$("#chapterBirth").find(".graph-title").text(selectCounty);
		  		DrawPopPyramid();
		  	});
		  	map.DrawMapTW("#countyPop",year);
	  	});
	};

	var DrawPopSort = function(){
	  	var svg = d3.select("#countyPop");
		svg.selectAll("*").remove();
	};

	var DrawPopPyramid = function(){
		var year = 1974;
		if(pyramidData[selectCounty]){
			g_SvgGraph.PopulationPyramid("#popPyramid",pyramidData[selectCounty][year],pyramidScale[selectCounty]);
		}
		else{
			$.get("/populationByAge?county="+selectCounty, function(data){
				var json = JSON.parse(data).filter(function(d){
					return d.maxAge-d.minAge==4;	//只取5歲區間
				});
				var nestGroup = d3.nest()
					.key(function(d) {return d.year;})
					.key(function(d) {return d.sex;})
					.map(json);
				//console.log(nestGroup);
				var maxV = 0;
				for(var i=0;i<json.length;i++){
					var v = json[i].count;
					if(v > maxV) maxV = v;
				}

				pyramidScale[selectCounty] = Math.pow(2,Math.ceil(Math.log2(maxV)));

				pyramidData[selectCounty] = nestGroup;
		  		g_SvgGraph.PopulationPyramid("#popPyramid",nestGroup[year],pyramidScale[selectCounty]);
			});
		}
	};

	return {
		loadGraph: loadGraph
	}
}();