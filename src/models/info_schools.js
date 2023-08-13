const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_schools', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    schoolCode: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "学校代码"
    },
    schoolName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "学校名称"
    },
    modelAddress: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "取牌地点"
    },
    modelConcat: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "取牌联系人"
    },
    modelConcatPhone: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "取牌联系电话"
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'info_schools',
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
        name: "idx_schoolCode",
        using: "BTREE",
        fields: [
          { name: "schoolCode" },
        ]
      },
      {
        name: "idx_schoolName",
        using: "BTREE",
        fields: [
          { name: "schoolName" },
        ]
      },
    ]
  });
};
