
var g_ChapterDeath = function(){
	var deathGeneralData = {"男":{},"女":{},"全部":{}};
	var deathGeneralSum;
	var deathGeneralAge = {"男":{},"女":{},"全部":{}};
	var deathGeneralMapBound = {};

	var deathCancerData = {"男":{},"女":{},"全部":{}};
	var deathCancerSum;
	var deathCancerAge = {"男":{},"女":{},"全部":{}};
	var deathCancerMapBound = {};

	var selectCounty = "總計";
	var selectCause = "";
	var preGraphType = 0;

	var map = new MapTW();

	var loadGraph = function(app){
		if(preGraphType != app.graphType){
			preGraphType = app.graphType;
			selectCause = "";
		}
		switch(app.graphType){
			case 1:	//一般死因
				DrawDeathMapGeneral(app.optionType);
				break;
			case 2:	//癌症死因
				DrawDeathMapCancer(app.optionType);
				break;
		}
	};

	//=====================一般死因=========================
	var DrawCauseAgeGeneral = function(){
		var year = $("#timeRange").val();
		var sex = $("#deathRankSexSelect").val();
		if(!deathGeneralAge[sex][selectCounty]){
			deathGeneralAge[sex][selectCounty] = {};
		}

		function DrawData(){
			var param = {};
	  		param.selector = "#deathAgeSvg";
	  		param.keyXMin = "minAge";
	  		param.keyXMax = "maxAge";
	  		param.minX = 0;
	  		param.maxX = 100;
	  		param.keyY = "count";
	  		param.minColor = "#99FF99";
	  		param.maxColor = "#669966";
	  		param.unitX = "歲";
	  		param.unitY = "人";
	  		param.textInfo = $("#deathAgeInfo");
	  		var sex = $("#deathRankSexSelect").val();
	  		param.data = deathGeneralAge[sex][selectCounty][selectCause][year];
	  		var maxV = 0;
	  		for(var y in  deathGeneralAge[sex][selectCounty][selectCause]){
	  			var yearData = deathGeneralAge[sex][selectCounty][selectCause][y];
	  			var v = d3.max(yearData,function(d){return d.count;});
	  			if(v > maxV) maxV = v;
	  		}
	  		param.maxValue = maxV;
	  		param.infoFn = function(d){
				var num = g_Util.NumberWithCommas(d.count);
				var str = selectCounty+" "+d.minAge+"~"+d.maxAge+"歲 "+num+"人";
				var ratio = (100*d.count/d.total).toFixed(1);
				str += " ("+ratio+"%)";
				return str;
			};
	  		g_SvgGraph.Histogram(param);
		}

		if(deathGeneralAge[sex][selectCounty][selectCause]){
			DrawData();
		}
		else{
			$.get("/deathGeneral?county="+selectCounty+"&cause="+selectCause+"&sex="+sex, function(data){
				var json = JSON.parse(data);
				deathGeneralAge[sex][selectCounty][selectCause] = d3.nest()
			  		.key(function(d) {return d.year;})
			  		.rollup(function(arr){
			  			var total = d3.sum(arr,function(d){return d.count;});
			  			for(var i=0;i<arr.length;i++){
			  				arr[i].total = total;
			  			}
			  			return arr;
			  		})
					.map(json);

				DrawData();
			});
		}
	}

	var DrawDeathRankGeneral = function(){
		var year = $("#timeRange").val();
		var sex = $("#deathRankSexSelect").val();
		function DrawData(){
			var param = {};
	  		param.selector = "#deathRankSvg";
	  		param.key = "cause";
	  		param.value = "count";
	  		param.minColor = "#99FF99";
	  		param.maxColor = "#669966";
	  		param.unit = "人";
	  		param.textInfo = $("#deathRankInfo");
	  		var page = $("#deathRankPage").val();
	  		param.rankOffset = 10*page;
	  		param.rankLength = 10;
	  		param.select = selectCause;
	  		param.data = deathGeneralData[sex][selectCounty][year];
	  		var maxV = 0;
	  		for(var y in deathGeneralData[sex][selectCounty]){
	  			var yearData = deathGeneralData[sex][selectCounty][y];
	  			var v = d3.max(yearData,function(d){return d.count;});
	  			if(v > maxV) maxV = v;
	  		}
	  		param.maxValue = maxV;
	  		param.infoFn = function(d){
				var num = g_Util.NumberWithCommas(d.count);
				var str = d.cause+" "+num+"人";
				var ratio = (100*d.count/d.total).toFixed(1);
				str += " ("+ratio+"%)";
				return str;
			};
			param.clickFn = function(item){
				selectCause = item.attr("data-select");
				$("#deathAgeTitle").text(year+" "+selectCause+" "+sex);
				DrawCauseAgeGeneral();
			}
	  		g_SvgGraph.SortedBar(param);
		}

		if(deathGeneralData[sex][selectCounty]){
			DrawData();
		}
		else{
			$.get("/deathGeneral?sumAge=1&county="+selectCounty+"&sex="+sex, function(data){
				var json = JSON.parse(data);

				deathGeneralData[sex][selectCounty] = d3.nest()
			  		.key(function(d) {return d.year;})
			  		.rollup(function(arr){
			  			var total = d3.sum(arr,function(d){return d.count;});
			  			for(var i=0;i<arr.length;i++){
			  				arr[i].total = total;
			  			}
			  			return arr;
			  		})
					.map(json);

				DrawData();
			});
		}
		
	}

	var DrawDeathMapGeneral = function(optionType){
		var year = $("#timeRange").val();
		var sex = $("#deathRankSexSelect").val();
	  	$("#deathMapTitle").text("死亡人數 "+sex);
	  	function DrawMap(){
	  		var param = {};
	  		param.map = map;
	  		param.year = year;
	  		param.type = optionType;
	  		param.selector = "#deathMapSvg";
	  		param.minBound = deathGeneralMapBound.min;
	  		param.maxBound = deathGeneralMapBound.max;
	  		param.minColor = "#FFFFFF";
	  		param.maxColor = "#999999";
	  		param.textInfo = $("#deathMapInfo");
	  		
	  		param.data = deathGeneralSum[year][sex];
	  		param.unit = "人";
	  		param.clickFn = function(map){
	  			selectCounty = map.GetSelectKey();
	  			$("#deathRankTitle").text(selectCounty+" 死因排序");
	  			DrawDeathRankGeneral();
	  		};
	  		g_SvgGraph.MapTW(param);
	  		DrawDeathRankGeneral();
	  	}

		if(deathGeneralSum){
			DrawMap();
		}
		else{
			$.get("/deathGeneralSum", function(data){
				var json = JSON.parse(data);

				deathGeneralSum = d3.nest()
			  		.key(function(d) {return d.year;})
			  		.key(function(d) {return d.sex;})
					.key(function(d) {return d.county;})
					.rollup(function(arr){
						return d3.sum(arr,function(d){return d.count;});
					})
					.map(json);

				var minV = 1e10,maxV = 0;
				for(var i=0;i<json.length;i++){
					var v = json[i].count;
					if(v < 1000) continue;
					if(v < minV) minV = v;
					if(v > maxV) maxV = v;
				}
				deathGeneralMapBound.min = minV;
				deathGeneralMapBound.max = maxV;

				for(var year in deathGeneralSum){
					for(var sex in deathGeneralSum[year]){
						var sexData = deathGeneralSum[year][sex];
						var total = 0;
						for(var county in sexData){
							total += sexData[county];
						}
						sexData["總計"] = total;
					}
				}

				DrawMap();
			});
		}
	};

	//=====================癌症死因=========================
	var DrawCauseAgeCancer = function(){
		var year = $("#timeRange").val();
		var sex = $("#deathRankSexSelect").val();
		if(!deathCancerAge[sex][selectCounty]){
			deathCancerAge[sex][selectCounty] = {};
		}

		function DrawData(){
			var param = {};
	  		param.selector = "#deathAgeSvg";
	  		param.keyXMin = "minAge";
	  		param.keyXMax = "maxAge";
	  		param.minX = 0;
	  		param.maxX = 100;
	  		param.keyY = "count";
	  		param.minColor = "#FF9999";
	  		param.maxColor = "#996666";
	  		param.unitX = "歲";
	  		param.unitY = "人";
	  		param.textInfo = $("#deathAgeInfo");
	  		var sex = $("#deathRankSexSelect").val();
	  		param.data = deathCancerAge[sex][selectCounty][selectCause][year];
	  		var maxV = 0;
	  		for(var y in  deathCancerAge[sex][selectCounty][selectCause]){
	  			var yearData = deathCancerAge[sex][selectCounty][selectCause][y];
	  			var v = d3.max(yearData,function(d){return d.count;});
	  			if(v > maxV) maxV = v;
	  		}
	  		param.maxValue = maxV;
	  		param.infoFn = function(d){
				var num = g_Util.NumberWithCommas(d.count);
				var str = selectCounty+" "+d.minAge+"~"+d.maxAge+"歲 "+num+"人";
				var ratio = (100*d.count/d.total).toFixed(1);
				str += " ("+ratio+"%)";
				return str;
			};
	  		g_SvgGraph.Histogram(param);
		}

		if(deathCancerAge[sex][selectCounty][selectCause]){
			DrawData();
		}
		else{
			$.get("/deathCancer?county="+selectCounty+"&cause="+selectCause+"&sex="+sex, function(data){
				var json = JSON.parse(data);
				deathCancerAge[sex][selectCounty][selectCause] = d3.nest()
			  		.key(function(d) {return d.year;})
			  		.rollup(function(arr){
			  			var total = d3.sum(arr,function(d){return d.count;});
			  			for(var i=0;i<arr.length;i++){
			  				arr[i].total = total;
			  			}
			  			return arr;
			  		})
					.map(json);

				DrawData();
			});
		}
	}

	var DrawDeathRankCancer = function(){
		var year = $("#timeRange").val();
		var sex = $("#deathRankSexSelect").val();
		function DrawData(){
			var param = {};
	  		param.selector = "#deathRankSvg";
	  		param.key = "cause";
	  		param.value = "count";
	  		param.minColor = "#FF9999";
	  		param.maxColor = "#996666";
	  		param.unit = "人";
	  		param.textInfo = $("#deathRankInfo");
	  		var page = $("#deathRankPage").val();
	  		param.rankOffset = 10*page;
	  		param.rankLength = 10;
	  		param.select = selectCause;
	  		param.data = deathCancerData[sex][selectCounty][year];
	  		var maxV = 0;
	  		for(var y in deathCancerData[sex][selectCounty]){
	  			var yearData = deathCancerData[sex][selectCounty][y];
	  			var v = d3.max(yearData,function(d){return d.count;});
	  			if(v > maxV) maxV = v;
	  		}
	  		param.maxValue = maxV;
	  		param.infoFn = function(d){
				var num = g_Util.NumberWithCommas(d.count);
				var str = d.cause+" "+num+"人";
				var ratio = (100*d.count/d.total).toFixed(1);
				str += " ("+ratio+"%)";
				return str;
			};
			param.clickFn = function(item){
				selectCause = item.attr("data-select");
				$("#deathAgeTitle").text(year+" "+selectCause+" "+sex);
				DrawCauseAgeCancer();
			}
	  		g_SvgGraph.SortedBar(param);
		}

		if(deathCancerData[sex][selectCounty]){
			DrawData();
		}
		else{
			$.get("/deathCancer?sumAge=1&county="+selectCounty+"&sex="+sex, function(data){
				var json = JSON.parse(data);

				deathCancerData[sex][selectCounty] = d3.nest()
			  		.key(function(d) {return d.year;})
			  		.rollup(function(arr){
			  			var total = d3.sum(arr,function(d){return d.count;});
			  			for(var i=0;i<arr.length;i++){
			  				arr[i].total = total;
			  			}
			  			return arr;
			  		})
					.map(json);

				DrawData();
			});
		}
		
	}

	var DrawDeathMapCancer = function(optionType){
		var year = $("#timeRange").val();
		var sex = $("#deathRankSexSelect").val();
	  	$("#deathMapTitle").text("死亡人數 "+sex);
	  	function DrawMap(){
	  		var param = {};
	  		param.map = map;
	  		param.year = year;
	  		param.type = optionType;
	  		param.selector = "#deathMapSvg";
	  		param.minColor = "#FFFFFF";
	  		param.maxColor = "#999999";
	  		param.textInfo = $("#deathMapInfo");
	  		param.minBound = deathCancerMapBound.min;
	  		param.maxBound = deathCancerMapBound.max;
	  		param.data = deathCancerSum[year][sex];
	  		param.unit = "人";
	  		param.clickFn = function(map){
	  			selectCounty = map.GetSelectKey();
	  			$("#deathRankTitle").text(selectCounty+" 死因排序");
	  			DrawDeathRankCancer();
	  		};
	  		g_SvgGraph.MapTW(param);
	  		DrawDeathRankCancer();
	  	}

		if(deathCancerSum){
			DrawMap();
		}
		else{
			$.get("/deathCancerSum", function(data){
				var json = JSON.parse(data);

				deathCancerSum = d3.nest()
			  		.key(function(d) {return d.year;})
			  		.key(function(d) {return d.sex;})
					.key(function(d) {return d.county;})
					.rollup(function(arr){
						return d3.sum(arr,function(d){return d.count;});
					})
					.map(json);

				var minV = 1e10,maxV = 0;
				for(var i=0;i<json.length;i++){
					var v = json[i].count;
					if(v < 100) continue;
					if(v < minV) minV = v;
					if(v > maxV) maxV = v;
				}
				deathCancerMapBound.min = minV;
				deathCancerMapBound.max = maxV;

				for(var year in deathCancerSum){
					for(var sex in deathCancerSum[year]){
						var sexData = deathCancerSum[year][sex];
						var total = 0;
						for(var county in sexData){
							total += sexData[county];
						}
						sexData["總計"] = total;
					}
				}

				DrawMap();
			});
		}
	};

	return {
		loadGraph: loadGraph
	}
}();