/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BaseImgCode', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    token: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    imgCode: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    isUse: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    overTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    addTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'BaseImgCode'
  });
};
