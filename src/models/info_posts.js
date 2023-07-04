const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_posts', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    postName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "职业名称"
    },
    tradeType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "行业类别"
    },
    cycleType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "周期类型"
    },
    periodType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "采样周期类型"
    },
    sampWay: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "采样方式"
    },
    remark: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "备注"
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'info_posts',
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
