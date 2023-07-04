const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_samps', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sampName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "采样点名称"
    },
    sampAddr: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "采样点地址"
    },
    sampTel: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "采样点电话"
    },
    sampType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "采样点类型"
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'info_samps',
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
      {
        name: "idx_sampName",
        using: "BTREE",
        fields: [
          { name: "sampName" },
        ]
      },
    ]
  });
};
