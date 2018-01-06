module.exports = function(sequelize, DataTypes) {
	return sequelize.define("FertilityRateByAge", {
		year: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		county: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		minAge: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		maxAge: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
	    rate: DataTypes.FLOAT,
	},
	{
		timestamps: false,
		freezeTableName: true,
	});
};