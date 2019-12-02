/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('nav_node', {
    nn_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nn_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    nn_url: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nn_pid: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    nn_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    nn_ord: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    nn_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'nav_node'
  });
};
