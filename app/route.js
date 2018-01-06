var DB = require("./db");
var version = "1.0.0";

module.exports = function(app){
	
	DB.Init();

	app.get("/", function(req, res){
		res.render("static/index.ejs", {version: version});
	});

	//==========================生之章==========================
	app.get("/populationByAge", function(req, res){
		var county = req.query.county;
		DB.PopulationByAge.findAll({where: {county:county}}).then(function(results){
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
		DB.ExpectLife.findAll({where: {}}).then(function(results){
			res.send(JSON.stringify(results));
		});
	});

	app.get("/populationProjection", function(req, res){
		DB.PopulationProjection.findAll({where: {}}).then(function(results){
			res.send(JSON.stringify(results));
		});
	});

	app.get("/projectionIndex", function(req, res){
		DB.ProjectionIndex.findAll({where: {}}).then(function(results){
			res.send(JSON.stringify(results));
		});
	});

	//==========================老之章==========================

	//==========================病之章==========================

	//==========================死之章==========================


}