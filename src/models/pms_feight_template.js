/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pms_feight_template', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    charge_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    first_weight: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    first_fee: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    continue_weight: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    continme_fee: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    dest: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'pms_feight_template'
  });
};
