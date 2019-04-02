/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BSCL', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    clName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    clHeadImg: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    clAddress: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    clTel: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    addTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    lastTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'BSCL'
  });
};
