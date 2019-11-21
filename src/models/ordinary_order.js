/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ordinary_order', {
    oo_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    oo_number: {
      type: DataTypes.CHAR(13),
      allowNull: false
    },
    u_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    ti_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    wi_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    oo_address: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    oo_detailed_address: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    oo_remark: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    oo_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    oo_mobile: {
      type: DataTypes.CHAR(11),
      allowNull: false
    },
    oo_sex: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    oo_reason: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    oo_weight: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    oo_status: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    oo_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    oo_channelId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '1'
    },
    oo_channelName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: '衣森林'
    }
  }, {
    tableName: 'ordinary_order'
  });
};
