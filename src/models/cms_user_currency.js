/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cms_user_currency', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    user_name: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    user_type: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    user_type_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cmp_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    cmp_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_currency: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    user_consume: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'cms_user_currency'
  });
};
