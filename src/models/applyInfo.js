/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('applyInfo', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    openId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    depname: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    imgcount: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    imglist: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updateTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    state: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    stateName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    opName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    opRemark: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    opTime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'applyInfo'
  });
};
