/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('yh_house_second', {
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
      type: DataTypes.STRING(3000),
      allowNull: true
    },
    price: {
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
    community: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    acreage: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    floor: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    isLift: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    deco: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(3000),
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
    uPhone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    uCompName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    statusName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    hType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    hTypeName: {
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
    isVerify: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    isVerifyName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    province: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    tableName: 'yh_house_second'
  });
};
