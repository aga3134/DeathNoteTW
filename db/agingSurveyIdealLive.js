module.exports = function(sequelize, DataTypes) {
	return sequelize.define("AgingSurveyIdealLive", {
		attrGroup: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		attr: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		liveType: {
			type: DataTypes.STRING,
			primaryKey: true
		},
	    count: DataTypes.INTEGER
	},
	{
		timestamps: false,
		freezeTableName: true
	});
};