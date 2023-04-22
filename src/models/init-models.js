var DataTypes = require("sequelize").DataTypes;
var _BaseApi = require("./BaseApi");
var _BaseConfig = require("./BaseConfig");
var _BaseErrorContext = require("./BaseErrorContext");
var _BaseImgCode = require("./BaseImgCode");
var _BaseMenu = require("./BaseMenu");
var _SuperManagerInfo = require("./SuperManagerInfo");
var _SuperManagerLoginfo = require("./SuperManagerLoginfo");
var _SuperManagerRoleInfo = require("./SuperManagerRoleInfo");
var _SuperRoleInfo = require("./SuperRoleInfo");
var _SuperRoleMenuInfo = require("./SuperRoleMenuInfo");
var _info_arrival = require("./info_arrival");
var _info_arrival_pro = require("./info_arrival_pro");
var _info_outwh = require("./info_outwh");
var _info_outwh_pro = require("./info_outwh_pro");
var _info_outwh_pro_space = require("./info_outwh_pro_space");
var _info_pro = require("./info_pro");
var _info_purchase = require("./info_purchase");
var _info_purchase_pro = require("./info_purchase_pro");
var _info_sort = require("./info_sort");
var _info_space = require("./info_space");
var _info_warehouse = require("./info_warehouse");
var _info_warehouse_pro = require("./info_warehouse_pro");

function initModels(sequelize) {
  var BaseApi = _BaseApi(sequelize, DataTypes);
  var BaseConfig = _BaseConfig(sequelize, DataTypes);
  var BaseErrorContext = _BaseErrorContext(sequelize, DataTypes);
  var BaseImgCode = _BaseImgCode(sequelize, DataTypes);
  var BaseMenu = _BaseMenu(sequelize, DataTypes);
  var SuperManagerInfo = _SuperManagerInfo(sequelize, DataTypes);
  var SuperManagerLoginfo = _SuperManagerLoginfo(sequelize, DataTypes);
  var SuperManagerRoleInfo = _SuperManagerRoleInfo(sequelize, DataTypes);
  var SuperRoleInfo = _SuperRoleInfo(sequelize, DataTypes);
  var SuperRoleMenuInfo = _SuperRoleMenuInfo(sequelize, DataTypes);
  var info_arrival = _info_arrival(sequelize, DataTypes);
  var info_arrival_pro = _info_arrival_pro(sequelize, DataTypes);
  var info_outwh = _info_outwh(sequelize, DataTypes);
  var info_outwh_pro = _info_outwh_pro(sequelize, DataTypes);
  var info_outwh_pro_space = _info_outwh_pro_space(sequelize, DataTypes);
  var info_pro = _info_pro(sequelize, DataTypes);
  var info_purchase = _info_purchase(sequelize, DataTypes);
  var info_purchase_pro = _info_purchase_pro(sequelize, DataTypes);
  var info_sort = _info_sort(sequelize, DataTypes);
  var info_space = _info_space(sequelize, DataTypes);
  var info_warehouse = _info_warehouse(sequelize, DataTypes);
  var info_warehouse_pro = _info_warehouse_pro(sequelize, DataTypes);


  return {
    BaseApi,
    BaseConfig,
    BaseErrorContext,
    BaseImgCode,
    BaseMenu,
    SuperManagerInfo,
    SuperManagerLoginfo,
    SuperManagerRoleInfo,
    SuperRoleInfo,
    SuperRoleMenuInfo,
    info_arrival,
    info_arrival_pro,
    info_outwh,
    info_outwh_pro,
    info_outwh_pro_space,
    info_pro,
    info_purchase,
    info_purchase_pro,
    info_sort,
    info_space,
    info_warehouse,
    info_warehouse_pro,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
