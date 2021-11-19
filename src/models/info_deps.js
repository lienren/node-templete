/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_deps', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    depName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    depLevel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    depStreet: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    parentId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    isDel: {
      type: DataTypes.INTEGER(255),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'info_deps'
  });
};
