/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('employee_composition', {
    ts_code: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    rpt_time: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      primaryKey: true
    },
    pub_time: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    total_num_emp: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    prod_emp: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sale_emp: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    finance_emp: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tech_emp: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    rd_emp: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    admin_emp: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    retire_emp: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    other_emp: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    doctor: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    master: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    undergraduate: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    junior: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    technical: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    ctime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatetime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'employee_composition'
  });
};
