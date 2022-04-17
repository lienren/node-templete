/*
 * @Author: Lienren 
 * @Date: 2021-03-01 21:22:47 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-07-13 08:37:16
 */
'use strict';

const assert = require('assert');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const encrypt = require('../../utils/encrypt');
const cp = require('./checkParam');

function zeroPad (nr, base) {
  var len = (String(base).length - String(nr).length) + 1;
  return len > 0 ? new Array(len).join('0') + nr : nr;
}

function handleSkuStockCode (productId, skuStockList) {
  if (skuStockList && skuStockList.length > 0) {
    let now = date.formatDate(new Date(), 'YYYYMMDD');
    skuStockList.map((m, i) => {
      if (!m.skuCode) {
        m.skuCode = `${now}${zeroPad(productId, 1000)}${zeroPad(i + 1, 100)}`;
      }
    })
  }

  return skuStockList;
}

module.exports = {
  attrCategoryList: async (ctx) => {
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;

    let where = {
      is_del: 0
    }

    let result = await ctx.orm().pms_product_attribute_category.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where
    });

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        return {
          ...m.dataValues,
          attributeCount: m.dataValues.attribute_count,
          paramCount: m.dataValues.param_count
        }
      }),
    };
  },
  attrCategoryCreate: async (ctx) => {
    let name = ctx.request.body.name || '';

    ctx.orm().pms_product_attribute_category.create({
      name: name,
      attribute_count: 0,
      param_count: 0,
      is_del: 0
    });

    ctx.body = {};
  },
  attrCategoryEdit: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let name = ctx.request.body.name || '';

    ctx.orm().pms_product_attribute_category.update({
      name: name
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
  attrCategoryDel: async (ctx) => {
    let id = ctx.request.body.id || 0;

    await ctx.orm().pms_product_attribute_category.update({
      is_del: 1
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
  attrList: async (ctx) => {
    let cid = ctx.request.body.cid || 0;
    let type = ctx.request.body.type || 0;
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;

    let where = {
      product_attribute_category_id: cid,
      type,
      is_del: 0
    }

    let result = await ctx.orm().pms_product_attribute.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where
    });

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        return {
          ...m.dataValues,
          productAttributeCategoryId: m.dataValues.product_attribute_category_id,
          selectType: m.dataValues.select_type,
          inputType: m.dataValues.input_type,
          inputList: m.dataValues.input_list,
          filterType: m.dataValues.filter_type,
          searchType: m.dataValues.search_type,
          relatedStatus: m.dataValues.related_status,
          handAddStatus: m.dataValues.hand_add_status
        }
      }),
    };
  },
  attrInfo: async (ctx) => {
    let id = ctx.request.body.id || 0;

    let where = {
      id,
      is_del: 0
    }

    let result = await ctx.orm().pms_product_attribute.findOne({
      where
    });

    ctx.body = {
      ...result.dataValues,
      inputList: result.dataValues.input_list,
      selectType: result.dataValues.select_type,
      inputType: result.dataValues.input_type,
      filterType: result.dataValues.filter_type,
      handAddStatus: result.dataValues.hand_add_status,
      productAttributeCategoryId: result.dataValues.product_attribute_category_id,
      relatedStatus: result.dataValues.related_status,
      searchType: result.dataValues.search_type
    };
  },
  attrCreate: async (ctx) => {
    let filterType = ctx.request.body.filterType || 0;
    let handAddStatus = ctx.request.body.handAddStatus || 0;
    let inputList = ctx.request.body.inputList || 0;
    let inputType = ctx.request.body.inputType || 0;
    let name = ctx.request.body.name || '';
    let productAttributeCategoryId = ctx.request.body.productAttributeCategoryId || 0;
    let relatedStatus = ctx.request.body.relatedStatus || 0;
    let searchType = ctx.request.body.searchType || 0;
    let selectType = ctx.request.body.selectType || 0;
    let sort = ctx.request.body.sort || 0;
    let type = ctx.request.body.type || 0;


    await ctx.orm().pms_product_attribute.create({
      product_attribute_category_id: productAttributeCategoryId,
      name: name,
      select_type: selectType,
      input_type: inputType,
      input_list: inputList,
      sort: sort,
      filter_type: filterType,
      search_type: searchType,
      related_status: relatedStatus,
      hand_add_status: handAddStatus,
      type: type,
      is_del: 0
    });

    await ctx
      .orm()
      .query(`update pms_product_attribute_category set attribute_count = (select count(1) from pms_product_attribute where product_attribute_category_id = pms_product_attribute_category.id and type = 0 and is_del = 0) where is_del = 0`, {}, {
        type: ctx.orm().sequelize.QueryTypes.UPDATE
      })

    await ctx
      .orm()
      .query(`update pms_product_attribute_category set param_count = (select count(1) from pms_product_attribute where product_attribute_category_id = pms_product_attribute_category.id and type = 1 and is_del = 0) where is_del = 0`, {}, {
        type: ctx.orm().sequelize.QueryTypes.UPDATE
      })

    ctx.body = {};
  },
  attrEdit: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let filterType = ctx.request.body.filterType || 0;
    let handAddStatus = ctx.request.body.handAddStatus || 0;
    let inputList = ctx.request.body.inputList || 0;
    let inputType = ctx.request.body.inputType || 0;
    let name = ctx.request.body.name || '';
    let productAttributeCategoryId = ctx.request.body.productAttributeCategoryId || 0;
    let relatedStatus = ctx.request.body.relatedStatus || 0;
    let searchType = ctx.request.body.searchType || 0;
    let selectType = ctx.request.body.selectType || 0;
    let sort = ctx.request.body.sort || 0;
    let type = ctx.request.body.type || 0;


    await ctx.orm().pms_product_attribute.update({
      product_attribute_category_id: productAttributeCategoryId,
      name: name,
      select_type: selectType,
      input_type: inputType,
      input_list: inputList,
      sort: sort,
      filter_type: filterType,
      search_type: searchType,
      related_status: relatedStatus,
      hand_add_status: handAddStatus,
      type: type,
      is_del: 0
    }, {
      where: {
        id
      }
    });

    await ctx
      .orm()
      .query(`update pms_product_attribute_category set attribute_count = (select count(1) from pms_product_attribute where product_attribute_category_id = pms_product_attribute_category.id and type = 0 and is_del = 0) where is_del = 0`, {}, {
        type: ctx.orm().sequelize.QueryTypes.UPDATE
      })

    await ctx
      .orm()
      .query(`update pms_product_attribute_category set param_count = (select count(1) from pms_product_attribute where product_attribute_category_id = pms_product_attribute_category.id and type = 1 and is_del = 0) where is_del = 0`, {}, {
        type: ctx.orm().sequelize.QueryTypes.UPDATE
      })

    ctx.body = {};
  },
  attrWithAttr: async (ctx) => {
    let withAttr = await ctx.orm().query(`
    SELECT
        pac.id,
        pac.name,
        pa.id attrId,
        pa.name attrName
    FROM
        pms_product_attribute_category pac
        LEFT JOIN pms_product_attribute pa ON pac.id = pa.product_attribute_category_id
    AND pa.type=1 order by pac.id;`);

    withAttr = withAttr.length > 0 ? withAttr[0] : withAttr;

    withAttr = withAttr.reduce((total, current) => {
      let find = total.find(f => {
        return f.id === current.id
      });

      if (find) {
        find.productAttributeList.push({
          id: current.attrId,
          name: current.attrName
        });
      } else {
        find = {
          id: current.id,
          name: current.name,
          productAttributeList: []
        }

        find.productAttributeList.push({
          id: current.attrId,
          name: current.attrName
        });

        total.push(find);
      }

      return total;
    }, []);

    ctx.body = withAttr;
  },
  attrDel: async (ctx) => {
    let ids = ctx.request.body.ids || [];

    if (ids.length > 0) {
      await ctx
        .orm()
        .query(`update pms_product_attribute set is_del = 1 where id in (${ids.map(m => {
          return m
        }).join(',')})`)
        .spread((results, metadata) => { });

      await ctx
        .orm()
        .query(`update pms_product_attribute_category set attribute_count = (select count(1) from pms_product_attribute where product_attribute_category_id = pms_product_attribute_category.id and type = 0 and is_del = 0) where is_del = 0`, {}, {
          type: ctx.orm().sequelize.QueryTypes.UPDATE
        })

      await ctx
        .orm()
        .query(`update pms_product_attribute_category set param_count = (select count(1) from pms_product_attribute where product_attribute_category_id = pms_product_attribute_category.id and type = 1 and is_del = 0) where is_del = 0`, {}, {
          type: ctx.orm().sequelize.QueryTypes.UPDATE
        })
    }

    ctx.body = {};
  },
  attrWithCate: async (ctx) => {
    let productCategoryId = ctx.request.body.productCategoryId || 0;
    let result = await ctx.orm().query(`
      SELECT
          pa.id  attributeId,
          pac.id attributeCategoryId
      FROM
          pms_product_category_attribute_relation pcar
          LEFT JOIN pms_product_attribute pa ON pa.id = pcar.product_attribute_id
          LEFT JOIN pms_product_attribute_category pac ON pa.product_attribute_category_id = pac.id
      WHERE
          pcar.product_category_id = ${productCategoryId}`);

    ctx.body = result.length > 0 ? result[0] : result;
  },
  brandList: async (ctx) => {
    let keyword = ctx.request.body.keyword || '';
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;

    let where = {
      is_del: 0
    }

    if (keyword) {
      where.name = {
        $like: `%${keyword}%`
      }
    }

    let result = await ctx.orm().pms_brand.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where
    });

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        return {
          ...m.dataValues,
          firstLetter: m.dataValues.first_letter,
          showStatus: m.dataValues.show_status,
          factoryStatus: m.dataValues.factory_status,
          bigPic: m.dataValues.big_pic,
          brandStory: m.dataValues.brand_story,
          productCount: m.dataValues.product_count,
          productCommentCount: m.dataValues.product_comment_count
        }
      }),
    };
  },
  brandInfo: async (ctx) => {
    let id = ctx.request.body.id || 0;

    let where = {
      id,
      is_del: 0
    }

    let result = await ctx.orm().pms_brand.findOne({
      where
    });

    ctx.body = {
      ...result.dataValues,
      firstLetter: result.dataValues.first_letter,
      showStatus: result.dataValues.show_status,
      factoryStatus: result.dataValues.factory_status,
      bigPic: result.dataValues.big_pic,
      brandStory: result.dataValues.brand_story,
      productCount: result.dataValues.product_count,
      productCommentCount: result.dataValues.product_comment_count
    };
  },
  brandCreate: async (ctx) => {
    let bigPic = ctx.request.body.bigPic || '';
    let brandStory = ctx.request.body.brandStory || '';
    let factoryStatus = ctx.request.body.factoryStatus || 0;
    let firstLetter = ctx.request.body.firstLetter || 0;
    let logo = ctx.request.body.logo || '';
    let name = ctx.request.body.name || '';
    let showStatus = ctx.request.body.showStatus || 0;
    let sort = ctx.request.body.sort || 0;

    ctx.orm().pms_brand.create({
      name,
      first_letter: firstLetter,
      sort,
      factory_status: factoryStatus,
      show_status: showStatus,
      product_count: 0,
      product_comment_count: 0,
      logo,
      big_pic: bigPic,
      brand_story: brandStory,
      is_del: 0
    });

    ctx.body = {};
  },
  brandEdit: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let bigPic = ctx.request.body.bigPic || '';
    let brandStory = ctx.request.body.brandStory || '';
    let factoryStatus = ctx.request.body.factoryStatus || 0;
    let firstLetter = ctx.request.body.firstLetter || 0;
    let logo = ctx.request.body.logo || '';
    let name = ctx.request.body.name || '';
    let showStatus = ctx.request.body.showStatus || 0;
    let sort = ctx.request.body.sort || 0;

    ctx.orm().pms_brand.update({
      name,
      first_letter: firstLetter,
      sort,
      factory_status: factoryStatus,
      show_status: showStatus,
      logo,
      big_pic: bigPic,
      brand_story: brandStory
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
  brandEditStatus: async (ctx) => {
    let ids = ctx.request.body.ids || [];
    let showStatus = ctx.request.body.showStatus || 0;

    if (Array.isArray(ids)) {
      ctx.orm().pms_brand.update({
        show_status: showStatus
      }, {
        where: {
          id: {
            $in: ids
          }
        }
      });
    } else {
      ctx.orm().pms_brand.update({
        show_status: showStatus
      }, {
        where: {
          id: ids
        }
      });
    }

    ctx.body = {};
  },
  brandEditFactoryStatus: async (ctx) => {
    let ids = ctx.request.body.ids || [];
    let factoryStatus = ctx.request.body.factoryStatus || 0;

    if (Array.isArray(ids)) {
      ctx.orm().pms_brand.update({
        factory_status: factoryStatus
      }, {
        where: {
          id: {
            $in: ids
          }
        }
      });
    } else {
      ctx.orm().pms_brand.update({
        factory_status: factoryStatus
      }, {
        where: {
          id: ids
        }
      });
    }

    ctx.body = {};
  },
  brandDel: async (ctx) => {
    let id = ctx.request.body.id || 0;

    await ctx.orm().pms_brand.update({
      is_del: 1
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
  cateList: async (ctx) => {
    let parentId = ctx.request.body.parentId || 0;
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;

    let where = {
      parent_id: parentId,
      is_del: 0
    }

    let result = await ctx.orm().pms_product_category.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where
    });

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        return {
          ...m.dataValues,
          parentId: m.dataValues.parent_id,
          productCount: m.dataValues.product_count,
          productUnit: m.dataValues.product_unit,
          navStatus: m.dataValues.nav_status,
          showStatus: m.dataValues.show_status
        }
      }),
    };
  },
  cateInfo: async (ctx) => {
    let id = ctx.request.body.id || 0;

    let where = {
      id,
      is_del: 0
    }

    let result = await ctx.orm().pms_product_category.findOne({
      where
    });

    ctx.body = {
      ...result.dataValues,
      parentId: result.dataValues.parent_id,
      productCount: result.dataValues.product_count,
      productUnit: result.dataValues.product_unit,
      navStatus: result.dataValues.nav_status,
      showStatus: result.dataValues.show_status
    };
  },
  cateDel: async (ctx) => {
    let id = ctx.request.body.id || 0;

    await ctx.orm().pms_product_category.update({
      is_del: 1
    }, {
      where: {
        id
      }
    });

    await ctx.orm().pms_product_category.update({
      is_del: 1
    }, {
      where: {
        parent_id: id
      }
    });

    ctx.body = {};
  },
  cateEditStatus: async (ctx) => {
    let ids = ctx.request.body.ids || [];
    let showStatus = ctx.request.body.showStatus || 0;

    if (Array.isArray(ids)) {
      ctx.orm().pms_product_category.update({
        show_status: showStatus
      }, {
        where: {
          id: {
            $in: ids
          }
        }
      });
    } else {
      ctx.orm().pms_product_category.update({
        show_status: showStatus
      }, {
        where: {
          id: ids
        }
      });
    }

    ctx.body = {};
  },
  cateEditNavStatus: async (ctx) => {
    let ids = ctx.request.body.ids || [];
    let navStatus = ctx.request.body.navStatus || 0;

    if (Array.isArray(ids)) {
      ctx.orm().pms_product_category.update({
        nav_status: navStatus
      }, {
        where: {
          id: {
            $in: ids
          }
        }
      });
    } else {
      ctx.orm().pms_product_category.update({
        nav_status: navStatus
      }, {
        where: {
          id: ids
        }
      });
    }

    ctx.body = {};
  },
  cateWithChildren: async (ctx) => {
    let children = await ctx.orm().query(`
      select
          c1.id,
          c1.name,
          c2.id   childId,
          c2.name childName
      from pms_product_category c1 left join pms_product_category c2 on c1.id = c2.parent_id
      where c1.parent_id = 0`);

    children = children.length > 0 ? children[0] : children;

    children = children.reduce((total, current) => {
      let find = total.find(f => {
        return f.id === current.id
      });

      if (find) {
        find.children.push({
          id: current.childId,
          name: current.childName
        });
      } else {
        find = {
          id: current.id,
          name: current.name,
          children: []
        }

        find.children.push({
          id: current.childId,
          name: current.childName
        });

        total.push(find);
      }

      return total;
    }, []);

    ctx.body = children;
  },
  cateCreate: async (ctx) => {
    let description = ctx.request.body.description || '';
    let icon = ctx.request.body.icon || '';
    let keywords = ctx.request.body.keywords || '';
    let name = ctx.request.body.name || '';
    let navStatus = ctx.request.body.navStatus || 0;
    let parentId = ctx.request.body.parentId || 0;
    let productUnit = ctx.request.body.productUnit || '';
    let showStatus = ctx.request.body.showStatus || 0;
    let sort = ctx.request.body.sort || 0;
    let productAttributeIdList = ctx.request.body.productAttributeIdList || [];

    let parentCate = null
    if (parentId > 0) {
      parentCate = await ctx.orm().pms_product_category.findOne({
        where: {
          id: parentId
        }
      })
    }

    let cate = await ctx.orm().pms_product_category.create({
      parent_id: parentId,
      name,
      level: parentCate ? parentCate.level + 1 : 0,
      product_count: 0,
      product_unit: productUnit,
      nav_status: navStatus,
      show_status: showStatus,
      sort,
      icon,
      keywords,
      description,
      is_del: 0
    });

    if (cate && cate.id > 0) {
      // 删除
      await ctx
        .orm()
        .query(`delete from pms_product_category_attribute_relation where product_category_id = ${cate.id}`)
        .spread((results, metadata) => { });

      // 添加
      let data = productAttributeIdList.map(attrId => {
        return {
          product_category_id: cate.id,
          product_attribute_id: parseInt(attrId)
        };
      });
      ctx.orm().pms_product_category_attribute_relation.bulkCreate(data);
    }

    ctx.body = {};
  },
  cateEdit: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let description = ctx.request.body.description || '';
    let icon = ctx.request.body.icon || '';
    let keywords = ctx.request.body.keywords || '';
    let name = ctx.request.body.name || '';
    let navStatus = ctx.request.body.navStatus || 0;
    let parentId = ctx.request.body.parentId || 0;
    let productUnit = ctx.request.body.productUnit || '';
    let showStatus = ctx.request.body.showStatus || 0;
    let sort = ctx.request.body.sort || 0;
    let productAttributeIdList = ctx.request.body.productAttributeIdList || [];

    let parentCate = null
    if (parentId > 0) {
      parentCate = await ctx.orm().pms_product_category.findOne({
        where: {
          id: parentId
        }
      })
    }

    await ctx.orm().pms_product_category.update({
      parent_id: parentId,
      name,
      level: parentCate ? parentCate.level + 1 : 0,
      product_count: 0,
      product_unit: productUnit,
      nav_status: navStatus,
      show_status: showStatus,
      sort,
      icon,
      keywords,
      description
    }, {
      where: {
        id
      }
    });

    if (id > 0) {
      // 删除
      await ctx
        .orm()
        .query(`delete from pms_product_category_attribute_relation where product_category_id = ${id}`)
        .spread((results, metadata) => { });

      // 添加
      let data = productAttributeIdList.map(attrId => {
        return {
          product_category_id: id,
          product_attribute_id: parseInt(attrId)
        };
      });
      ctx.orm().pms_product_category_attribute_relation.bulkCreate(data);
    }

    ctx.body = {};
  },
  proList: async (ctx) => {
    let keyword = ctx.request.body.keyword || '';
    let publishStatus = ctx.request.body.publishStatus;
    let verifyStatus = ctx.request.body.verifyStatus;
    let productSn = ctx.request.body.productSn || '';
    let productCategoryId = ctx.request.body.productCategoryId || 0;
    let brandId = ctx.request.body.brandId || 0;
    let providerId = ctx.request.body.providerId || 0;
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;

    let manager = await ctx.orm().ums_admin.findOne({
      where: {
        id: ctx.work.managerId,
        status: 1,
        is_del: 0
      }
    });

    assert.ok(manager != null, '获取管理员失败！');

    let where = {
      delete_status: 0,
      is_del: 0
    }

    // 如果是供应商，只能看自己商品
    if (manager.provider_id) {
      where.provider_id = manager.provider_id
    }

    if (providerId) {
      where.provider_id = providerId
    }

    if (keyword) {
      where.name = {
        $like: `%${keyword}%`
      }
    }

    if (!(publishStatus === null || publishStatus === undefined || publishStatus === '')) {
      where.publish_status = publishStatus
    }

    if (!(verifyStatus === null || verifyStatus === undefined || verifyStatus === '')) {
      where.verify_status = verifyStatus
    }

    if (productSn) {
      where.product_sn = productSn
    }

    if (productCategoryId) {
      where.product_category_id = productCategoryId
    }

    if (brandId) {
      where.brand_id = brandId
    }

    let result = await ctx.orm().pms_product.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['id', 'desc']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        return {
          ...m.dataValues,
          brandId: m.dataValues.brand_id,
          productCategoryId: m.dataValues.product_category_id,
          feightTemplateId: m.dataValues.feight_template_id,
          productAttributeCategoryId: m.dataValues.product_attribute_category_id,
          productSn: m.dataValues.product_sn,
          deleteStatus: m.dataValues.delete_status,
          publishStatus: m.dataValues.publish_status,
          newStatus: m.dataValues.new_status,
          recommandStatus: m.dataValues.recommand_status,
          verifyStatus: m.dataValues.verify_status,
          promotionPrice: m.dataValues.promotion_price,
          giftGrowth: m.dataValues.gift_growth,
          giftPoint: m.dataValues.gift_point,
          usePointLimit: m.dataValues.use_point_limit,
          subTitle: m.dataValues.sub_title,
          originalPrice: m.dataValues.original_price,
          lowStock: m.dataValues.low_stock,
          previewStatus: m.dataValues.preview_status,
          serviceIds: m.dataValues.service_ids,
          albumPics: m.dataValues.album_pics,
          detailTitle: m.dataValues.detail_title,
          detailDesc: m.dataValues.detail_desc,
          detailHtml: m.dataValues.detail_html,
          detailMobileHtml: m.dataValues.detail_mobile_html,
          promotionStartTime: m.dataValues.promotion_start_time,
          promotionEndTime: m.dataValues.promotion_end_time,
          promotionPerLimit: m.dataValues.promotion_per_limit,
          promotionType: m.dataValues.promotion_type,
          brandName: m.dataValues.brand_name,
          productCategoryName: m.dataValues.product_category_name,
          minSaleStock: m.dataValues.min_sale_stock,
          providerId: m.dataValues.provider_id,
          providerName: m.dataValues.provider_name
        }
      }),
    };
  },
  proInfo: async (ctx) => {
    let id = ctx.request.body.id || 0;

    let where = {
      id,
      is_del: 0
    }

    let result = await ctx.orm().pms_product.findOne({
      where
    });

    let cateParentId = 0;
    if (result) {
      let cate = await ctx.orm().pms_product_category.findOne({
        where: {
          id: result.product_category_id,
          is_del: 0
        }
      })

      if (cate) {
        cateParentId = cate.parent_id;
      }
    }

    // 获取SKU信息
    let skuStockList = await ctx.orm().pms_sku_stock.findAll({
      where: {
        product_id: id
      }
    });

    if (skuStockList && skuStockList.length > 0) {
      skuStockList = skuStockList.map(m => {
        return {
          ...m.dataValues,
          productId: m.dataValues.product_id,
          skuCode: m.dataValues.sku_code,
          lowStock: m.dataValues.low_stock,
          promotionPrice: m.dataValues.promotion_price,
          lockStock: m.dataValues.lock_stock,
          spData: m.dataValues.sp_data
        }
      });
    } else {
      skuStockList = [];
    }

    // 获取商品属性
    let productAttributeValueList = await ctx.orm().pms_product_attribute_value.findAll({
      where: {
        product_id: id
      }
    })

    if (productAttributeValueList && productAttributeValueList.length > 0) {
      productAttributeValueList = productAttributeValueList.map(m => {
        return {
          ...m.dataValues,
          id: m.dataValues.product_id,
          productAttributeId: m.dataValues.product_attribute_id,
          value: m.value
        }
      })
    } else {
      productAttributeValueList = [];
    }

    ctx.body = {
      ...result.dataValues,
      brandId: result.dataValues.brand_id,
      productCategoryId: result.dataValues.product_category_id,
      cateParentId,
      feightTemplateId: result.dataValues.feight_template_id,
      productAttributeCategoryId: result.dataValues.product_attribute_category_id,
      productSn: result.dataValues.product_sn,
      deleteStatus: result.dataValues.delete_status,
      publishStatus: result.dataValues.publish_status,
      newStatus: result.dataValues.new_status,
      recommandStatus: result.dataValues.recommand_status,
      verifyStatus: result.dataValues.verify_status,
      promotionPrice: result.dataValues.promotion_price,
      giftGrowth: result.dataValues.gift_growth,
      giftPoint: result.dataValues.gift_point,
      usePointLimit: result.dataValues.use_point_limit,
      subTitle: result.dataValues.sub_title,
      originalPrice: result.dataValues.original_price,
      lowStock: result.dataValues.low_stock,
      previewStatus: result.dataValues.preview_status,
      serviceIds: result.dataValues.service_ids,
      albumPics: result.dataValues.album_pics,
      detailTitle: result.dataValues.detail_title,
      detailDesc: result.dataValues.detail_desc,
      detailHtml: result.dataValues.detail_html,
      detailMobileHtml: result.dataValues.detail_mobile_html,
      promotionStartTime: result.dataValues.promotion_start_time,
      promotionEndTime: result.dataValues.promotion_end_time,
      promotionPerLimit: result.dataValues.promotion_per_limit,
      promotionType: result.dataValues.promotion_type,
      brandName: result.dataValues.brand_name,
      productCategoryName: result.dataValues.product_category_name,
      minSaleStock: result.dataValues.min_sale_stock,
      skuStockList,
      productAttributeValueList,
      providerId: result.dataValues.provider_id,
      providerName: result.dataValues.provider_name
    };
  },
  proDel: async (ctx) => {
    let ids = ctx.request.body.ids || [];
    let deleteStatus = ctx.request.body.deleteStatus || 0;

    if (Array.isArray(ids)) {
      await ctx.orm().pms_product.update({
        delete_status: deleteStatus
      }, {
        where: {
          id: {
            $in: ids
          }
        }
      });
    } else {
      await ctx.orm().pms_product.update({
        delete_status: deleteStatus
      }, {
        where: {
          id: ids
        }
      });
    }

    ctx.body = {};
  },
  proEditNewStatus: async (ctx) => {
    let ids = ctx.request.body.ids || [];
    let newStatus = ctx.request.body.newStatus || 0;

    if (Array.isArray(ids)) {
      await ctx.orm().pms_product.update({
        new_status: newStatus
      }, {
        where: {
          id: {
            $in: ids
          }
        }
      });
    } else {
      await ctx.orm().pms_product.update({
        new_status: newStatus
      }, {
        where: {
          id: ids
        }
      });
    }

    ctx.body = {};
  },
  proEditRecommendStatus: async (ctx) => {
    let ids = ctx.request.body.ids || [];
    let recommendStatus = ctx.request.body.recommendStatus || 0;

    if (Array.isArray(ids)) {
      await ctx.orm().pms_product.update({
        recommand_status: recommendStatus
      }, {
        where: {
          id: {
            $in: ids
          }
        }
      });
    } else {
      await ctx.orm().pms_product.update({
        recommand_status: recommendStatus
      }, {
        where: {
          id: ids
        }
      });
    }

    ctx.body = {};
  },
  proEditPublishStatus: async (ctx) => {
    let ids = ctx.request.body.ids || [];
    let publishStatus = ctx.request.body.publishStatus || 0;

    if (Array.isArray(ids)) {
      await ctx.orm().pms_product.update({
        publish_status: publishStatus
      }, {
        where: {
          id: {
            $in: ids
          }
        }
      });
    } else {
      await ctx.orm().pms_product.update({
        publish_status: publishStatus
      }, {
        where: {
          id: ids
        }
      });
    }

    ctx.body = {};
  },
  proSkuList: async (ctx) => {
    let pid = ctx.request.body.pid || 0;
    let keyword = ctx.request.body.keyword || '';

    let where = {
      product_id: pid
    }

    if (keyword) {
      where.sku_code = {
        $like: `%${keyword}%`
      }
    }

    let result = await ctx.orm().pms_sku_stock.findAll({
      where
    });

    ctx.body = result.map(m => {
      return {
        ...m.dataValues,
        productId: m.dataValues.product_id,
        skuCode: m.dataValues.sku_code,
        lowStock: m.dataValues.low_stock,
        promotionPrice: m.dataValues.promotion_price,
        lockStock: m.dataValues.lock_stock,
        spData: m.dataValues.sp_data
      }
    });
  },
  proEditSku: async (ctx) => {
    let pid = ctx.request.body.pid || 0;
    let stockList = ctx.request.body.stockList || [];

    if (pid > 0) {
      for (let i = 0, j = stockList.length; i < j; i++) {
        await ctx.orm().pms_sku_stock.update({
          product_id: stockList[i].productId,
          sku_code: stockList[i].skuCode,
          price: stockList[i].price,
          stock: stockList[i].stock,
          low_stock: stockList[i].lowStock,
          pic: stockList[i].pic,
          promotion_price: stockList[i].promotionPrice
        }, {
          where: {
            id: stockList[i].id,
            product_id: pid
          }
        });
      }
    }

    ctx.body = {};
  },
  proCreate: async (ctx) => {
    let data = ctx.request.body || {};

    let product = await ctx.orm().pms_product.create({
      brand_id: data.brandId,
      product_category_id: data.productCategoryId,
      feight_template_id: data.feightTemplateId,
      product_attribute_category_id: data.productAttributeCategoryId,
      name: data.name,
      pic: data.pic,
      product_sn: data.productSn,
      delete_status: data.deleteStatus,
      publish_status: data.publishStatus,
      new_status: data.newStatus,
      recommand_status: data.recommandStatus,
      verify_status: data.verifyStatus,
      sort: data.sort,
      sale: data.sale,
      price: data.price,
      promotion_price: data.promotionPrice,
      gift_growth: data.giftGrowth,
      gift_point: data.giftPoint,
      use_point_limit: data.usePointLimit,
      sub_title: data.subTitle,
      description: data.description,
      original_price: data.originalPrice,
      stock: data.stock,
      low_stock: data.lowStock,
      unit: data.unit,
      weight: data.weight,
      preview_status: data.previewStatus,
      service_ids: data.serviceIds,
      keywords: data.keywords,
      note: data.note,
      album_pics: data.albumPics,
      detail_title: data.detailTitle,
      detail_desc: data.detailDesc,
      detail_html: data.detailHtml,
      detail_mobile_html: data.detailMobileHtml,
      promotion_start_time: data.promotionStartTime ? data.promotionStartTime : null,
      promotion_end_time: data.promotionEndTime ? data.promotionEndTime : null,
      promotion_per_limit: data.promotionPerLimit,
      promotion_type: data.promotionType,
      brand_name: data.brandName,
      product_category_name: data.productCategoryName,
      min_sale_stock: data.minSaleStock,
      provider_id: data.providerId,
      provider_name: data.providerName,
      is_del: 0
    });

    if (product && product.id > 0 && data.skuStockList && data.skuStockList.length > 0) {
      data.skuStockList = handleSkuStockCode(product.id, data.skuStockList);

      let skus = data.skuStockList.map(m => {
        return {
          product_id: product.id,
          sku_code: m.skuCode,
          price: m.price,
          stock: m.stock,
          low_stock: m.lowStock,
          pic: m.pic,
          sale: 0,
          promotion_price: 0,
          lock_stock: 0,
          sp_data: m.spData
        }
      });
      await ctx.orm().pms_sku_stock.bulkCreate(skus);
    }

    if (product && product.id > 0 && data.productAttributeValueList && data.productAttributeValueList.length > 0) {
      let attrValues = data.productAttributeValueList.map(m => {
        return {
          product_id: product.id,
          product_attribute_id: m.productAttributeId,
          value: m.value
        }
      });
      await ctx.orm().pms_product_attribute_value.bulkCreate(attrValues);
    }

    if (product && product.id > 0 && data.productLadderList && data.productLadderList.length > 0) {
      let ladders = data.productLadderList.map(m => {
        return {
          product_id: product.id,
          count: m.count,
          discount: m.discount,
          price: m.price
        }
      });
      await ctx.orm().pms_product_ladder.bulkCreate(ladders);
    }

    if (product && product.id > 0 && data.productFullReductionList && data.productFullReductionList.length > 0) {
      let fullReductions = data.productFullReductionList.map(m => {
        return {
          product_id: product.id,
          full_price: m.fullPrice,
          reduce_price: m.reducePrice
        }
      });
      await ctx.orm().pms_product_full_reduction.bulkCreate(fullReductions);
    }

    if (product && product.id > 0 && data.subjectProductRelationList && data.subjectProductRelationList.length > 0) {
      let subjectProductRelations = data.subjectProductRelationList.map(m => {
        return {
          product_id: product.id,
          subject_id: m.subjectId
        }
      });
      await ctx.orm().cms_subject_product_relation.bulkCreate(subjectProductRelations);
    }

    if (product && product.id > 0 && data.prefrenceAreaProductRelationList && data.prefrenceAreaProductRelationList.length > 0) {
      let prefrenceAreaProductRelations = data.prefrenceAreaProductRelationList.map(m => {
        return {
          product_id: product.id,
          prefrence_area_id: m.prefrenceAreaId
        }
      });
      await ctx.orm().cms_prefrence_area_product_relation.bulkCreate(prefrenceAreaProductRelations);
    }

    if (product && product.id > 0 && data.memberPriceList && data.memberPriceList.length > 0) {
      let memberPrices = data.memberPriceList.map(m => {
        return {
          product_id: product.id,
          member_level_id: m.memberLevelId,
          member_price: m.memberPrice,
          member_level_name: m.memberLevelName
        }
      });
      await ctx.orm().pms_member_price.bulkCreate(memberPrices);
    }

    ctx.body = {};
  },
  proEdit: async (ctx) => {
    let data = ctx.request.body || {};

    await ctx.orm().pms_product.update({
      brand_id: data.brandId,
      product_category_id: data.productCategoryId,
      feight_template_id: data.feightTemplateId,
      product_attribute_category_id: data.productAttributeCategoryId,
      name: data.name,
      pic: data.pic,
      product_sn: data.productSn,
      delete_status: data.deleteStatus,
      publish_status: data.publishStatus,
      new_status: data.newStatus,
      recommand_status: data.recommandStatus,
      verify_status: data.verifyStatus,
      sort: data.sort,
      sale: data.sale,
      price: data.price,
      promotion_price: data.promotionPrice,
      gift_growth: data.giftGrowth,
      gift_point: data.giftPoint,
      use_point_limit: data.usePointLimit,
      sub_title: data.subTitle,
      description: data.description,
      original_price: data.originalPrice,
      stock: data.stock,
      low_stock: data.lowStock,
      unit: data.unit,
      weight: data.weight,
      preview_status: data.previewStatus,
      service_ids: data.serviceIds,
      keywords: data.keywords,
      note: data.note,
      album_pics: data.albumPics,
      detail_title: data.detailTitle,
      detail_desc: data.detailDesc,
      detail_html: data.detailHtml,
      detail_mobile_html: data.detailMobileHtml,
      promotion_start_time: data.promotionStartTime ? data.promotionStartTime : null,
      promotion_end_time: data.promotionEndTime ? data.promotionEndTime : null,
      promotion_per_limit: data.promotionPerLimit,
      promotion_type: data.promotionType,
      brand_name: data.brandName,
      product_category_name: data.product_category_name,
      min_sale_stock: data.minSaleStock,
      provider_id: data.providerId,
      provider_name: data.providerName,
      is_del: 0
    }, {
      where: {
        id: data.id
      }
    });

    data.skuStockList = handleSkuStockCode(data.id, data.skuStockList);

    // 删除SKU
    await ctx.orm().pms_sku_stock.destroy({
      where: {
        product_id: data.id
      }
    })

    // 新增SKU
    let skus = data.skuStockList.map(m => {
      return {
        product_id: data.id,
        sku_code: m.skuCode,
        price: m.price,
        stock: m.stock,
        low_stock: m.lowStock,
        pic: m.pic,
        sale: 0,
        promotion_price: 0,
        lock_stock: 0,
        sp_data: m.spData
      }
    });
    await ctx.orm().pms_sku_stock.bulkCreate(skus);
  },
  proEditVerifyStatus: async (ctx) => {
    let ids = ctx.request.body.ids || [];
    let verifyStatus = ctx.request.body.verifyStatus || 0;

    if (Array.isArray(ids)) {
      await ctx.orm().pms_product.update({
        verify_status: verifyStatus
      }, {
        where: {
          id: {
            $in: ids
          }
        }
      });
    } else {
      await ctx.orm().pms_product.update({
        verify_status: verifyStatus
      }, {
        where: {
          id: ids
        }
      });
    }

    ctx.body = {};
  },
}