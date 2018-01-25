
var Sequelize = require('sequelize');
var Config = require('../config');

var db = {};

db.Init = function(){
	db.sequelize = new Sequelize(Config.mysqlAuth.dbName, Config.mysqlAuth.username, Config.mysqlAuth.password,
		{host: Config.mysqlAuth.host, port: Config.mysqlAuth.port, logging: false});

	//生之章
	db.PopulationByAge = db.sequelize.import(__dirname + "./../db/populationByAge.js");
	db.MarriageByAge = db.sequelize.import(__dirname + "./../db/marriageByAge.js");
	db.BirthByCounty = db.sequelize.import(__dirname + "./../db/birthByCounty.js");
	db.BirthCount = db.sequelize.import(__dirname + "./../db/birthCount.js");
	db.FertilityRateByAge = db.sequelize.import(__dirname + "./../db/fertilityRateByAge.js");
	db.ExpectLife = db.sequelize.import(__dirname + "./../db/expectLife.js");
	db.PopulationProjection = db.sequelize.import(__dirname + "./../db/populationProjection.js");
	db.ProjectionIndex = db.sequelize.import(__dirname + "./../db/projectionIndex.js");
	//老之章
	db.AgingSurveyAge = db.sequelize.import(__dirname + "./../db/agingSurveyAge.js");
	db.AgingSurveyHouseType = db.sequelize.import(__dirname + "./../db/agingSurveyHouseType.js");
	db.AgingSurveyFamilyType = db.sequelize.import(__dirname + "./../db/agingSurveyFamilyType.js");
	db.AgingSurveyChronic = db.sequelize.import(__dirname + "./../db/agingSurveyChronic.js");
	db.AgingSurveyActivity = db.sequelize.import(__dirname + "./../db/agingSurveyActivity.js");
	db.AgingSurveyFeeling = db.sequelize.import(__dirname + "./../db/agingSurveyFeeling.js");
	db.AgingSurveyIdealLive = db.sequelize.import(__dirname + "./../db/agingSurveyIdealLive.js");
	db.AgingSurveyExpect = db.sequelize.import(__dirname + "./../db/agingSurveyExpect.js");
	db.AgingSurveyLivingDifficulty = db.sequelize.import(__dirname + "./../db/agingSurveyLivingDifficulty.js");
	db.AgingSurveyFunctionDifficulty = db.sequelize.import(__dirname + "./../db/agingSurveyFunctionDifficulty.js");

	var syncOp = {};
	syncOp.force = false;
    db.sequelize.sync(syncOp);
}

module.exports = db;
