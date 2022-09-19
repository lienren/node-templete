/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_projects_sub', {
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
    a1: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    a2: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    a3: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    a40: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    a4: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    a5: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    a6: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    a7: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    a8: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    a9: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    a10: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    a11: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    a12: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(500),
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
    },
    manage_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    manage_user: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    a60: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'info_projects_sub'
  });
};
