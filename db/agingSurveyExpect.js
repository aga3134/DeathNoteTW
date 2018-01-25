module.exports = function(sequelize, DataTypes) {
	return sequelize.define("AgingSurveyExpect", {
		attrGroup: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		attr: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		expect: {
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