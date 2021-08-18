/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bus_appeal', {
    id: {
      type: DataTypes.INTEGER(255),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    content: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    imgUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    gps: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    gpsAddress: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    handleStatus: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    handleStatusName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    handleTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    assess: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    assessTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    handlerId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    handlerName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    handlerDeptName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    handlerRemark: {
      type: DataTypes.STRING(1000),
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
    tableName: 'bus_appeal'
  });
};
