module.exports = function(sequelize, DataTypes) {
	return sequelize.define("ExpectLife", {
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
	    life: DataTypes.FLOAT,
	},
	{
		timestamps: false,
		freezeTableName: true,
	});
};