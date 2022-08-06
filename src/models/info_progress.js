/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_progress', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    pro_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    p_type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    p_level: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    p_status: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    p_source: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    p_mtype: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    a1: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    a2: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    a2stime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    a2etime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    a3: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    a3stime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    a3etime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    manage_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    manage_user: {
      type: DataTypes.STRING(100),
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
    tableName: 'info_progress'
  });
};
