/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('yh_report', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    hId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    hName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    hImgUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    cName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cPhone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    cSex: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    cGetTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    statusName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    statusTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    uId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    uName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    uCompName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    zcId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    zc: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    zcName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    addTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    defId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    defName: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'yh_report'
  });
};
