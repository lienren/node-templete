/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('donation_children', {
    dc_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    d_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'donation',
        key: 'd_id'
      }
    },
    dc_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    dc_number: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    tableName: 'donation_children'
  });
};
