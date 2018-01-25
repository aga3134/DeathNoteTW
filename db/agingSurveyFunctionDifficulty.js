module.exports = function(sequelize, DataTypes) {
	return sequelize.define("AgingSurveyFunctionDifficulty", {
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
	    noNeedCount: DataTypes.INTEGER,
	    canCount: DataTypes.INTEGER,
	    diffcultCount: DataTypes.INTEGER,
	    canNotCount: DataTypes.INTEGER
	},
	{
		timestamps: false,
		freezeTableName: true
	});
};