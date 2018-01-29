
var g_ChapterBirth = function(){
	var selectCounty = "總計";
	var pyramidHover = "";

	var popMapData;
	var pyramidData = {};
	var popMinBound = 0, popMaxBound = 0;
	var pyramidScale = {};
	var popRatioData = {};
	var lifeData;

	var marriageData;
	var marriageScale = {};
	var marriageStatus = "未婚";
	var marriageTimeLine;

	var birthHistData;
	var birthHistMax = {};
	var birthMapData;
	var birthMinBound = 0, birthMaxBound = 0;
	var fertilityHistData;
	var fertilityHistMax = {};
	var fertilityMapData;
	var fertilityMinBound = 0, fertilityMaxBound = 0;
	var birthTimeLine;

	var projectionData = {};
	var projectionScale = {};
	var estimateParam = "中推估";
	var projectionLife = {};
	var projectionVariety = {};
	var projectionFertility = {};
	var projectionPop = {};

	var map = new MapTW();
	
	var loadGraph = function(app){
	  	switch(app.graphType){
			case 1:	//人口分佈
	  		{
				DrawPopMap(app.subGraphType,app.optionType);
				DrawPopPyramid(app.subGraphType);
				DrawExpectLife();
	  			break;
	  		}
	  		case 2:	//婚姻狀況
		  		DrawMarriage(app.optionType);
		  		DrawMarriageTimeLine();
	  			break;
	  		case 3:	//出生統計
	  			if(app.subGraphType == 1) DrawBirthMap(app.optionType);
	  			else if(app.subGraphType == 2) DrawFertilityMap(app.optionType);
	  			DrawBirthTimeLine();
	  			break;
	  		case 4:	//人口推估
	  			if(app.optionType == 1) estimateParam = "中推估";
	  			else if(app.optionType == 2) estimateParam = "低推估";
	  			else if(app.optionType == 3) estimateParam = "高推估";
	  			DrawProjectionPyramid();
	  			DrawProjectionIndex();
	  			break;
	  	}
	};

	var DrawPopPyramid = function(type){
		var year = $("#timeRange").val();

		function DrawData(){
			switch(type){
				case 1:
					var param = {};
					param.selector = "#popPyramidSvg";
					param.textInfo = "#popPyramidInfo";
					param.data = pyramidData[selectCounty][year];
					param.pyramidScale = pyramidScale[selectCounty];
					param.hover = pyramidHover;
					param.hoverFn = function(item){
						pyramidHover = item.attr("data-hover");
					};
					g_SvgGraph.PopulationPyramid(param);
					$("#popRatio").text("");
					break;
				case 2:
					param = {};
					param.selector = "#popPyramidSvg";
					param.textInfo = "#popPyramidInfo";
					param.value = "num";
					param.data = popRatioData[selectCounty][year];
					param.inRadius = 50;
					param.infoFn = function(d){
						var num = g_Util.NumberWithCommas(d.data.num);
						return d.data.key+" "+num+"人 ("+d.data.ratio+"%)";
					};
					g_SvgGraph.PieChart(param);
					break;
			}
			var ratioData = popRatioData[selectCounty][year];
			var str = selectCounty+" 扶老比:"+(100*ratioData[2].num/ratioData[1].num).toFixed(1)+"%";
			str += " 扶幼比:"+(100*ratioData[0].num/ratioData[1].num).toFixed(1)+"%";
			$("#popRatio").text(str);
		}

		if(pyramidData[selectCounty]){
			DrawData();
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

				popRatioData[selectCounty] = d3.nest()
					.key(function(d) {return d.year;})
					.rollup(function(arr){
						var childNum = 0, adultNum = 0, elderNum = 0;
						for(var i=0;i<arr.length;i++){
							var d = arr[i];
							if(d.maxAge < 15) childNum += d.count;
							else if(d.maxAge < 65) adultNum += d.count;
							else elderNum += d.count;
						}
						var sum = childNum+adultNum+elderNum;
						return [
							{num: childNum, key:"小於15歲",ratio: (100*childNum/sum).toFixed(1)},
							{num: adultNum, key:"15~65歲", ratio: (100*adultNum/sum).toFixed(1)},
							{num: elderNum, key:"大於65歲", ratio: (100*elderNum/sum).toFixed(1)}
						];
					})
					.map(json);
				//console.log(nestGroup);
				var maxV = 0;
				for(var i=0;i<json.length;i++){
					var v = json[i].count;
					if(v > maxV) maxV = v;
				}

				pyramidScale[selectCounty] = Math.pow(2,Math.ceil(Math.log2(maxV)));
				pyramidData[selectCounty] = nestGroup;

				DrawData();
			});
		}
	};

	var DrawPopMap = function(subGraphType,optionType){
	  	var year = $("#timeRange").val();
	  	function DrawMap(){
	  		var param = {};
	  		param.map = map;
	  		param.year = year;
	  		param.type = optionType;
	  		param.selector = "#popMapSvg";
	  		param.minBound = popMinBound;
	  		param.maxBound = popMaxBound;
	  		param.minColor = "#FFFFFF";
	  		param.maxColor = "#999999";
	  		param.textInfo = $("#popMapInfo");
	  		param.data = popMapData[year];
	  		param.unit = "人";
	  		param.clickFn = function(map){
	  			selectCounty = map.GetSelectKey();
	  			if(subGraphType == 1) $("#popPyramidTitle").text(selectCounty+" 年齡分佈");
	  			else if(subGraphType == 2) $("#popPyramidTitle").text(selectCounty+" 扶養比例");
	  			DrawPopPyramid(subGraphType);	
	  		};
	  		g_SvgGraph.MapTW(param);
	  	}

	  	if(popMapData){
	  		DrawMap();
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
				popMinBound = Math.pow(2,Math.ceil(Math.log2(minV)));
				popMaxBound = Math.pow(2,Math.ceil(Math.log2(maxV)+1));	//男+女

		  		popMapData = d3.nest()
			  		.key(function(d) {return d.year;})
					.key(function(d) {return d.county;})
					.rollup(function(countyArr) {
						return d3.sum(countyArr,function(d){
							return d.count;
						}); 
					})
					.map(json);
				//console.log(popMapData);
				DrawMap();
		  	});
	  	}
	  	
	};

	var DrawExpectLife = function(){
		var year = $("#timeRange").val();

		function DrawData(){
			var yearBound = d3.extent(lifeData["男"], function(d) { return d.year; });
			var param = {};
			param.selector = "#expectLifeSvg";
			param.textInfo = "#expectLifeInfo";
			param.data = lifeData;
			param.minTime = yearBound[0];
			param.maxTime = yearBound[1];
			param.time = year;
			param.minValue = 50;
			param.maxValue = 100;
			param.axisX = "year";
			param.axisY = "life";
			param.unitY = "歲";
			param.unitX = "年";
			param.color = {"男":"#A1AFC9","女":"#F47983"};
			param.infoFn = function(d){return d.year+"年 "+d.sex+" "+d.life+"歲";};
			g_SvgGraph.TimeLine(param);

			var curMaleLife = lifeData["男"].filter(function(d){
				return d.year == year;
			})[0].life;
			var curFemaleLife = lifeData["女"].filter(function(d){
				return d.year == year;
			})[0].life;
			var curText = year+"年 男"+curMaleLife+"歲 女"+curFemaleLife+"歲";
			$("#lifeInfo").html(curText);
		}

		if(lifeData){
			DrawData();
		}
		else{
			$.get("/expectLife?age=0", function(data){
				var json = JSON.parse(data).filter(function(d){
					return d.sex=="男" || d.sex=="女";
				});
				lifeData = d3.nest()
					.key(function(d) {return d.sex;})
					.map(json);
				DrawData();
			});
		}
		
	};

	var DrawMarriage = function(optionType){
		var year = $("#timeRange").val();
		switch(optionType){
			case 1: marriageStatus = "未婚"; break;
			case 2: marriageStatus = "有偶"; break;
			case 3: marriageStatus = "離婚"; break;
			case 4: marriageStatus = "喪偶"; break;
		}

		function DrawData(){
			var param = {};
			param.selector = "#marriageSvg";
			param.textInfo = "#marriageInfo";
			param.data = marriageData[year][marriageStatus];
			param.pyramidScale = marriageScale[marriageStatus];
			param.hover = pyramidHover;
			param.hoverFn = function(item){
				pyramidHover = item.attr("data-hover");
			};
			g_SvgGraph.PopulationPyramid(param);

			param = {};
			param.selector = "#marriageRatioSvg";
			param.textInfo = "#marriageRatioInfo";
			param.select = marriageStatus;

			var minAge = parseInt($("#marriageRatioMinAge").val());
			var maxAge = parseInt($("#marriageRatioMaxAge").val());
			if(maxAge < minAge){
				var tmp = maxAge; maxAge = minAge; minAge = tmp;
				$("#marriageRatioMinAge").val(minAge)
				$("#marriageRatioMaxAge").val(maxAge);
			}
			var group = $("#marriageRatioSelect").val();
			var ratioData = [];
			var totalNum = 0;
			for(var key in marriageData[year]){
				if(key == "總計") continue;
				var maleData = marriageData[year][key]["男"];
				var femaleData = marriageData[year][key]["女"];
				var sum = 0;
				for(var i=0;i<maleData.length;i++){
					if(maleData[i].minAge < minAge || maleData[i].minAge > maxAge) continue;
					if(group == "male") sum += maleData[i].count;
					else if(group == "female") sum += femaleData[i].count;
					else if(group == "total") sum += maleData[i].count+femaleData[i].count;
				}
				ratioData.push({key:key,num:sum});
				totalNum += sum;
			}
			for(var i=0;i<ratioData.length;i++){
				ratioData[i].ratio = (100*(ratioData[i].num/totalNum)).toFixed(1);
			}
			param.value = "num";
			param.data = ratioData;
			param.inRadius = 50;
			param.infoFn = function(d){
				var num = g_Util.NumberWithCommas(d.data.num);
				return d.data.key+" "+num+"人 ("+d.data.ratio+"%)";
			};
			g_SvgGraph.PieChart(param);
		}

		if(marriageData){
			DrawData();
		}
		else{
			$.get("/marriageByAge", function(data){
				var json = JSON.parse(data);
				marriageData = d3.nest()
					.key(function(d) {return d.year;})
					.key(function(d) {return d.status;})				
					.key(function(d) {return d.sex;})
					.map(json);

				var maxV = {};
				for(var i=0;i<json.length;i++){
					var status = json[i].status;
					var v = json[i].count;
					if(status in maxV){
						if(v > maxV[status]){
							maxV[status] = v;
						}
					}
					else{
						maxV[status] = v;
					}
				}
				for(var status in maxV){
					marriageScale[status] = Math.pow(2,Math.ceil(Math.log2(maxV[status])));
				}
				DrawData();
			});
		}
	};

	var DrawMarriageTimeLine = function(){
		var year = $("#timeRange").val();

		function DrawData(){
			var minY = 1e10, maxY = 0;
			var minC = 1e10, maxC = 0;
			for(var key in marriageTimeLine[selectCounty]){
				var keyData = marriageTimeLine[selectCounty][key];
				for(var i=0;i<keyData.length;i++){
					var v = keyData[i];
					if(v.year < minY) minY = v.year;
					if(v.year > maxY) maxY = v.year;
					if(v.count < minC) minC = v.count;
					if(v.count > maxC) maxC = v.count;
				}
			}
			var param = {};
			param.selector = "#marriageTimeLineSvg";
			param.textInfo = "#marriageTimeLineInfo";
			param.data = marriageTimeLine[selectCounty];
			param.minTime = minY;
			param.maxTime = maxY;
			param.time = year;
			param.minValue = Math.min(0,minC);
			param.maxValue = maxC;
			param.axisX = "year";
			param.axisY = "count";
			param.unitY = "對";
			param.unitX = "年";
			param.padL = 70;
			param.alignZero = true;
			var color = g_Util.ColorCategory(2);
			param.color = {"結婚對數":color(0),"離婚對數":color(1)};
			param.infoFn = function(d){
				var num = g_Util.NumberWithCommas(d.count);
				return selectCounty+" "+d.year+"年 "+d.key+" "+num+"人";
			};
			g_SvgGraph.TimeLine(param);
		}

		if(marriageTimeLine){
			DrawData();
		}
		else{
			$.get("/birthByCounty", function(data){
				var json = JSON.parse(data);
				marriageTimeLine = d3.nest()
					.key(function(d) {return d.county;})
					.rollup(function(arr){
						var output = {};
						output["結婚對數"] = [];
						output["離婚對數"] = [];
						for(var i=0;i<arr.length;i++){
							var d = arr[i];
							output["結婚對數"].push({year:d.year,count:d.marriage,key:"結婚對數"});
							output["離婚對數"].push({year:d.year,count:d.divorce,key:"離婚對數"});
						}
						return output;
					})
					.map(json);
				DrawData();
			});
		}
	};

	var DrawBirthMap = function(type){
	  	var year = $("#timeRange").val();

	  	function DrawBirthHistogram(){
			if(!birthHistData) return;
			var year = $("#timeRange").val();
		  	
	  		var param = {};
	  		param.selector = "#birthHistSvg";
	  		param.minX = 0;
	  		param.maxX = 50;
	  		param.keyXMin = "minMonAge";
	  		param.keyXMax = "maxMonAge";
	  		param.keyY = "count";
	  		param.maxValue = birthHistMax[selectCounty];
	  		param.minColor = "#FF9999";
	  		param.maxColor = "#996666";
	  		param.unitY = "人";
	  		param.unitX = "歲";
	  		param.textInfo = $("#birthHistInfo");
	  		param.titleInfo = $("#birthHistTitle");
	  		param.data = birthHistData[year][selectCounty];
	  		param.infoFn = function(d){
				var num = g_Util.NumberWithCommas(d.count);
				return "生母"+d.minMonAge+"~"+d.maxMonAge+"歲 "+num+"人";
			};
	  		g_SvgGraph.Histogram(param);
		};

	  	function DrawMap(){
	  		var param = {};
	  		param.map = map;
	  		param.year = year;
	  		param.type = type;
	  		param.selector = "#birthMapSvg";
	  		param.minBound = birthMinBound;
	  		param.maxBound = birthMaxBound;
	  		param.minColor = "#FFFFFF";
	  		param.maxColor = "#999999";
	  		param.textInfo = $("#birthMapInfo");
	  		param.data = birthMapData[year];
	  		param.unit = "人";
	  		param.clickFn = function(map){
	  			selectCounty = map.GetSelectKey();
	  			$("#birthHistTitle").text(selectCounty+" 生母年齡");
	  			$("#birthTimeLineTitle").text(selectCounty+" 人口變化");
	  			DrawBirthHistogram();
	  			DrawBirthTimeLine();
	  		};
	  		g_SvgGraph.MapTW(param);

	  		DrawBirthHistogram();
	  	}

	  	if(birthMapData){
	  		DrawMap();
	  	}
	  	else{
	  		$.get("/birthCount", function(data){
		  		var json = JSON.parse(data);

		  		birthHistData = d3.nest()
			  		.key(function(d) {return d.year;})
					.key(function(d) {return d.county;})
					.map(json);
				//sum up county data
				for(var y in birthHistData){
					var yearData = birthHistData[y];
					var sum = [];
					for(var county in yearData){
						var countyData = yearData[county];
						if(sum.length == 0){
							for(var i=0;i<countyData.length;i++){
								var d = countyData[i];
								sum.push({
									year: d.year,
									county: "總計",
									minMonAge: d.minMonAge,
									maxMonAge: d.maxMonAge,
									count: d.count
								});
							}
						}
						else{
							for(var i=0;i<countyData.length;i++){
								var d = countyData[i];
								sum[i].count += d.count;
							}
						}
					}
					yearData["總計"] = sum;
				}
				//compute histogram height scale
				for(var y in birthHistData){
					var yearData = birthHistData[y];
					for(var county in yearData){
						var countyData = yearData[county];
						if(!(county in birthHistMax)){
							birthHistMax[county] = 0;
						}
						for(var i=0;i<countyData.length;i++){
							if(countyData[i].count > birthHistMax[county]){
								birthHistMax[county] = countyData[i].count;
							}
						}
					}
				}

		  		birthMapData = d3.nest()
			  		.key(function(d) {return d.year;})
					.key(function(d) {return d.county;})
					.rollup(function(countyArr) {
						return d3.sum(countyArr,function(d){
							return d.count;
						}); 
					})
					.map(json);

				var minV = 1e10,maxV = 0;
				for(var y in birthMapData){
					var yearData = birthMapData[y];
					for(var county in yearData){
						var v = yearData[county];
						if(v <= 0) continue;
						if(v > maxV) maxV = v;
						if(v < minV) minV = v;
					}
				}
				birthMinBound = Math.pow(2,Math.ceil(Math.log2(minV)));
				birthMaxBound = Math.pow(2,Math.ceil(Math.log2(maxV)));

				for(var y in birthMapData){
					var yearData = birthMapData[y];
					var total = 0;
					for(var county in yearData){
						total += yearData[county];
					}
					yearData["總計"] = total;
				}
				//console.log(birthMapData);
				DrawMap();
		  	});
	  	}
	};

	var DrawFertilityMap = function(type){
	  	var year = $("#timeRange").val();

	  	function DrawFertilityHistogram(){
			if(!fertilityHistData) return;
			var year = $("#timeRange").val();
		  	
	  		var param = {};
	  		param.selector = "#birthHistSvg";
	  		param.minX = 0;
	  		param.maxX = 50;
	  		param.keyXMin = "minAge";
	  		param.keyXMax = "maxAge";
	  		param.keyY = "rate";
	  		param.maxValue = fertilityHistMax[selectCounty];
	  		param.minColor = "#99FF99";
	  		param.maxColor = "#669966";
	  		param.unitY = "‰";
	  		param.unitX = "歲";
	  		param.textInfo = $("#birthHistInfo");
	  		param.titleInfo = $("#birthHistTitle");
	  		param.data = fertilityHistData[year][selectCounty];
	  		param.infoFn = function(d){
				return "生母"+d.minAge+"~"+d.maxAge+"歲 生育率"+d.rate+"‰";
			};
	  		g_SvgGraph.Histogram(param);
		};

	  	function DrawMap(){
	  		var param = {};
	  		param.map = map;
	  		param.year = year;
	  		param.type = type;
	  		param.selector = "#birthMapSvg";
	  		param.minBound = fertilityMinBound;
	  		param.maxBound = fertilityMaxBound;
	  		param.minColor = "#cccccc";
	  		param.maxColor = "#888888";
	  		param.textInfo = $("#birthMapInfo");
	  		param.titleInfo = $("#birthHistpTitle");
	  		param.data = fertilityMapData[year];
	  		param.unit = "‰(總生育率)";
	  		param.clickFn = function(map){
	  			selectCounty = map.GetSelectKey();
	  			$("#birthHistTitle").text(selectCounty+" 生育率");
	  			$("#birthTimeLineTitle").text(selectCounty+" 人口變化");
	  			DrawFertilityHistogram();
	  			DrawBirthTimeLine();
	  		};
	  		g_SvgGraph.MapTW(param);

	  		DrawFertilityHistogram();
	  	}

	  	if(fertilityMapData){
	  		DrawMap();
	  	}
	  	else{
	  		$.get("/fertilityRateByAge", function(data){
		  		var json = JSON.parse(data);

		  		fertilityHistData = d3.nest()
			  		.key(function(d) {return d.year;})
					.key(function(d) {return d.county;})
					.map(json);
				
				//compute histogram height scale
				for(var y in fertilityHistData){
					var yearData = fertilityHistData[y];
					for(var county in yearData){
						var countyData = yearData[county];
						if(!(county in fertilityHistMax)){
							fertilityHistMax[county] = 0;
						}
						for(var i=0;i<countyData.length;i++){
							if(countyData[i].rate > fertilityHistMax[county]){
								fertilityHistMax[county] = countyData[i].rate;
							}
						}
					}
				}

		  		fertilityMapData = d3.nest()
			  		.key(function(d) {return d.year;})
					.key(function(d) {return d.county;})
					.rollup(function(countyArr) {
						return d3.sum(countyArr,function(d){
							return (d.rate*(d.maxAge-d.minAge+1)).toFixed(1);
						}); 
					})
					.map(json);

				var minV = 1e10,maxV = 0;
				for(var y in fertilityMapData){
					var yearData = fertilityMapData[y];
					for(var county in yearData){
						var v = yearData[county];
						if(v <= 0) continue;
						if(v > maxV) maxV = v;
						if(v < minV) minV = v;
					}
				}
				fertilityMinBound = Math.pow(2,Math.ceil(Math.log2(minV)));
				fertilityMaxBound = Math.pow(2,Math.ceil(Math.log2(maxV)));
				//console.log(birthMapData);
				DrawMap();
		  	});
	  	}
	};

	var DrawBirthTimeLine = function(){
		var year = $("#timeRange").val();

		function DrawData(){
			var minY = 1e10, maxY = 0;
			var minC = 1e10, maxC = 0;
			for(var key in birthTimeLine[selectCounty]){
				var keyData = birthTimeLine[selectCounty][key];
				for(var i=0;i<keyData.length;i++){
					var v = keyData[i];
					if(v.year < minY) minY = v.year;
					if(v.year > maxY) maxY = v.year;
					if(v.count < minC) minC = v.count;
					if(v.count > maxC) maxC = v.count;
				}
			}
			var param = {};
			param.selector = "#birthTimeLineSvg";
			param.textInfo = "#birthTimeLineInfo";
			param.data = birthTimeLine[selectCounty];
			param.minTime = minY;
			param.maxTime = maxY;
			param.time = year;
			param.minValue = Math.min(0,minC);
			param.maxValue = maxC;
			param.axisX = "year";
			param.axisY = "count";
			param.unitY = "人";
			param.unitX = "年";
			param.padL = 70;
			param.alignZero = true;
			var color = g_Util.ColorCategory(7);
			param.color = {"男出生數":color(0),"女出生數":color(1),
							"男死亡數":color(2),"女死亡數":color(3),"社會增加數":color(4)};
			param.infoFn = function(d){
				var num = g_Util.NumberWithCommas(d.count);
				return selectCounty+" "+d.year+"年 "+d.key+" "+num+"人";
			};
			g_SvgGraph.TimeLine(param);
		}

		if(birthTimeLine){
			DrawData();
		}
		else{
			$.get("/birthByCounty", function(data){
				var json = JSON.parse(data);
				birthTimeLine = d3.nest()
					.key(function(d) {return d.county;})
					.rollup(function(arr){
						var output = {};
						output["男出生數"] = [];
						output["女出生數"] = [];
						output["男死亡數"] = [];
						output["女死亡數"] = [];
						output["社會增加數"] = [];
						for(var i=0;i<arr.length;i++){
							var d = arr[i];
							output["男出生數"].push({year:d.year,count:d.maleBirth,key:"男出生數"});
							output["女出生數"].push({year:d.year,count:d.femaleBirth,key:"女出生數"});
							output["男死亡數"].push({year:d.year,count:d.maleDeath,key:"男死亡數"});
							output["女死亡數"].push({year:d.year,count:d.femaleDeath,key:"女死亡數"});
							output["社會增加數"].push({year:d.year,count:d.socialIncrease,key:"社會增加數"});
						}
						return output;
					})
					.map(json);
				DrawData();
			});
		}
	};

	var DrawProjectionPyramid = function(){
		var year = $("#timeRange").val();

		function DrawData(){
			var param = {};
			param.selector = "#projectionPyramidSvg";
			param.textInfo = "#projectionPyramidInfo";
			param.data = projectionData[estimateParam][year];
			param.pyramidScale = projectionScale[estimateParam];
			param.hover = pyramidHover;
			param.hoverFn = function(item){
				pyramidHover = item.attr("data-hover");
			};
			g_SvgGraph.PopulationPyramid(param);
		}

		if(projectionData[estimateParam]){
			DrawData();
		}
		else{
			$.get("/populationProjection?estimateParam="+estimateParam, function(data){
				var json = JSON.parse(data);
				var nestGroup = d3.nest()
					.key(function(d) {return d.year;})
					.key(function(d) {return d.sex;})
					.rollup(function(arr){
						for(var i=0;i<arr.length;i++){
							arr[i].minAge = arr[i].maxAge = arr[i].age;
						}
						return arr;
					})
					.map(json);
				//console.log(nestGroup);
				var maxV = 0;
				for(var i=0;i<json.length;i++){
					var v = json[i].count;
					if(v > maxV) maxV = v;
				}

				projectionScale[estimateParam] = Math.pow(2,Math.ceil(Math.log2(maxV)));
				projectionData[estimateParam] = nestGroup;

				DrawData();
			});
		}
	};

	var DrawProjectionIndex = function(){
		var year = $("#timeRange").val();
		function DrawData(){
			var slider = $("#timeRange");
	        var minY = slider.attr("min");
	        var maxY = slider.attr("max");
	        var select = $("#projectionTimeLineSelect").val();
	        switch(select){
	        	case "popNum":
					var minP = 1e10, maxP = 0;
					for(var key in projectionPop[estimateParam]){
						var keyData = projectionPop[estimateParam][key];
						for(var i=0;i<keyData.length;i++){
							var v = keyData[i];
							if(v.count < minP) minP = v.count;
							if(v.count > maxP) maxP = v.count;
						}
					}
					var param = {};
					param.selector = "#projectionTimeLineSvg";
					param.textInfo = "#projectionTimeLineInfo";
					param.data = projectionPop[estimateParam];
					param.minTime = minY;
					param.maxTime = maxY;
					param.time = year;
					param.minValue = 0;
					param.maxValue = 25000;
					param.padL = 50;
					param.axisX = "year";
					param.axisY = "count";
					param.unitY = "千人";
					param.unitX = "年";
					param.color = {"男":"#A1AFC9","女":"#F47983","總計":"#79F483"};
					param.infoFn = function(d){
						var num = g_Util.NumberWithCommas(d.count);
						return d.year+"年 "+d.key+" "+num+"千人";
					};
					g_SvgGraph.TimeLine(param);
	        		break;
	        	case "life":
					var param = {};
					param.selector = "#projectionTimeLineSvg";
					param.textInfo = "#projectionTimeLineInfo";
					param.data = projectionLife[estimateParam];
					param.minTime = minY;
					param.maxTime = maxY;
					param.time = year;
					param.minValue = 50;
					param.maxValue = 100;
					param.axisX = "year";
					param.axisY = "life";
					param.unitY = "歲";
					param.unitX = "年";
					param.color = {"男":"#A1AFC9","女":"#F47983"};
					param.infoFn = function(d){
						return d.year+"年 "+d.key+" "+d.life+"歲";
					};
					g_SvgGraph.TimeLine(param);
	        		break;
	        	case "popVariety":
	        		var minV = 1e10, maxV = 0;
						for(var key in projectionVariety[estimateParam]){
							var keyData = projectionVariety[estimateParam][key];
							for(var i=0;i<keyData.length;i++){
								var v = keyData[i];
								if(v.count < minV) minV = v.count;
								if(v.count > maxV) maxV = v.count;
							}
						}
						var param = {};
						param.selector = "#projectionTimeLineSvg";
						param.textInfo = "#projectionTimeLineInfo";
						param.data = projectionVariety[estimateParam];
						param.minTime = minY;
						param.maxTime = maxY;
						param.time = year;
						param.minValue = 0;
						param.maxValue = maxV;
						param.axisX = "year";
						param.axisY = "count";
						param.unitY = "千人";
						param.unitX = "年";
						var color = g_Util.ColorCategory(3);
						param.color = {"出生數":color(0),"死亡數":color(1),"社會增加數":color(2)};
						param.infoFn = function(d){
							var num = g_Util.NumberWithCommas(d.count);
							return d.year+"年 "+d.key+" "+num+"千人";
						};
						g_SvgGraph.TimeLine(param);
	        		break;
	        	case "fertility":
	        		var minR = 1e10, maxR = 0;
					for(var key in projectionFertility[estimateParam]){
						var keyData = projectionFertility[estimateParam][key];
						for(var i=0;i<keyData.length;i++){
							var v = keyData[i];
							if(v.rate < minR) minR = v.rate;
							if(v.rate > maxR) maxR = v.rate;
						}
					}
					var param = {};
					param.selector = "#projectionTimeLineSvg";
					param.textInfo = "#projectionTimeLineInfo";
					param.data = projectionFertility[estimateParam];
					param.minTime = minY;
					param.maxTime = maxY;
					param.time = year;
					param.minValue = minR;
					param.maxValue = maxR;
					param.padL = 50;
					param.axisX = "year";
					param.axisY = "rate";
					param.unitY = "人";
					param.unitX = "年";
					var color = g_Util.ColorCategory(1);
					param.color = {"總生育率":color(0)};
					param.infoFn = function(d){
						return d.year+"年 "+d.key+" "+d.rate+"人";
					};
					g_SvgGraph.TimeLine(param);
	        		break;
	        }
		}

		if(projectionLife[estimateParam] && 
			projectionVariety[estimateParam] && 
			projectionFertility[estimateParam]){
			DrawData();
		}
		else{
			$.get("/projectionIndex?estimateParam="+estimateParam, function(data){
				var json = JSON.parse(data);
				projectionPop[estimateParam] = d3.nest()
					.rollup(function(arr){
						var output = {};
						output["男"] = [];
						output["女"] = [];
						output["總計"] = [];
						for(var i=0;i<arr.length;i++){
							var d = arr[i];
							output["男"].push({year:d.year,count:d.maleCount,key:"男"});
							output["女"].push({year:d.year,count:d.femaleCount,key:"女"});
							output["總計"].push({year:d.year,count:(d.maleCount+d.femaleCount),key:"總計"});
						}
						return output;
					})
					.map(json);
				projectionLife[estimateParam] = d3.nest()
					.rollup(function(arr){
						var output = {};
						output["男"] = [];
						output["女"] = [];
						for(var i=0;i<arr.length;i++){
							var d = arr[i];
							output["男"].push({year:d.year,life:d.maleLife,key:"男"});
							output["女"].push({year:d.year,life:d.femaleLife,key:"女"});
						}
						return output;
					})
					.map(json);
				projectionVariety[estimateParam] = d3.nest()
					.rollup(function(arr){
						var output = {};
						output["出生數"] = [];
						output["死亡數"] = [];
						output["社會增加數"] = [];
						for(var i=0;i<arr.length;i++){
							var d = arr[i];
							output["出生數"].push({year:d.year,count:d.birthCount,key:"出生數"});
							output["死亡數"].push({year:d.year,count:d.deathCount,key:"死亡數"});
							output["社會增加數"].push({year:d.year,count:d.socialIncrease,key:"社會增加數"});
						}
						return output;
					})
					.map(json);
				projectionFertility[estimateParam] = d3.nest()
					.rollup(function(arr){
						var output = {};
						output["總生育率"] = [];
						for(var i=0;i<arr.length;i++){
							var d = arr[i];
							output["總生育率"].push({year:d.year,rate:d.totalFertilityRate,key:"總生育率"});
						}
						return output;
					})
					.map(json);
				DrawData();
			});
		}
	};

	return {
		loadGraph: loadGraph
	};
}();