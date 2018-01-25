module.exports = function(sequelize, DataTypes) {
	return sequelize.define("AgingSurveyFeeling", {
		attrGroup: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		attr: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		feel: {
			type: DataTypes.STRING,
			primaryKey: true
		},
	    neverCount: DataTypes.INTEGER,
	    sometimesCount: DataTypes.INTEGER,
	    oftenCount: DataTypes.INTEGER
	},
	{
		timestamps: false,
		freezeTableName: true
	});
};