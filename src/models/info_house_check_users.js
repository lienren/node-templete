const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_house_check_users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "检查编号"
    },
    sid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "门店编号"
    },
    cUsers: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "检查人信息"
    },
    cUserImg: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "检查人签名"
    },
    cRemark: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "检查人备注"
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
    cUnUserName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "被检查人姓名"
    },
    cUnUserImg: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "被检查人签名"
    },
    cUnUserPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "被检查人电话"
    },
    cContent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "检查内容"
    },
    cTime: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "检查日期"
    },
    cResult: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "检查结果"
    },
    isProblem: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "是否存在问题"
    },
    cProblem: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "检查出的问题"
    },
    cProblemImgs: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "检查出问题照片"
    },
    cMeasure: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "采取措施"
    },
    isRepeat: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "是否复查"
    }
  }, {
    sequelize,
    tableName: 'info_house_check_users',
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
        name: "idx_cid",
        using: "BTREE",
        fields: [
          { name: "cid" },
        ]
      },
      {
        name: "idx_isRepeat",
        using: "BTREE",
        fields: [
          { name: "isRepeat" },
        ]
      },
      {
        name: "idx_sid",
        using: "BTREE",
        fields: [
          { name: "sid" },
        ]
      },
    ]
  });
};
