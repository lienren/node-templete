const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_school_deps', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    school: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "学校名称"
    },
    depName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "部门名称"
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'info_school_deps',
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
        name: "idx_school",
        using: "BTREE",
        fields: [
          { name: "school" },
        ]
      },
    ]
  });
};
