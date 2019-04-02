/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BSKL', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    klTitle: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    klSubTitle: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    klHeadImg: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    klContent: {
      type: DataTypes.STRING(8000),
      allowNull: true
    },
    klClassId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    klClassName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    addTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    createMId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    createMName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    updateTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    visitNum: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    keyName: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    hotKeyName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    dorId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    dorName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    dorPosition: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'BSKL'
  });
};
