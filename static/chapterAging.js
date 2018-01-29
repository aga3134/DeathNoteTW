
var g_ChapterAging = function(){
	var summeryData;
	var mapData;
	var maxData;
	var attrSelect = "";
	
	var houseData;
	var familyData;
	var chronicData;

	var activityData;
	var feelingData;
	var idealLiveData;
	var expectData;

	var livingDifficultyData;
	var functionDifficultyData;
	
	var map = new MapTW();

	var loadGraph = function(app){
		switch(app.graphType){
			case 1:	//抽樣分佈
				if(app.subGraphType == 1) DrawHouseData();
				else if(app.subGraphType == 2) DrawFamilyData();
				else if(app.subGraphType == 3) DrawChronicData();
	  			break;
	  		case 2:	//生活狀況
		  		if(app.subGraphType == 1) DrawActivityData();
		  		else if(app.subGraphType == 2) DrawFeelingData();
		  		else if(app.subGraphType == 3) DrawIdealLiveData();
		  		else if(app.subGraphType == 4) DrawExpectData();
	  			break;
	  		case 3:	//自理能力
	  			if(app.subGraphType == 1) DrawLivingDifficultyData();
		  		else if(app.subGraphType == 2) DrawFunctionDifficultyData();
	  			break;
	  	}
	}

	var UpdateSummery = function(data,dataKey,dataV){
		maxData = {};
		for(var attrGroup in data){
			var maxV = 0;
			for(var key in data[attrGroup]){
				var arr = data[attrGroup][key];
				for(var i=0;i<arr.length;i++){
					if(arr[i][dataKey] == "總計") continue;
					var v = arr[i][dataV];
					if(maxV < v) maxV = v;
				}		
			}
			maxData[attrGroup] = maxV;		
		}
		//console.log(maxData);

		summeryData = {};
		for(var attrGroup in data){
			if(attrGroup == "縣市") continue;
			summeryData[attrGroup] = [];
			var total = 0;
			for(var key in data[attrGroup]){
				var arr = data[attrGroup][key];
				for(var i=0;i<arr.length;i++){
					if(arr[i][dataKey] == "總計"){
						var v = arr[i][dataV];
						summeryData[attrGroup].push({attr:key,value:v});
						total+=v;
					}
				}
			}
			for(var i=0;i<summeryData[attrGroup].length;i++){
				summeryData[attrGroup][i].ratio = (100*summeryData[attrGroup][i].value/total).toFixed(1);
			}
		}
		//console.log(summeryData);

		mapData = {};
		for(var key in data["縣市"]){
			var attr = data["縣市"][key];
			if(/區/.test(attr)) continue;
			for(var i=0;i<arr.length;i++){
				if(arr[i][dataKey] == "總計"){
					var v = arr[i][dataV];
					mapData[key] = v;
				}
			}
		}
		//console.log(mapData);
	}

	//====================抽樣分佈======================
	function StatusGraph(data,dataKey,dataV){
		UpdateSummery(data,dataKey,dataV);
		var attrGroup = $("#agingStatusAttrSelect option:selected").text();
		if(attrGroup == "縣市"){
			var param = {};
	  		param.map = map;
	  		param.year = 2013;
	  		param.type = 1;
	  		param.selector = "#agingStatusAttrSvg";
	  		param.minBound = 10000;
	  		param.maxBound = 1000000;
	  		param.minColor = "#FFFFFF";
	  		param.maxColor = "#999999";
	  		param.textInfo = $("#agingStatusAttrInfo");
	  		param.data = mapData;
	  		param.unit = "人";
	  		param.clickFn = function(map){
	  			selectAttr = map.GetSelectKey();
	  			$("#agingStatusRatioTitle").text(attrGroup+" - "+selectAttr);
	  			StatusSortBar(data,dataKey,dataV);
	  		};
	  		g_SvgGraph.MapTW(param);
		}
		else{
			var param = {};
			param.selector = "#agingStatusAttrSvg";
			param.textInfo = "#agingStatusAttrInfo";
			param.select = summeryData[attrGroup][0].attr;
			param.value = "value";
			param.key = "attr";
			param.data = summeryData[attrGroup];
			param.inRadius = 50;
			param.infoFn = function(d){
				var num = g_Util.NumberWithCommas(d.data.value);
				return d.data.attr+" "+num+"人 ("+d.data.ratio+"%)";
			};
			param.clickFn = function(item){
				selectAttr = item.attr("data-select");
				$("#agingStatusRatioTitle").text(attrGroup+" - "+selectAttr);
				StatusSortBar(data,dataKey,dataV);
			};
			g_SvgGraph.PieChart(param);
			StatusSortBar(data,dataKey,dataV);
		}
	}

	function StatusSortBar(data,dataKey,dataV){
		var attrGroup = $("#agingStatusAttrSelect option:selected").text();
		var param = {};
  		param.selector = "#agingStatusRatioSvg";
  		param.key = dataKey;
  		param.value = dataV;
  		param.maxValue = maxData[attrGroup];
  		param.minColor = "#99FF99";
  		param.maxColor = "#669966";
  		param.unit = "人";
  		param.textInfo = $("#agingStatusRatioInfo");
  		param.data = data[attrGroup][selectAttr].filter(function(d){return d[dataKey]!="總計";});
  		param.infoFn = function(d){
			var num = g_Util.NumberWithCommas(d[dataV]);
			var str = d[dataKey]+" "+num+"人";
			var ratio = (100*d[dataV]/d.total).toFixed(1);
			str += " ("+ratio+"%)";
			return str;
		};
  		g_SvgGraph.SortedBar(param);
	}

	var DrawHouseData = function(){
		if(houseData){
			StatusGraph(houseData,"houseType","count");
		}
		else{
			$.get("/agingSurveyHouseType", function(data){
		  		var json = JSON.parse(data);
		  		houseData = d3.nest()
			  		.key(function(d) {return d.attrGroup;})
					.key(function(d) {return d.attr;})
					.rollup(function(arr){
						var total = arr.filter(function(d){
							return d.houseType == "總計";
						})[0].count;
						for(var i=0;i<arr.length;i++){
							arr[i].total = total;
						}
						return arr;
					})
					.map(json);

				StatusGraph(houseData,"houseType","count");
			});
		}
	};

	var DrawFamilyData = function(){
		if(familyData){
			StatusGraph(familyData,"familyType","count");
		}
		else{
			$.get("/agingSurveyFamilyType", function(data){
		  		var json = JSON.parse(data);
		  		familyData = d3.nest()
			  		.key(function(d) {return d.attrGroup;})
					.key(function(d) {return d.attr;})
					.rollup(function(arr){
						var total = arr.filter(function(d){
							return d.familyType == "總計";
						})[0].count;
						for(var i=0;i<arr.length;i++){
							arr[i].total = total;
						}
						return arr;
					})
					.map(json);

				StatusGraph(familyData,"familyType","count");
			});
		}
	};

	var DrawChronicData = function(){
		if(chronicData){
			StatusGraph(chronicData,"chronic","count");
		}
		else{
			$.get("/AgingSurveyChronic", function(data){
		  		var json = JSON.parse(data);
		  		chronicData = d3.nest()
			  		.key(function(d) {return d.attrGroup;})
					.key(function(d) {return d.attr;})
					.rollup(function(arr){
						arr = arr.filter(function(d){return d.chronic!="有慢性病(%)"});
						var total = arr.filter(function(d){
							return d.chronic == "總計";
						})[0].count;
						for(var i=0;i<arr.length;i++){
							arr[i].total = total;
						}
						return arr;
					})
					.map(json);

				StatusGraph(chronicData,"chronic","count");
			});
		}
	};

	//====================生活狀況======================
	function LivingGraph(data,dataKey,dataV){
		UpdateSummery(data,dataKey,dataV);
		var attrGroup = $("#agingLivingAttrSelect option:selected").text();
		if(attrGroup == "縣市"){
			var param = {};
	  		param.map = map;
	  		param.year = 2013;
	  		param.type = 1;
	  		param.selector = "#agingLivingAttrSvg";
	  		param.minBound = 10000;
	  		param.maxBound = 1000000;
	  		param.minColor = "#FFFFFF";
	  		param.maxColor = "#999999";
	  		param.textInfo = $("#agingLivingAttrInfo");
	  		param.data = mapData;
	  		param.unit = "人";
	  		param.clickFn = function(map){
	  			selectAttr = map.GetSelectKey();
	  			$("#agingLivingRatioTitle").text(attrGroup+" - "+selectAttr);
	  			LivingSortBar(data,dataKey,dataV);
	  		};
	  		g_SvgGraph.MapTW(param);
		}
		else{
			var param = {};
			param.selector = "#agingLivingAttrSvg";
			param.textInfo = "#agingLivingAttrInfo";
			param.select = summeryData[attrGroup][0].attr;
			param.value = "value";
			param.key = "attr";
			param.data = summeryData[attrGroup];
			param.inRadius = 50;
			param.infoFn = function(d){
				var num = g_Util.NumberWithCommas(d.data.value);
				return d.data.attr+" "+num+"人 ("+d.data.ratio+"%)";
			};
			param.clickFn = function(item){
				selectAttr = item.attr("data-select");
				$("#agingLivingRatioTitle").text(attrGroup+" - "+selectAttr);
				LivingSortBar(data,dataKey,dataV);
			};
			g_SvgGraph.PieChart(param);
			LivingSortBar(data,dataKey,dataV);
		}
	}

	function LivingSortBar(data,dataKey,dataV){
		var attrGroup = $("#agingLivingAttrSelect option:selected").text();
		var param = {};
  		param.selector = "#agingLivingRatioSvg";
  		param.key = dataKey;
  		param.value = dataV;
  		param.maxValue = maxData[attrGroup];
  		param.minColor = "#FF9999";
  		param.maxColor = "#996666";
  		param.unit = "人";
  		param.textInfo = $("#agingLivingRatioInfo");
  		param.data = data[attrGroup][selectAttr].filter(function(d){return d[dataKey]!="總計";});
  		param.infoFn = function(d){
			var num = g_Util.NumberWithCommas(d[dataV]);
			var str = d[dataKey]+" "+num+"人";
			var ratio = (100*d[dataV]/d.total).toFixed(1);
			str += " ("+ratio+"%)";
			return str;
		};
  		g_SvgGraph.SortedBar(param);
	}

	var DrawActivityData = function(){
		var importance = $("#agingLivingImportance").val();

		if(activityData){
			LivingGraph(activityData,"activity",importance);
		}
		else{
			$.get("/agingSurveyActivity", function(data){
		  		var json = JSON.parse(data);
		  		activityData = d3.nest()
			  		.key(function(d) {return d.attrGroup;})
					.key(function(d) {return d.attr;})
					.rollup(function(arr){
						var total = arr.filter(function(d){
							return d.activity == "總計";
						})[0].mainCount;
						for(var i=0;i<arr.length;i++){
							arr[i].total = total;
						}
						return arr;
					})
					.map(json);

				LivingGraph(activityData,"activity",importance);
			});
		}
	};

	var DrawFeelingData = function(){
		var frequence = $("#agingLivingFrequence").val();

		if(feelingData){
			LivingGraph(feelingData,"feel",frequence);
		}
		else{
			$.get("/agingSurveyFeeling", function(data){
		  		var json = JSON.parse(data);
		  		feelingData = d3.nest()
			  		.key(function(d) {return d.attrGroup;})
					.key(function(d) {return d.attr;})
					.rollup(function(arr){
						var total = arr.filter(function(d){
							return d.feel == "總計";
						})[0].oftenCount;
						for(var i=0;i<arr.length;i++){
							arr[i].total = total;
						}
						return arr;
					})
					.map(json);

				LivingGraph(feelingData,"feel",frequence);
			});
		}
	};

	var DrawIdealLiveData = function(){
		if(idealLiveData){
			LivingGraph(idealLiveData,"liveType","count");
		}
		else{
			$.get("/agingSurveyIdealLive", function(data){
		  		var json = JSON.parse(data);
		  		idealLiveData = d3.nest()
			  		.key(function(d) {return d.attrGroup;})
					.key(function(d) {return d.attr;})
					.rollup(function(arr){
						var total = arr.filter(function(d){
							return d.liveType == "總計";
						})[0].count;
						for(var i=0;i<arr.length;i++){
							arr[i].total = total;
						}
						return arr;
					})
					.map(json);

				LivingGraph(idealLiveData,"liveType","count");
			});
		}
	};

	var DrawExpectData = function(){
		if(expectData){
			LivingGraph(expectData,"expect","count");
		}
		else{
			$.get("/agingSurveyExpect", function(data){
		  		var json = JSON.parse(data);
		  		expectData = d3.nest()
			  		.key(function(d) {return d.attrGroup;})
					.key(function(d) {return d.attr;})
					.rollup(function(arr){
						var total = arr.filter(function(d){
							return d.expect == "總計";
						})[0].count;
						for(var i=0;i<arr.length;i++){
							arr[i].total = total;
						}
						return arr;
					})
					.map(json);

				LivingGraph(expectData,"expect","count");
			});
		}
	};


	//====================自理能力======================
	function AbilityGraph(data,dataKey,dataV){
		UpdateSummery(data,dataKey,dataV);
		var attrGroup = $("#agingAbilityAttrSelect option:selected").text();
		if(attrGroup == "縣市"){
			var param = {};
	  		param.map = map;
	  		param.year = 2013;
	  		param.type = 1;
	  		param.selector = "#agingAbilityAttrSvg";
	  		param.minBound = 10000;
	  		param.maxBound = 1000000;
	  		param.minColor = "#FFFFFF";
	  		param.maxColor = "#999999";
	  		param.textInfo = $("#agingAbilityAttrInfo");
	  		param.data = mapData;
	  		param.unit = "人";
	  		param.clickFn = function(map){
	  			selectAttr = map.GetSelectKey();
	  			$("#agingAbilityRatioTitle").text(attrGroup+" - "+selectAttr);
	  			AbilitySortBar(data,dataKey,dataV);
	  		};
	  		g_SvgGraph.MapTW(param);
		}
		else{
			var param = {};
			param.selector = "#agingAbilityAttrSvg";
			param.textInfo = "#agingAbilityAttrInfo";
			param.select = summeryData[attrGroup][0].attr;
			param.value = "value";
			param.key = "attr";
			param.data = summeryData[attrGroup];
			param.inRadius = 50;
			param.infoFn = function(d){
				var num = g_Util.NumberWithCommas(d.data.value);
				return d.data.attr+" "+num+"人 ("+d.data.ratio+"%)";
			};
			param.clickFn = function(item){
				selectAttr = item.attr("data-select");
				$("#agingAbilityRatioTitle").text(attrGroup+" - "+selectAttr);
				AbilitySortBar(data,dataKey,dataV);
			};
			g_SvgGraph.PieChart(param);
			AbilitySortBar(data,dataKey,dataV);
		}
	}

	function AbilitySortBar(data,dataKey,dataV){
		var attrGroup = $("#agingAbilityAttrSelect option:selected").text();
		var param = {};
  		param.selector = "#agingAbilityRatioSvg";
  		param.key = dataKey;
  		param.value = dataV;
  		param.maxValue = maxData[attrGroup];
  		param.minColor = "#CCCCFF";
  		param.maxColor = "#8888AA";
  		param.unit = "人";
  		param.textInfo = $("#agingAbilityRatioInfo");
  		param.data = data[attrGroup][selectAttr].filter(function(d){return d[dataKey]!="總計";});
  		param.infoFn = function(d){
			var num = g_Util.NumberWithCommas(d[dataV]);
			var str = d[dataKey]+" "+num+"人";
			var ratio = (100*d[dataV]/d.total).toFixed(1);
			str += " ("+ratio+"%)";
			return str;
		};
  		g_SvgGraph.SortedBar(param);
	}

	var DrawLivingDifficultyData = function(){
		if(livingDifficultyData){
			AbilityGraph(livingDifficultyData,"difficulty","count");
		}
		else{
			$.get("/agingSurveyLivingDifficulty", function(data){
		  		var json = JSON.parse(data);
		  		livingDifficultyData = d3.nest()
			  		.key(function(d) {return d.attrGroup;})
					.key(function(d) {return d.attr;})
					.rollup(function(arr){
						arr = arr.filter(function(d){return d.difficulty!="日常生活起居有困難(%)"});
						var total = arr.filter(function(d){
							return d.difficulty == "總計";
						})[0].count;
						for(var i=0;i<arr.length;i++){
							arr[i].total = total;
						}
						return arr;
					})
					.map(json);

				AbilityGraph(livingDifficultyData,"difficulty","count");
			});
		}
	};

	var DrawFunctionDifficultyData = function(){
		var ability = $("#agingFunctionAbility").val();
		if(functionDifficultyData){
			AbilityGraph(functionDifficultyData,"difficulty",ability);
		}
		else{
			$.get("/agingSurveyFunctionDifficulty", function(data){
		  		var json = JSON.parse(data);
		  		functionDifficultyData = d3.nest()
			  		.key(function(d) {return d.attrGroup;})
					.key(function(d) {return d.attr;})
					.rollup(function(arr){
						var total = arr.filter(function(d){
							return d.difficulty == "總計";
						})[0].canCount;
						for(var i=0;i<arr.length;i++){
							arr[i].total = total;
						}
						return arr;
					})
					.map(json);

				AbilityGraph(functionDifficultyData,"difficulty",ability);
			});
		}
	};

	return {
		loadGraph: loadGraph
	};
}();