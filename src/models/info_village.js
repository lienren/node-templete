/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_village', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    villageName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    firstLetter: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    communityId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    streetId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'info_village'
  });
};
