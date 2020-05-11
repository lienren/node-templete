/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('yh_report_deco', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
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
    cGetTimeDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cGetTimeTime: {
      type: DataTypes.STRING(10),
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
    uId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    uName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cCost: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    disgId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    disgName: {
      type: DataTypes.STRING(100),
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
    community: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'yh_report_deco'
  });
};
