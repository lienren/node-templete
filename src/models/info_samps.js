/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_samps', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    sampName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sampAddr: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    sampTel: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sampType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'info_samps'
  });
};
