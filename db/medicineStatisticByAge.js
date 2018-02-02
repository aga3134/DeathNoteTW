module.exports = function(sequelize, DataTypes) {
	return sequelize.define("MedicineStatisticByAge", {
		year: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		mType: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		disease: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		subDisease: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		sex: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		minAge: {
			type: DataTypes.FLOAT,
			primaryKey: true
		},
		maxAge: {
			type: DataTypes.FLOAT,
			primaryKey: true
		},
	    caseNum: DataTypes.FLOAT,
	    expense: DataTypes.FLOAT
	},
	{
		timestamps: false,
		freezeTableName: true,
	});
};