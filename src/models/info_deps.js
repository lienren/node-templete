const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_deps', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    depName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "部门名称"
    },
    depLevel: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "部门级别"
    },
    depStreet: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "所在街道"
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "上级部门编号"
    },
    createTime: {
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
    tableName: 'info_deps',
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
        name: "idx_depName",
        using: "BTREE",
        fields: [
          { name: "depName" },
        ]
      },
    ]
  });
};
