/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('charge_standard', {
    cs_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    cs_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    cs_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    cs_first_weight: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    cs_continued_weight: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    cs_first_money: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    cs_continued_money: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    cs_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'charge_standard'
  });
};
