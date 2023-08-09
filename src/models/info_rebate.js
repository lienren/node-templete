const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_rebate', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    re_user: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "返利用户"
    },
    re_user_phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "返利用户手机号"
    },
    out_codes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "客户编码"
    },
    pro_codes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "商品编码"
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
    tableName: 'info_rebate',
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
