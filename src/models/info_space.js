const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_space', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    wh_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "库房编号"
    },
    wh_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "库房名称"
    },
    area_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "区位名称"
    },
    shelf_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "货架名称"
    },
    space_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "货位名称"
    },
    space_type: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "正常货位",
      comment: "货位类型"
    },
    sort_index: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "拣货顺序"
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "优先级"
    },
    is_del: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "是否删除"
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
    tableName: 'info_space',
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
        name: "idx_wh_id",
        using: "BTREE",
        fields: [
          { name: "wh_id" },
        ]
      },
      {
        name: "idx_space_type",
        using: "BTREE",
        fields: [
          { name: "space_type" },
        ]
      },
      {
        name: "idx_space_name",
        using: "BTREE",
        fields: [
          { name: "space_name" },
        ]
      },
    ]
  });
};
