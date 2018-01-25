module.exports = function(sequelize, DataTypes) {
	return sequelize.define("AgingSurveyHouseType", {
		attrGroup: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		attr: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		houseType: {
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