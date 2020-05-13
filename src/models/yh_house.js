/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('yh_house', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    imgUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    price: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    yj: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    stopTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    jians: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    report: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(500),
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
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    statusName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    area: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    street: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    isRecomm: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    addTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'yh_house'
  });
};
