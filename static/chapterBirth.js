
var g_ChapterBirth = function(){
	var popMapData;
	var pyramidData = {};
	var selectCounty = "總計";
	var pyramidScale = {};
	var map = new MapTW();
	var minBound = 0, maxBound = 0;
	var loadGraph = function(graphType,optionType){
	  	switch(graphType){
			case 1:	//人口分佈
	  		{
				DrawPopMap(optionType);
				DrawPopPyramid();
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

	var DrawPopMap = function(type){
	  	var year = $("#timeRange").val();
	  	function DrawMap(data){
			var color = d3.scale.log().domain([minBound,maxBound]).range(["#FFFFFF",'#999999']);
			map.SetData(popMapData[year],color);
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
		  			$("#countyInfo").text("人口數");
		  		}
		  	});
		  	map.OnHoverOut(function(){
		  		if(map.GetSelectKey() != ""){
		  			var num = g_Util.NumberWithCommas(map.GetSelectValue());
		  			$("#countyInfo").text(map.GetSelectKey()+": "+num+"人");
		  		}
		  		else{
		  			$("#countyInfo").text("人口數");
		  		}
		  	});
		  	map.OnClick(function(){
		  		selectCounty = map.GetSelectKey();
		  		$("#chapterBirth").find(".graph-title").text(selectCounty);
		  		DrawPopPyramid();
		  	});
		  	switch(type){
		  		case 1: map.DrawMapTW("#countyPop",year); break;
		  		case 2: map.DrawSortBar("#countyPop",maxBound); break;
		  	}
		  	
		  	if(map.GetSelectKey != ""){
		  		var num = g_Util.NumberWithCommas(map.GetSelectValue());
		  		$("#countyInfo").text(map.GetSelectKey()+": "+num+"人");
		  	}
	  	}

	  	if(popMapData){
	  		DrawMap(popMapData);
	  	}
	  	else{
	  		$.get("/populationByAge?sum=1", function(data){
	  			var minV = 1e10,maxV = 0;
		  		var json = JSON.parse(data);
				for(var i=0;i<json.length;i++){
					if(/[總計省地區]/.test(json[i].county)) continue;
					var v = json[i].count;
					if(v < 1e5) continue;
					if(v > maxV) maxV = v;
					if(v < minV) minV = v;
				}
				minBound = Math.pow(2,Math.ceil(Math.log2(minV)));
				maxBound = Math.pow(2,Math.ceil(Math.log2(maxV)+1));	//男+女

		  		popMapData = d3.nest()
			  		.key(function(d) {return d.year;})
					.key(function(d) {return d.county;})
					.map(json);
				//console.log(popMapData);
				DrawMap(popMapData);
		  	});
	  	}
	  	
	};

	var DrawPopPyramid = function(){
		var year = $("#timeRange").val();

		function DrawPyramid(){
			var param = {};
			param.selector = "#popPyramid";
			param.textInfo = "#pyramidInfo";
			param.data = pyramidData[selectCounty][year];
			param.pyramidScale = pyramidScale[selectCounty];
			g_SvgGraph.PopulationPyramid(param);
		}

		if(pyramidData[selectCounty]){
			DrawPyramid();
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

				DrawPyramid();
			});
		}
	};

	return {
		loadGraph: loadGraph
	}
}();