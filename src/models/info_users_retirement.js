/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_users_retirement', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    street: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    community: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    sex: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    nation: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    political: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    idcard: {
      type: DataTypes.STRING(50),
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
      allowNull: true,
      defaultValue: '0'
    },
    holdStartTime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    holdEndTime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    retirementTime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    tableName: 'info_users_retirement'
  });
};
