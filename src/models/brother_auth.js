/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('brother_auth', {
    ba_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    u_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    ba_mobile: {
      type: DataTypes.CHAR(11),
      allowNull: false
    },
    ba_job_number: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    ba_work_photo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ba_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'brother_auth'
  });
};
