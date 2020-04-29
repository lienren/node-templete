/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('yh_def_users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    defName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    defPhone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    defRemark: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    defHeadImg: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    defStatus: {
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
    tableName: 'yh_def_users'
  });
};
