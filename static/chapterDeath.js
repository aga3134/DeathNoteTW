
var g_ChapterDeath = function(){
	var deathGeneralData = {"男":{},"女":{},"全部":{}};
	var deathGeneralSum;
	var deathGeneralAge = {"男":{},"女":{},"全部":{}};
	var deathGeneralMapBound = {};

	var deathCancerData = {"男":{},"女":{},"全部":{}};
	var deathCancerSum;
	var deathCancerAge = {"男":{},"女":{},"全部":{}};
	var deathCancerMapBound = {};

	var popSum;
	var popCountyData = {"男":{},"女":{},"全部":{}};

	var selectCounty = "總計";
	var selectCause = "";
	var preGraphType = 0;
	var deathTitle = "";
	var deathUnit = "";

	var map = new MapTW();

	var loadGraph = function(app){
		if(preGraphType != app.graphType){
			preGraphType = app.graphType;
			selectCause = "";
		}
		switch(app.subGraphType){
			case 1:
				deathTitle = "死亡人數";
				deathUnit = "人";
				break;
			case 2:
				deathTitle = "死亡率";
				deathUnit = "‰";
				break;
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

	function LoadPopSum(callback){
		if(popSum){
			if(callback) callback();
			return;
		}
		$.get("/populationByAge?sum=1", function(data){
	  		var json = JSON.parse(data);
	  		popSum = d3.nest()
		  		.key(function(d) {return d.year;})
		  		.key(function(d) {return d.sex;})
				.key(function(d) {return d.county;})
				.rollup(function(arr){
					return d3.sum(arr,function(d){return d.count;});
				})
				.map(json);

			for(var y in popSum){
				popSum[y]["全部"] = {};
				for(var county in popSum[y]["男"]){
					popSum[y]["全部"][county] = popSum[y]["男"][county];
				}
			}
			for(var y in popSum){
				for(var county in popSum[y]["女"]){
					if(popSum[y]["全部"][county]) popSum[y]["全部"][county]+=popSum[y]["女"][county];
					else popSum[y]["全部"][county] = popSum[y]["女"][county];
				}
			}
			if(callback) callback();
	  	});
	}

	function LoadPopCounty(callback){
		var sex = $("#deathRankSexSelect").val();
		//var stack = new Error().stack;
		//console.log( stack );
		if(popCountyData[sex][selectCounty]){
			if(callback) callback();
			return;
		}
		$.get("/populationByAge?county="+selectCounty, function(data){
			var json = JSON.parse(data).filter(function(d){
				return d.maxAge-d.minAge==4;	//只取5歲區間
			});

			var sexData = d3.nest()
		  		.key(function(d) {return d.sex;})
				.map(json);

			popCountyData["男"][selectCounty] = d3.nest()
	  			.key(function(d) {return d.year;})
	  			.key(function(d) {return d.minAge;})
	  			.rollup(function(arr){
	  				return d3.sum(arr,function(d){return d.count;});
	  			})
				.map(sexData["男"]);

			popCountyData["女"][selectCounty] = d3.nest()
	  			.key(function(d) {return d.year;})
	  			.key(function(d) {return d.minAge;})
	  			.rollup(function(arr){
	  				return d3.sum(arr,function(d){return d.count;});
	  			})
				.map(sexData["女"]);

			popCountyData["全部"][selectCounty] = {};
			for(var y in popCountyData["男"][selectCounty]){
				popCountyData["全部"][selectCounty][y] = {};
				var yearData = popCountyData["男"][selectCounty][y];
				for(var age in yearData){
					popCountyData["全部"][selectCounty][y][age] = yearData[age];
				}
			}

			for(var y in popCountyData["女"][selectCounty]){
				var yearData = popCountyData["女"][selectCounty][y];
				for(var age in yearData){
					if(popCountyData["全部"][selectCounty][y][age]){
						popCountyData["全部"][selectCounty][y][age] += yearData[age];
					}
					else{
						popCountyData["全部"][selectCounty][y][age] = yearData[age];
					}
				}
			}
			if(callback) callback();

		});
	}

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
	  		param.unitY = deathUnit;
	  		param.textInfo = $("#deathAgeInfo");
	  		var sex = $("#deathRankSexSelect").val();

	  		var maxV = 0;
	  		var deathData;
	  		switch(deathTitle){
	  			case "死亡人數":
	  				deathData = deathGeneralAge[sex][selectCounty][selectCause][year];
	  				for(var y in  deathGeneralAge[sex][selectCounty][selectCause]){
			  			var yearData = deathGeneralAge[sex][selectCounty][selectCause][y];
			  			var v = d3.max(yearData,function(d){return d.count;});
			  			if(v > maxV) maxV = v;
			  		}
	  				break;
	  			case "死亡率":
	  				deathData = [];
	  				for(var i=0;i<deathGeneralAge[sex][selectCounty][selectCause][year].length;i++){
	  					var v = deathGeneralAge[sex][selectCounty][selectCause][year][i];
	  					var popNum = popCountyData[sex][selectCounty][year][v.minAge];
	  					if(!popNum) continue;
	  					var d = {year:v.year,cause:v.cause,county:v.county,sex:v.sex,
	  						minAge:v.minAge,maxAge:v.maxAge,
	  						count: (1000*v.count/popNum).toFixed(3)};
	  					deathData.push(d);
	  				}
	  				maxV = 10;
	  				break;
	  		}
	  		param.data = deathData;
	  		param.maxValue = maxV;
	  		param.infoFn = function(d){
				var num = g_Util.NumberWithCommas(d.count);
				var str = selectCounty+" "+d.minAge+"~"+d.maxAge+"歲 "+num+deathUnit;
				if(d.total){
					var ratio = (100*d.count/d.total).toFixed(1);
					str += " ("+ratio+"%)";
				}
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
	  		param.unit = deathUnit;
	  		param.textInfo = $("#deathRankInfo");
	  		var page = $("#deathRankPage").val();
	  		param.rankOffset = 10*page;
	  		param.rankLength = 10;
	  		param.select = selectCause;
	  
	  		var maxV = 0;
	  		for(var y in deathGeneralData[sex][selectCounty]){
	  			var yearData = deathGeneralData[sex][selectCounty][y];
	  			var v = d3.max(yearData,function(d){return d.count;});
	  			if(v > maxV) maxV = v;
	  		}
	  		var deathData;
	  		switch(deathTitle){
	  			case "死亡人數":
	  				deathData = deathGeneralData[sex][selectCounty][year];
	  				break;
	  			case "死亡率":
	  				deathData = [];
	  				var popNum = popSum[year][sex][selectCounty];
	  				for(var i=0;i<deathGeneralData[sex][selectCounty][year].length;i++){
	  					var v = deathGeneralData[sex][selectCounty][year][i];
	  					var d = {year:v.year,cause:v.cause,county:v.county,sex:v.sex,
	  						count: (1000*v.count/popNum).toFixed(3)};
	  					deathData.push(d);
	  				}
	  				maxV = (1000*maxV/popNum).toFixed(3);
	  				break;
	  		}
	  		param.data = deathData;
	  		param.maxValue = maxV;
	  		param.infoFn = function(d){
				var num = g_Util.NumberWithCommas(d.count);
				var str = d.cause+" "+num+deathUnit;
				if(d.total){
					var ratio = (100*d.count/d.total).toFixed(1);
					str += " ("+ratio+"%)";
				}
				return str;
			};
			param.clickFn = function(item){
				selectCause = item.attr("data-select");
				$("#deathAgeTitle").text(year+"年 "+selectCause+" 性別:"+sex);
				LoadPopCounty(DrawCauseAgeGeneral);
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
	  	$("#deathMapTitle").text(deathTitle+" 性別:"+sex);
	  	function DrawMap(){
	  		var param = {};
	  		param.map = map;
	  		param.year = year;
	  		param.type = optionType;
	  		param.selector = "#deathMapSvg";
	  		param.minColor = "#FFFFFF";
	  		param.maxColor = "#999999";
	  		param.textInfo = $("#deathMapInfo");

	  		var deathData;
	  		switch(deathTitle){
	  			case "死亡人數":
	  				deathData = deathGeneralSum[year][sex];
	  				param.minBound = deathGeneralMapBound.min;
	  				param.maxBound = deathGeneralMapBound.max;
	  				break;
	  			case "死亡率":
	  				deathData = {};
	  				for(var county in deathGeneralSum[year][sex]){
	  					var deathNum = deathGeneralSum[year][sex][county];
	  					var popNum = popSum[year][sex][county];
	  					deathData[county] = (1000*deathNum/popNum).toFixed(3);
	  				}
	  				param.minBound = 1;
	  				param.maxBound = 10;
	  				break;
	  		}
	  		param.data = deathData;
	  		param.unit = deathUnit;
	  		param.clickFn = function(map){
	  			selectCounty = map.GetSelectKey();
	  			$("#deathRankTitle").text(selectCounty+" 死因排序");
	  			DrawDeathRankGeneral();
	  		};
	  		g_SvgGraph.MapTW(param);
	  		//DrawDeathRankGeneral();
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

		  		LoadPopSum(DrawMap());
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
	  		param.unitY = deathUnit;
	  		param.textInfo = $("#deathAgeInfo");
	  		var sex = $("#deathRankSexSelect").val();
	  		var maxV = 0;
	  		var deathData;
	  		switch(deathTitle){
	  			case "死亡人數":
	  				deathData = deathCancerAge[sex][selectCounty][selectCause][year];
	  				for(var y in  deathCancerAge[sex][selectCounty][selectCause]){
			  			var yearData = deathCancerAge[sex][selectCounty][selectCause][y];
			  			var v = d3.max(yearData,function(d){return d.count;});
			  			if(v > maxV) maxV = v;
			  		}
	  				break;
	  			case "死亡率":
	  				deathData = [];
	  				for(var i=0;i<deathCancerAge[sex][selectCounty][selectCause][year].length;i++){
	  					var v = deathCancerAge[sex][selectCounty][selectCause][year][i];
	  					var popNum = popCountyData[sex][selectCounty][year][v.minAge];
	  					if(!popNum) continue;
	  					var d = {year:v.year,cause:v.cause,county:v.county,sex:v.sex,
	  						minAge:v.minAge,maxAge:v.maxAge,
	  						count: (1000*v.count/popNum).toFixed(3)};
	  					deathData.push(d);
	  				}
	  				maxV = 2;
	  				break;
	  		}
	  		param.data = deathData;
	  		param.maxValue = maxV;
	  		param.infoFn = function(d){
				var num = g_Util.NumberWithCommas(d.count);
				var str = selectCounty+" "+d.minAge+"~"+d.maxAge+"歲 "+num+deathUnit;
				if(d.total){
					var ratio = (100*d.count/d.total).toFixed(1);
					str += " ("+ratio+"%)";
				}
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
	  		param.unit = deathUnit;
	  		param.textInfo = $("#deathRankInfo");
	  		var page = $("#deathRankPage").val();
	  		param.rankOffset = 10*page;
	  		param.rankLength = 10;
	  		param.select = selectCause;
	  		
	  		var maxV = 0;
	  		for(var y in deathCancerData[sex][selectCounty]){
	  			var yearData = deathCancerData[sex][selectCounty][y];
	  			var v = d3.max(yearData,function(d){return d.count;});
	  			if(v > maxV) maxV = v;
	  		}
	  		var deathData;
	  		switch(deathTitle){
	  			case "死亡人數":
	  				deathData = deathCancerData[sex][selectCounty][year];
	  				break;
	  			case "死亡率":
	  				deathData = [];
	  				var popNum = popSum[year][sex][selectCounty];
	  				for(var i=0;i<deathCancerData[sex][selectCounty][year].length;i++){
	  					var v = deathCancerData[sex][selectCounty][year][i];
	  					var d = {year:v.year,cause:v.cause,county:v.county,sex:v.sex,
	  						count: (1000*v.count/popNum).toFixed(3)};
	  					deathData.push(d);
	  				}
	  				maxV = (1000*maxV/popNum).toFixed(3);
	  				break;
	  		}
	  		param.data = deathData;
	  		param.maxValue = maxV;
	  		param.infoFn = function(d){
				var num = g_Util.NumberWithCommas(d.count);
				var str = d.cause+" "+num+deathUnit;
				if(d.total){
					var ratio = (100*d.count/d.total).toFixed(1);
					str += " ("+ratio+"%)";
				}
				return str;
			};
			param.clickFn = function(item){
				selectCause = item.attr("data-select");
				$("#deathAgeTitle").text(year+"年 "+selectCause+" 性別:"+sex);
				LoadPopCounty(DrawCauseAgeCancer);
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
	  	$("#deathMapTitle").text(deathTitle+" 性別:"+sex);
	  	function DrawMap(){
	  		var param = {};
	  		param.map = map;
	  		param.year = year;
	  		param.type = optionType;
	  		param.selector = "#deathMapSvg";
	  		param.minColor = "#FFFFFF";
	  		param.maxColor = "#999999";
	  		param.textInfo = $("#deathMapInfo");

	  		var deathData;
	  		switch(deathTitle){
	  			case "死亡人數":
	  				deathData = deathCancerSum[year][sex];
	  				param.minBound = deathCancerMapBound.min;
	  				param.maxBound = deathCancerMapBound.max;
	  				break;
	  			case "死亡率":
	  				deathData = {};
	  				for(var county in deathCancerSum[year][sex]){
	  					var deathNum = deathCancerSum[year][sex][county];
	  					var popNum = popSum[year][sex][county];
	  					deathData[county] = (1000*deathNum/popNum).toFixed(3);
	  				}
	  				param.minBound = 0.1;
	  				param.maxBound = 1;
	  				break;
	  		}
	  		param.data = deathData;
	  		param.unit = deathUnit;
	  		param.clickFn = function(map){
	  			selectCounty = map.GetSelectKey();
	  			$("#deathRankTitle").text(selectCounty+" 死因排序");
	  			DrawDeathRankCancer();
	  		};
	  		g_SvgGraph.MapTW(param);
	  		//DrawDeathRankCancer();
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

		  		LoadPopSum(DrawMap());

			});
		}
	};

	return {
		loadGraph: loadGraph
	}
}();