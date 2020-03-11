/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    u_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    u_nick_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    u_head: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    u_openid: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    u_qr_code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    u_integral: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    u_token: {
      type: DataTypes.CHAR(32),
      allowNull: false
    },
    u_auth: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    u_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'user'
  });
};
