const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_model_nums', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    modelNum: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "车牌号"
    },
    modelCode: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "车牌码"
    },
    isOver: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "是否使用(0未使用,1已使用)"
    },
    overTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "使用时间"
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'info_model_nums',
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
        name: "idx_modelNum",
        using: "BTREE",
        fields: [
          { name: "modelNum" },
        ]
      },
      {
        name: "idx_modelCode",
        using: "BTREE",
        fields: [
          { name: "modelCode" },
        ]
      },
      {
        name: "idx_isOver",
        using: "BTREE",
        fields: [
          { name: "isOver" },
        ]
      },
    ]
  });
};
