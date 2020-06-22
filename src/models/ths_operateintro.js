/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ths_operateintro', {
    id: {
      type: DataTypes.INTEGER(20).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    main_business: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    product_type: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    product_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    business_scope: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    symbol: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    updatetime: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    ctime: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'ths_operateintro'
  });
};
