const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_address', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    manageType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    shopName: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    brandName: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    creditNum: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    bossName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    bossPhone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    pca: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    addr: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    level: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    accountNum: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    orderName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    bdName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ctime: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cstatus: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    lot: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    lat: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'info_address',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
