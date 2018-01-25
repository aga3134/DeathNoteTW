module.exports = function(sequelize, DataTypes) {
	return sequelize.define("AgingSurveyChronic", {
		attrGroup: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		attr: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		chronic: {
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