module.exports = function(sequelize, DataTypes) {
	return sequelize.define("PopulationByAge", {
		year: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		county: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		sex: {
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
	    count: DataTypes.INTEGER,
	},
	{
		timestamps: false,
		freezeTableName: true,
	});
};