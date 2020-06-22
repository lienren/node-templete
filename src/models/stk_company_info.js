/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stk_company_info', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    symbol: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    legal_representative: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    register_location: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    office_address: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    register_capital: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    establish_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    contact_number: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    fax_number: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    main_business: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    business_scope: {
      type: DataTypes.STRING(4000),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(4000),
      allowNull: true
    },
    secretary: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    secretary_number: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    secretary_email: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    province: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    industry_1: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    industry_2: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    ceo: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    comments: {
      type: DataTypes.STRING(300),
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
    tableName: 'stk_company_info'
  });
};
