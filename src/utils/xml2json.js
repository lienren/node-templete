/*
 * @Author: Lienren 
 * @Date: 2018-05-18 17:09:14 
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-06-20 12:37:20
 */
'use strict';

const xml2js = require('xml2js');

module.exports = {
  // Xml转Json
  xml2json: xml => {
    return new Promise((resolve, reject) => {
      let parser = new xml2js.Parser({ explicitArray: false });
      parser.parseString(xml, (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  // Json转Xml
  json2xml: ({ json = {}, config = {} }) => {
    return new Promise((resolve, reject) => {
      var builder = new xml2js.Builder(config);
      var xml = builder.buildObject(json);
      resolve(xml);
    });
  }
};
