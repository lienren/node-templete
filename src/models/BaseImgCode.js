const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BaseImgCode', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    token: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    imgCode: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    isUse: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    overTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    addTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'BaseImgCode',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
