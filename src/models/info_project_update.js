const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_project_update', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sub_title: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "修改描述"
    },
    pro_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "项目编号"
    },
    pro_sub_verify: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "项目提交修改内容"
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    manage_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "审核人编号"
    },
    manage_user: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "审核人姓名"
    },
    manage_remark: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "审核人备注"
    },
    update_type: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "更新类型"
    }
  }, {
    sequelize,
    tableName: 'info_project_update',
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
      {
        name: "idx_sub_title",
        using: "BTREE",
        fields: [
          { name: "sub_title" },
        ]
      },
      {
        name: "idx_update_type",
        using: "BTREE",
        fields: [
          { name: "update_type" },
        ]
      },
    ]
  });
};
