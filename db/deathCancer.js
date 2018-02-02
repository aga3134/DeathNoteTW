module.exports = function(sequelize, DataTypes) {
	return sequelize.define("DeathCancer", {
		year: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		county: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		cause: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		ageCode: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		sex: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		minAge: DataTypes.FLOAT,
		maxAge: DataTypes.FLOAT,
	    count: DataTypes.INTEGER
	},
	{
		timestamps: false,
		freezeTableName: true,
	});
};