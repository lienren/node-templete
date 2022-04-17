/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ums_growth_change_history', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    member_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    change_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    change_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    operate_man: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    operate_note: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    source_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, {
    tableName: 'ums_growth_change_history'
  });
};
