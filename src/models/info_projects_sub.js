const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_projects_sub', {
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
      type: DataTypes.DECIMAL(12,4),
      allowNull: true,
      comment: "累计投资额"
    },
    a2: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "年末年份"
    },
    a3: {
      type: DataTypes.DECIMAL(12,4),
      allowNull: true,
      comment: "年末账面投资余额"
    },
    a40: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "年份"
    },
    a4: {
      type: DataTypes.DECIMAL(12,4),
      allowNull: true,
      comment: "年收益"
    },
    a5: {
      type: DataTypes.DECIMAL(12,4),
      allowNull: true,
      comment: "近三年累计投资收益"
    },
    a60: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "年份"
    },
    a6: {
      type: DataTypes.DECIMAL(12,4),
      allowNull: true,
      comment: "资产总额"
    },
    a7: {
      type: DataTypes.DECIMAL(12,4),
      allowNull: true,
      comment: "净资产"
    },
    a8: {
      type: DataTypes.DECIMAL(12,4),
      allowNull: true,
      comment: "营业收入"
    },
    a9: {
      type: DataTypes.DECIMAL(12,4),
      allowNull: true,
      comment: "利润总额"
    },
    a10: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "是否委派董事"
    },
    a11: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "是否委派监事"
    },
    a12: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "季度收集投后资料"
    },
    remark: {
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
    a13: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "报表时间"
    },
    a14: {
      type: DataTypes.DECIMAL(12,4),
      allowNull: true,
      comment: "负债总额"
    },
    a15: {
      type: DataTypes.DECIMAL(12,4),
      allowNull: true,
      comment: "投资收益"
    }
  }, {
    sequelize,
    tableName: 'info_projects_sub',
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
