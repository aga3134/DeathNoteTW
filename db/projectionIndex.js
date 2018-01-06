module.exports = function(sequelize, DataTypes) {
	return sequelize.define("ProjectionIndex", {
		year: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		estimateParam: {
			type: DataTypes.STRING,
			primaryKey: true
		},
	    maleCount: DataTypes.INTEGER,
	    femaleCount: DataTypes.INTEGER,
	    maleLife: DataTypes.FLOAT,
	    femaleLife: DataTypes.FLOAT,
	    totalFertilityRate: DataTypes.FLOAT,
	    birthCount: DataTypes.INTEGER,
	    deathCount: DataTypes.INTEGER,
	    socialIncrease: DataTypes.INTEGER,
	},
	{
		timestamps: false,
		freezeTableName: true,
	});
};