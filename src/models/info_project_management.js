const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_project_management', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pro_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "项目编号"
    },
    a1: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "事件时间"
    },
    a2: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "议案"
    },
    a3: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "上会材料"
    },
    a4: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "决策文件（董事会及股东会决议）"
    },
    a5: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "备注"
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    manage_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    manage_user: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    is_del: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'info_project_management',
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
        name: "idx_pro_id",
        using: "BTREE",
        fields: [
          { name: "pro_id" },
        ]
      },
    ]
  });
};
