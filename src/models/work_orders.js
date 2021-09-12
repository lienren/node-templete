/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('work_orders', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    typeId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    opUserId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    opUserName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    opUserWork: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    opUserLevel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    opRemark: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    state: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    stateName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    stateStartTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    stateEndTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    workDesc: {
      type: DataTypes.STRING(100),
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
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'work_orders'
  });
};
