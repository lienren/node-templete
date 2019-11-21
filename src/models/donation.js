/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('donation', {
    d_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    d_title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    d_introduce: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    d_photo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    d_accept_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    d_accept_tel: {
      type: DataTypes.CHAR(11),
      allowNull: false
    },
    d_accept_address: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    d_accept_logistics: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    d_is_full: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    d_is_show: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    d_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'donation'
  });
};
