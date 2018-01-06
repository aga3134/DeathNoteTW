module.exports = function(sequelize, DataTypes) {
	return sequelize.define("PopulationProjection", {
		year: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		sex: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		age: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		estimateParam: {
			type: DataTypes.STRING,
			primaryKey: true
		},
	    count: DataTypes.INTEGER,
	},
	{
		timestamps: false,
		freezeTableName: true,
	});
};