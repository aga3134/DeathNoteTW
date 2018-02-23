
var g_ChapterDisease = function(){
	var mType = "";
	var keyV = "";
	var keyUnit = "";
	var selectDisease = "";
	var medicineSumData = {};
	var medicineRatioData = {};
	var medicineAgeData = {};
	var minColor,maxColor;
	var diseaseRatioSelect = "";

	var loadGraph = function(app){
		var graphStr = "";
		switch(app.graphType){
			case 1: graphStr = "西醫門診"; break;
			case 2: graphStr = "中醫門診"; break;
			case 3: graphStr = "牙醫門診"; break;
			case 4: graphStr = "急診"; break;
			case 5: graphStr = "住院"; break;
		}
		if(graphStr != mType){
			selectDisease = "";
			mType = graphStr;
		}
		switch(app.optionType){
			case 1:
				keyV = "caseNum";
				keyUnit="件";
				maxColor = "#996666";
				minColor = "#FF9999";
				break;
			case 2:
				keyV = "expense";
				keyUnit="千點";
				maxColor = "#669966";
				minColor = "#99FF99";
				break;
		}
		MedicineStatisticRank();
	}

	var MedicineStatisticAge = function(){
		var year = $("#timeRange").val();
		var sex = $("#diseaseRankSexSelect").val();
		var selectSubDisease = $("#selectSubDiseaase").val();
		if(!medicineAgeData[mType]){
			medicineAgeData[mType] = {"全部":{},"男":{},"女":{}};
		}
		function DrawData(){
			var param = {};
	  		param.selector = "#diseaseAgeSvg";
	  		param.keyXMin = "minAge";
	  		param.keyXMax = "maxAge";
	  		param.minX = 0;
	  		param.maxX = 100;
	  		param.keyY = keyV;
	  		param.minColor = minColor;
	  		param.maxColor = maxColor;
	  		var unit = "";
			if(keyUnit == "千點") unit = "百萬點";
			else if(keyUnit == "件") unit = "千件";
	  		param.unitX = "歲";
	  		param.unitY = unit;
	  		param.textInfo = $("#diseaseAgeInfo");
	  		param.data = medicineAgeData[mType][sex][selectDisease][selectSubDisease][year];
	  		var maxV = 0;
	  		for(var y in  medicineAgeData[mType][sex][selectDisease][selectSubDisease]){
	  			var yearData = medicineAgeData[mType][sex][selectDisease][selectSubDisease][y];
	  			var v = d3.max(yearData,function(d){return d[keyV];});
	  			if(v > maxV) maxV = v;
	  		}
	  		param.maxValue = maxV;
	  		param.infoFn = function(d){
				var num = g_Util.NumberWithCommas(parseInt(d[keyV]*0.001));
				var str = selectSubDisease+" "+d.minAge+"~"+d.maxAge+"歲 "+num+unit;
				var ratio = (100*d[keyV]/d[keyV+"Total"]).toFixed(1);
				str += " ("+ratio+"%)";
				return str;
			};
			param.formatAxisY = function(d){
				return parseInt(d*0.001);
			}
	  		g_SvgGraph.Histogram(param);
		}

		if(medicineAgeData[mType][sex][selectDisease]){
			DrawData();
		}
		else{
			$.get("/medicineStatisticByAge?mType="+mType+"&sex="+sex+"&disease="+selectDisease, function(data){
				var json = JSON.parse(data);
				for(var i=0;i<json.length;i++){
					json[i].expense = parseInt(json[i].expense*0.001);
				}
				
				medicineAgeData[mType][sex][selectDisease] = d3.nest()
					.key(function(d) {return d.subDisease;})
					.key(function(d) {return d.year;})
					.rollup(function(arr){
						var caseNumTotal = d3.sum(arr,function(d){return d.caseNum;});
						var expenseTotal = d3.sum(arr,function(d){return d.expense;});
						for(var i=0;i<arr.length;i++){
							arr[i].caseNumTotal = caseNumTotal;
							arr[i].expenseTotal = expenseTotal;
						}
						return arr;
					})
					.map(json.filter(function(d){
						return !(d.minAge==0 && d.maxAge==100);
					}));

				DrawData();
			});
		}
	};

	var MedicineStatisticRank = function(){
		var year = $("#timeRange").val();
		var sex = $("#diseaseRankSexSelect").val();
		if(!medicineSumData[mType]){
			medicineSumData[mType] = {};
		}
		if(!medicineRatioData[mType]){
			medicineRatioData[mType] = {};
		}

		function DrawRatio(){
	  		param = {};
			param.selector = "#diseaseRatioSvg";
			param.textInfo = "#diseaseRatioInfo";
			param.key = "subDisease";
			param.value = keyV;
			param.data = medicineRatioData[mType][sex][year][selectDisease];
			param.inRadius = 50;
			param.infoFn = function(d){
				var num = g_Util.NumberWithCommas(d.data[keyV]);
				var str = d.data.subDisease+" "+num+keyUnit;
				var ratio = (100*d.data[keyV]/d.data[keyV+"Total"]).toFixed(1);
				str += " ("+ratio+"%)";
				return str;
			};
			param.clickFn = function(item){
				diseaseRatioSelect = item.attr("data-select");
			};
			param.select = diseaseRatioSelect;
			g_SvgGraph.PieChart(param);
		}

		function DrawData(){
			var param = {};
	  		param.selector = "#diseaseRankSvg";
	  		param.key = "disease";
	  		param.value = keyV;
	  		param.minColor = minColor;
	  		param.maxColor = maxColor;
	  		param.unit = keyUnit;
	  		param.textInfo = $("#diseaseRankInfo");
	  		var page = $("#diseaseRankPage").val();
	  		param.rankOffset = 10*page;
	  		param.rankLength = 10;
	  		param.select = selectDisease;
	  		param.data = medicineSumData[mType][sex][year];
	  		var maxV = 0;
	  		for(var y in medicineSumData[mType][sex]){
	  			var yearData = medicineSumData[mType][sex][y];
	  			var v = d3.max(yearData,function(d){return d[keyV];});
	  			if(v > maxV) maxV = v;
	  		}
	  		param.maxValue = maxV;
	  		param.infoFn = function(d){
				var num = g_Util.NumberWithCommas(d[keyV]);
				var str = d.disease+" "+num+keyUnit;
				var ratio = (100*d[keyV]/d[keyV+"Total"]).toFixed(1);
				str += " ("+ratio+"%)";
				return str;
			};
			param.clickFn = function(item){
				selectDisease = item.attr("data-select");
				$("#diseaseRatioTitle").text(selectDisease+"比例 "+sex);
				$("#diseaseAgeTitle").text(selectDisease+"年齡分佈 "+sex);
				//update subDisease option
				var select = $("#selectSubDiseaase");
				select.html("");
				var diseaseData = medicineRatioData[mType][sex][year][selectDisease];
				if(diseaseData.length > 1){
					select.append("<option value='"+selectDisease+"'>"+selectDisease+"</option>");
				}
				for(var i=0;i<diseaseData.length;i++){
					var key = diseaseData[i].subDisease;
					if(key == "其它"+selectDisease) continue;
					select.append("<option value='"+key+"'>"+key+"</option>");
				}

				DrawRatio();
				MedicineStatisticAge();
			};
	  		g_SvgGraph.SortedBar(param);
		}

		if(medicineSumData[mType][sex] && medicineRatioData[mType][sex]){
			DrawData();
		}
		else{
			$.get("/medicineStatisticByAge?sumAge=1&mType="+mType+"&sex="+sex, function(data){
				var json = JSON.parse(data);
				for(var i=0;i<json.length;i++){
					json[i].expense = parseInt(json[i].expense*0.001);
				}
				
				medicineSumData[mType][sex] = d3.nest()
					.key(function(d) {return d.year;})
					.rollup(function(arr){
						var caseNumTotal = d3.sum(arr,function(d){return d.caseNum;});
						var expenseTotal = d3.sum(arr,function(d){return d.expense;});
						for(var i=0;i<arr.length;i++){
							arr[i].caseNumTotal = caseNumTotal;
							arr[i].expenseTotal = expenseTotal;
						}
						return arr;
					})
					.map(json.filter(function(d){
						return d.disease == d.subDisease && d.disease != "總計";
					}));

				medicineRatioData[mType][sex] = d3.nest()
					.key(function(d) {return d.year;})
					.key(function(d) {return d.disease;})
					.rollup(function(arr){
						var subCaseNum = 0;
						var subExpense = 0;
						var caseNumTotal = 0;
						var expenseTotal = 0;
						var other = {};
						for(var i=0;i<arr.length;i++){
							if(arr[i].disease != arr[i].subDisease){
								subCaseNum += arr[i].caseNum;
								subExpense += arr[i].expense;
							}
							else{
								caseNumTotal = arr[i].caseNum;
								expenseTotal = arr[i].expense;
								other.year = arr[i].year;
								other.mType = mType;
								other.disease = arr[i].disease;
								other.subDisease = "其它"+arr[i].disease;
								other.minAge = arr[i].minAge;
								other.maxAge = arr[i].maxAGe;
								other.sex = sex;
							}
						}
						other.caseNum = caseNumTotal-subCaseNum;
						other.expense = expenseTotal-subExpense;
						other.caseNumTotal = caseNumTotal;
						other.expenseTotal = expenseTotal;
						for(var i=0;i<arr.length;i++){
							//只更動subDisease total，disease total從medicineSumData計算
							if(arr[i].disease == arr[i].subDisease) continue;
							arr[i].caseNumTotal = caseNumTotal;
							arr[i].expenseTotal = expenseTotal;
						}
						if(arr.length == 1){
							//複製成新的物件，避免與medicineSumData資料互相衝突
							var copy = Object.assign({}, arr[0]);
							copy.caseNumTotal = caseNumTotal;
							copy.expenseTotal = expenseTotal;
							return [copy];
						}
						else{
							arr.push(other);
							return arr.filter(function(d){return d.disease!=d.subDisease;});
						}
					})
					.map(json.filter(function(d){
						return d.disease != "總計";
					}));

				DrawData();
			});
		}
	};

	return {
		loadGraph: loadGraph,
		MedicineStatisticAge: MedicineStatisticAge
	}
}();