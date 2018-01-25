module.exports = function(sequelize, DataTypes) {
	return sequelize.define("AgingSurveyLivingDifficulty", {
		attrGroup: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		attr: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		difficulty: {
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