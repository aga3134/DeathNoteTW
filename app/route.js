var DB = require("./db");
var version = "1.0.1";

module.exports = function(app){
	
	DB.Init();

	app.get("/", function(req, res){
		res.render("static/index.ejs", {version: version});
	});

	//==========================生之章==========================
	app.get("/populationByAge", function(req, res){
		var county = req.query.county;
		var year = req.query.year;
		var sum = req.query.sum;
		var query = {};
		if(county) query.county = county;
		if(year) query.year = year;
		if(sum == 1){
			query.minAge = 0;
			query.maxAge = 100;
		}
		DB.PopulationByAge.findAll({where: query}).then(function(results){
			res.send(JSON.stringify(results));
		});
	});

	app.get("/marriageByAge", function(req, res){
		DB.MarriageByAge.findAll({where: {}}).then(function(results){
			res.send(JSON.stringify(results));
		});
	});

	app.get("/birthByCounty", function(req, res){
		DB.BirthByCounty.findAll({where: {}}).then(function(results){
			res.send(JSON.stringify(results));
		});
	});

	app.get("/birthCount", function(req, res){
		DB.BirthCount.findAll({where: {}}).then(function(results){
			res.send(JSON.stringify(results));
		});
	});

	app.get("/fertilityRateByAge", function(req, res){
		DB.FertilityRateByAge.findAll({where: {}}).then(function(results){
			res.send(JSON.stringify(results));
		});
	});

	app.get("/expectLife", function(req, res){
		var age = req.query.age;
		var year = req.query.year;
		var query = {};
		if(age) query.age = age;
		if(year) query.year = year;
		DB.ExpectLife.findAll({where: query}).then(function(results){
			res.send(JSON.stringify(results));
		});
	});

	app.get("/populationProjection", function(req, res){
		var estimateParam = req.query.estimateParam;
		var query = {};
		if(estimateParam) query.estimateParam = estimateParam;

		DB.PopulationProjection.findAll({where: query}).then(function(results){
			res.send(JSON.stringify(results));
		});
	});

	app.get("/projectionIndex", function(req, res){
		var estimateParam = req.query.estimateParam;
		var query = {};
		if(estimateParam) query.estimateParam = estimateParam;
		DB.ProjectionIndex.findAll({where: query}).then(function(results){
			res.send(JSON.stringify(results));
		});
	});

	//==========================老之章==========================
	app.get("/agingSurveyHouseType", function(req, res){
		var attrGroup = req.query.attrGroup;
		var sum = req.query.sum;
		var query = {};
		if(attrGroup) query.attrGroup = attrGroup;
		DB.AgingSurveyHouseType.findAll({where: query}).then(function(results){
			res.send(JSON.stringify(results));
		});
	});

	app.get("/agingSurveyFamilyType", function(req, res){
		var attrGroup = req.query.attrGroup;
		var sum = req.query.sum;
		var query = {};
		if(attrGroup) query.attrGroup = attrGroup;
		DB.AgingSurveyFamilyType.findAll({where: query}).then(function(results){
			res.send(JSON.stringify(results));
		});
	});

	app.get("/agingSurveyChronic", function(req, res){
		var attrGroup = req.query.attrGroup;
		var sum = req.query.sum;
		var query = {};
		if(attrGroup) query.attrGroup = attrGroup;
		DB.AgingSurveyChronic.findAll({where: query}).then(function(results){
			res.send(JSON.stringify(results));
		});
	});

	app.get("/agingSurveyActivity", function(req, res){
		var attrGroup = req.query.attrGroup;
		var sum = req.query.sum;
		var query = {};
		if(attrGroup) query.attrGroup = attrGroup;
		DB.AgingSurveyActivity.findAll({where: query}).then(function(results){
			res.send(JSON.stringify(results));
		});
	});

	app.get("/agingSurveyFeeling", function(req, res){
		var attrGroup = req.query.attrGroup;
		var sum = req.query.sum;
		var query = {};
		if(attrGroup) query.attrGroup = attrGroup;
		DB.AgingSurveyFeeling.findAll({where: query}).then(function(results){
			res.send(JSON.stringify(results));
		});
	});

	app.get("/agingSurveyIdealLive", function(req, res){
		var attrGroup = req.query.attrGroup;
		var sum = req.query.sum;
		var query = {};
		if(attrGroup) query.attrGroup = attrGroup;
		DB.AgingSurveyIdealLive.findAll({where: query}).then(function(results){
			res.send(JSON.stringify(results));
		});
	});

	app.get("/agingSurveyExpect", function(req, res){
		var attrGroup = req.query.attrGroup;
		var sum = req.query.sum;
		var query = {};
		if(attrGroup) query.attrGroup = attrGroup;
		DB.AgingSurveyExpect.findAll({where: query}).then(function(results){
			res.send(JSON.stringify(results));
		});
	});

	app.get("/agingSurveyLivingDifficulty", function(req, res){
		var attrGroup = req.query.attrGroup;
		var sum = req.query.sum;
		var query = {};
		if(attrGroup) query.attrGroup = attrGroup;
		DB.AgingSurveyLivingDifficulty.findAll({where: query}).then(function(results){
			res.send(JSON.stringify(results));
		});
	});

	app.get("/agingSurveyFunctionDifficulty", function(req, res){
		var attrGroup = req.query.attrGroup;
		var sum = req.query.sum;
		var query = {};
		if(attrGroup) query.attrGroup = attrGroup;
		DB.AgingSurveyFunctionDifficulty.findAll({where: query}).then(function(results){
			res.send(JSON.stringify(results));
		});
	});

	//==========================病之章==========================
	app.get("/medicineStatisticByAge", function(req, res){
		var mType = req.query.mType;
		var sex = req.query.sex;
		var disease = req.query.disease;
		var sumAge = req.query.sumAge;
		var query = {};
		if(mType) query.mType = mType;
		if(sex) query.sex = sex;
		if(disease) query.disease = disease;
		if(sumAge == '1'){
			query.minAge = 0;
			query.maxAge = 100;
		}
		DB.MedicineStatisticByAge.findAll({where: query})
		.then(function(results){
			res.send(JSON.stringify(results));
		});

	});

	//==========================死之章==========================
	app.get("/deathGeneral", function(req, res){
		var county = req.query.county;
		var cause = req.query.cause;
		var sex = req.query.sex;
		var ageType = req.query.ageType;
		var sumAge = req.query.sumAge;

		var query = {};
		if(county) query.county = county;
		if(cause) query.cause = cause;
		if(sex) query.sex = sex;
		if(ageType){
			switch(ageType){
				case '1': 	//小於4歲
					query.ageCode = ['01','02','03','04','05','06'];
					break;
				case '2': 	//5~14歲
					query.ageCode = ['07','08'];
					break;
				case '3': 	//15~64歲
					query.ageCode = ['09','10','11','12','13','14','15','16','17','18'];
					break;
				case '4': 	//64歲以上
					query.ageCode = ['19','20','21','22','23','24','25','26'];
					break;
			}
		}
		var groupArr = ['year','county','sex','cause'];
		var attrArr = ['year','county','sex','cause',[DB.sequelize.fn('sum', DB.sequelize.col('count')),'count']];
		if(sumAge != '1'){
			groupArr.push('ageCode');
			groupArr.push('minAge');
			groupArr.push('maxAge');
			attrArr.push('ageCode');
			attrArr.push('minAge');
			attrArr.push('maxAge');
		}
		
		DB.DeathGeneral.findAll({where: query, group: groupArr, attributes: attrArr})
		.then(function(results){
			res.send(JSON.stringify(results));
		});
		
	});

	app.get("/deathCancer", function(req, res){
		var county = req.query.county;
		var cause = req.query.cause;
		var sex = req.query.sex;
		var ageType = req.query.ageType;
		var sumAge = req.query.sumAge;
		var query = {};
		if(county) query.county = county;
		if(cause) query.cause = cause;
		if(sex) query.sex = sex;
		if(ageType){
			switch(ageType){
				case '1': 	//小於4歲
					query.ageCode = ['01','02','03','04','05','06'];
					break;
				case '2': 	//5~14歲
					query.ageCode = ['07','08'];
					break;
				case '3': 	//15~64歲
					query.ageCode = ['09','10','11','12','13','14','15','16','17','18'];
					break;
				case '4': 	//64歲以上
					query.ageCode = ['19','20','21','22','23','24','25','26'];
					break;
			}
		}
		var groupArr = ['year','county','sex','cause'];
		var attrArr = ['year','county','sex','cause',[DB.sequelize.fn('sum', DB.sequelize.col('count')),'count']];
		if(sumAge != '1'){
			groupArr.push('ageCode');
			groupArr.push('minAge');
			groupArr.push('maxAge');
			attrArr.push('ageCode');
			attrArr.push('minAge');
			attrArr.push('maxAge');
		}
		
		DB.DeathCancer.findAll({where: query, group: groupArr, attributes: attrArr})
		.then(function(results){
			res.send(JSON.stringify(results));
		});
	});

	app.get("/deathGeneralSum", function(req, res){
		var county = req.query.county;
		var query = {};
		if(county) query.county = county;
		DB.DeathGeneralSum.findAll({where: query}).then(function(results){
			res.send(JSON.stringify(results));
		});
	});

	app.get("/deathCancerSum", function(req, res){
		var county = req.query.county;
		var query = {};
		if(county) query.county = county;
		DB.DeathCancerSum.findAll({where: query}).then(function(results){
			res.send(JSON.stringify(results));
		});
	});

}