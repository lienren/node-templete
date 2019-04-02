/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BSDoctor', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    dorName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    dorHeadImg: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    clId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    clName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    goodAt: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    detailRemark: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    position: {
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
    tableName: 'BSDoctor'
  });
};
