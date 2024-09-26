const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    openId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    school: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "学校名称"
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "姓名"
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "手机号"
    },
    idcard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "身份证号"
    },
    postType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "职业类型"
    },
    campus: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "校区"
    },
    depName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "部门名称"
    },
    specType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "专业类型"
    },
    grade: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "年级"
    },
    studNum: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "学号"
    },
    modelNum: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "车辆数量"
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updateTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    isDel: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'info_users',
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
        name: "idx_openId",
        using: "BTREE",
        fields: [
          { name: "openId" },
        ]
      },
      {
        name: "idx_phone",
        using: "BTREE",
        fields: [
          { name: "phone" },
        ]
      },
      {
        name: "idx_idcard",
        using: "BTREE",
        fields: [
          { name: "idcard" },
        ]
      },
      {
        name: "idx_grade",
        using: "BTREE",
        fields: [
          { name: "grade" },
        ]
      },
      {
        name: "idx_campus",
        using: "BTREE",
        fields: [
          { name: "campus" },
        ]
      },
    ]
  });
};
