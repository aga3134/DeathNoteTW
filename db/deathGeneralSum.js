module.exports = function(sequelize, DataTypes) {
	return sequelize.define("DeathGeneralSum", {
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
	    count: DataTypes.INTEGER
	},
	{
		timestamps: false,
		freezeTableName: true,
	});
};