module.exports = function(sequelize, DataTypes) {
	return sequelize.define("BirthByCounty", {
		year: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		county: {
			type: DataTypes.STRING,
			primaryKey: true
		},
	    maleBirth: DataTypes.INTEGER,
	    femaleBirth: DataTypes.INTEGER,
	    maleDeath: DataTypes.INTEGER,
	    femaleDeath: DataTypes.INTEGER,
	    socialIncrease: DataTypes.INTEGER,
	    marriage: DataTypes.INTEGER,
	    divorce: DataTypes.INTEGER,
	},
	{
		timestamps: false,
		freezeTableName: true,
	});
};