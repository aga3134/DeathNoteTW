module.exports = function(sequelize, DataTypes) {
	return sequelize.define("BirthCount", {
		year: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		county: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		minMonAge: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		maxMonAge: {
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