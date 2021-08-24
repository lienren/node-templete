/*
 * @Author: Lienren
 * @Date: 2021-08-23 10:32:14
 * @LastEditTime: 2021-08-24 22:29:52
 * @LastEditors: Lienren
 * @Description: 
 * @FilePath: /node-templete/src/controllers/mall/sf.js
 * PRESENTED BY ROOT Tech R&D TEAM 2021-2026.
 */
'use strict';

const path = require('path');
const assert = require('assert');
const date = require('../../utils/date');
const http = require('../../utils/http');
const crypto = require('crypto');

const appId = '587875977136877568';
const sk = '2940e174ecd28008e77a9de4702af391';
const url = 'https://butler-dev.sit.sf-express.com';

function genSign (data, now) {
  let sign = `${data}&sk=${sk}&timestamp=${now}`

  const hash = crypto.createHash('sha512');
  const digest = hash.update(sign, "utf8").digest();
  let hex = digest.toString('base64');
  hex = hex.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '').trim();

  return hex;
}

module.exports = {
  submitOrder: async (ctx) => {
    let userId = ctx.request.body.userId || 0;
    let customId = ctx.request.body.customId || '';
    let sendStartTime = ctx.request.body.sendStartTime || '';
    let jContact = ctx.request.body.jContact || '';
    let jTel = ctx.request.body.jTel || '';
    let jProvince = ctx.request.body.jProvince || '';
    let jCity = ctx.request.body.jCity || '';
    let jRegion = ctx.request.body.jRegion || '';
    let jAddress = ctx.request.body.jAddress || '';
    let dContact = ctx.request.body.dContact || '';
    let dTel = ctx.request.body.dTel || '';
    let dProvince = ctx.request.body.dProvince || '';
    let dCity = ctx.request.body.dCity || '';
    let dRegion = ctx.request.body.dRegion || '';
    let dAddress = ctx.request.body.dAddress || '';
    let payMethod = ctx.request.body.payMethod || '0';  // 寄付月结
    let depositumInfo = ctx.request.body.depositumInfo || '文件';
    let depositumNo = ctx.request.body.depositumNo || 1;
    let remark = ctx.request.body.remark || '';

    let orderId = 'CRRC' + date.getTimeStamp() + (Math.round(Math.random() * 1000000)).toString();
    let custid = '9999999999';
    let companyId = appId;
    let packagesNo = '1';
    let expressType = '1';  // 特快


    let dataSign = `{"companyId":"${companyId}","sendStartTime":"${sendStartTime}","jContact":"${jContact}","jTel":"${jTel}","jAddress":"${jAddress}","dContact":"${dContact}","dTel":"${dTel}","dAddress":"${dAddress}","custid":"${custid}","payMethod":"${payMethod}","expressType":"${expressType}","remark":"${remark}","depositumInfo":"${depositumInfo}","depositumNo":"${depositumNo}"}`;
    let now = date.getTimeStamp();
    let sign = genSign(dataSign, now);

    let result = await http.post({
      url: `${url}/public/order/v1/placeOrder`,
      data: dataSign,
      headers: {
        sendAppId: appId,
        timestamp: now,
        sign: sign,
        'Content-Type': 'application/json;charset=utf-8'
      }
    })

    if (result && result.data && result.data.result && result.data.succ === 'ok' && result.data.result.mailno) {
      // 下单成功
      console.log('result.data:', result.data)
      let resultData = result.data.result;

      await ctx.orm().exp_info.create({
        orderId: orderId,
        userId: userId,
        customId: customId,
        sendStartTime: sendStartTime,
        jContact: jContact,
        jMobile: jTel,
        jProvince: jProvince,
        jCity: jCity,
        jRegion: jRegion,
        jAddress: jAddress,
        dContact: dContact,
        dMobile: dTel,
        dProvince: dProvince,
        dCity: dCity,
        dRegion: dRegion,
        dAddress: dAddress,
        custid: custid,
        payMethod: payMethod,
        expressType: expressType,
        packagesNo: packagesNo,
        depositumInfo: depositumInfo,
        depositumNo: depositumNo,
        remark: remark,
        companyId: companyId,
        mailno: resultData.mailno,
        extData: JSON.stringify(resultData)
      })
    } else {
      // 下单失败
      console.log('result.data:', result.data)
      assert.ok(false, result.data.msg)
    }
  }
}