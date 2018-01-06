
var Sequelize = require('sequelize');
var Config = require('../config');

var db = {};

db.Init = function(){
	db.sequelize = new Sequelize(Config.mysqlAuth.dbName, Config.mysqlAuth.username, Config.mysqlAuth.password,
		{host: Config.mysqlAuth.host, port: Config.mysqlAuth.port, logging: false});

	db.PopulationByAge = db.sequelize.import(__dirname + "./../db/populationByAge.js");
	db.MarriageByAge = db.sequelize.import(__dirname + "./../db/marriageByAge.js");
	db.BirthByCounty = db.sequelize.import(__dirname + "./../db/birthByCounty.js");
	db.BirthCount = db.sequelize.import(__dirname + "./../db/birthCount.js");
	db.FertilityRateByAge = db.sequelize.import(__dirname + "./../db/fertilityRateByAge.js");
	db.ExpectLife = db.sequelize.import(__dirname + "./../db/expectLife.js");
	db.PopulationProjection = db.sequelize.import(__dirname + "./../db/populationProjection.js");
	db.ProjectionIndex = db.sequelize.import(__dirname + "./../db/projectionIndex.js");

	var syncOp = {};
	syncOp.force = false;
    db.sequelize.sync(syncOp);
}

module.exports = db;
