module.exports = function(sequelize, DataTypes) {
	return sequelize.define("AgingSurveyActivity", {
		attrGroup: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		attr: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		activity: {
			type: DataTypes.STRING,
			primaryKey: true
		},
	    mainCount: DataTypes.INTEGER,
	    secondaryCount: DataTypes.INTEGER
	},
	{
		timestamps: false,
		freezeTableName: true
	});
};