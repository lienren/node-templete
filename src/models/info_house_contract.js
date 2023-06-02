const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_house_contract', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cname: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "合同名称"
    },
    camount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      comment: "合同总金额"
    },
    ctype: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "合同类型"
    },
    a1: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "租赁开始时间"
    },
    a2: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "租赁结束时间"
    },
    a4: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      comment: "保证金"
    },
    a5: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "收款方式"
    },
    a15: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "租赁合同编号"
    },
    yearrent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "年租金"
    },
    files: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "文件列表"
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    modifyTime: {
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
    tableName: 'info_house_contract',
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
        name: "idx_ctype",
        using: "BTREE",
        fields: [
          { name: "ctype" },
        ]
      },
    ]
  });
};
