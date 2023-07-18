const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_client', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    out_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "外站客户Id"
    },
    out_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "外站客户编码"
    },
    account: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "客户帐号"
    },
    account_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "客户名称"
    },
    concat_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "联系人"
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "状态"
    },
    clerk_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "业务员"
    },
    line_name: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "线路名称"
    },
    receive_phone: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "收货手机号"
    },
    receive_address: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "收货地址"
    },
    lng: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "经度"
    },
    lat: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "纬度"
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
    tableName: 'info_client',
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
        name: "idx_out_id",
        using: "BTREE",
        fields: [
          { name: "out_id" },
        ]
      },
      {
        name: "idx_out_code",
        using: "BTREE",
        fields: [
          { name: "out_code" },
        ]
      },
      {
        name: "idx_account",
        using: "BTREE",
        fields: [
          { name: "account" },
        ]
      },
      {
        name: "idx_line_name",
        using: "BTREE",
        fields: [
          { name: "line_name" },
        ]
      },
    ]
  });
};
