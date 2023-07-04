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
var _info_deps = require("./info_deps");
var _info_posts = require("./info_posts");
var _info_samps = require("./info_samps");
var _info_user_samps = require("./info_user_samps");
var _info_users = require("./info_users");
var _pagelogs = require("./pagelogs");

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
  var info_deps = _info_deps(sequelize, DataTypes);
  var info_posts = _info_posts(sequelize, DataTypes);
  var info_samps = _info_samps(sequelize, DataTypes);
  var info_user_samps = _info_user_samps(sequelize, DataTypes);
  var info_users = _info_users(sequelize, DataTypes);
  var pagelogs = _pagelogs(sequelize, DataTypes);


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
    info_deps,
    info_posts,
    info_samps,
    info_user_samps,
    info_users,
    pagelogs,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
