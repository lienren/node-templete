/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PlayBusinessUser', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    busName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    busPhone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    busTitle: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    busContent: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    createTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    busHeadImg: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'PlayBusinessUser'
  });
};
