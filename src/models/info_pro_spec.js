const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_pro_spec', {
    pro_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    spec_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "规格数量"
    },
    box_long: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      comment: "箱子长"
    },
    box_width: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      comment: "箱子宽"
    },
    box_height: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      comment: "箱子高"
    },
    box_weight: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      comment: "箱子毛重"
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
    tableName: 'info_pro_spec',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "pro_id" },
        ]
      },
    ]
  });
};
