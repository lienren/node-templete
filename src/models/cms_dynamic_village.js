/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cms_dynamic_village', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    did: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    streetId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    communityId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    villageId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'cms_dynamic_village'
  });
};
