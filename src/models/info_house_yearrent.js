const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_house_yearrent', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    hid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "房屋编号"
    },
    hhid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "房屋租赁编号"
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
    a3: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      comment: "年租金"
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
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    modifyTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'info_house_yearrent',
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
