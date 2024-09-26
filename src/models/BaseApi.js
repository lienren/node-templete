const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BaseApi', {
    apiUrl: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      primaryKey: true
    },
    apiName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    apiShortName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    activeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    apiType: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isAuth: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    addTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'BaseApi',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "apiUrl" },
        ]
      },
    ]
  });
};
