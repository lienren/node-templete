const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_progress', {
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
    p_type: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "类型"
    },
    p_level: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "优先级(高中低)"
    },
    p_status: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "状态(跟进,关注,储备)"
    },
    p_source: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "来源(投促局,商务局,金融局,高新区,投资机构,银行,券商,其他)"
    },
    p_mtype: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "投资类型(股权投资,招商引资,固定资产投资,投后管理)"
    },
    a1: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "对接人"
    },
    a2: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "上周进展"
    },
    a2stime: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "上周开始时间"
    },
    a2etime: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "上周结束时间"
    },
    a3: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "本周计划"
    },
    a3stime: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "本周开始时间"
    },
    a3etime: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "本周结束时间"
    },
    manage_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "管理员编号"
    },
    manage_user: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "管理员姓名"
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
    }
  }, {
    sequelize,
    tableName: 'info_progress',
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
