/*
 * @Author: Lienren 
 * @Date: 2018-07-19 17:10:35 
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-12-13 23:58:08
 */
('use strict');

const config = require('../config.js');
const amqp = require('amqplib');
var when = require('when');

module.exports = {
  // 设置数据
  set: (exchangeName, exchangeType, queueName, routingKey, val, deliveryMode = 2, durable = false) => {
    return new Promise((resolve, reject) => {
      amqp
        .connect(config.rebitmq)
        .then(function(conn) {
          return when(
            conn.createChannel().then(function(channel) {
              val = typeof val === 'object' ? JSON.stringify(val) : val;

              // 创建Queue
              return channel.assertQueue(queueName, { durable: durable }).then(_qok => {
                // 创建Exchange
                return channel.assertExchange(exchangeName, exchangeType).then(_ok => {
                  // 绑定Queue与Exchange关系
                  return channel
                    .bindQueue(queueName, exchangeName, routingKey, {
                      'x-queue-mode': 'lazy'
                    })
                    .then(_bind => {
                      console.log('_bind:', _bind);

                      // 发送消息
                      let result_publish = channel.publish(exchangeName, routingKey, new Buffer.from(val), {
                        persistent: true
                      });

                      console.log('result_publish:', result_publish);

                      return channel.close();
                    });
                });
              });
            })
          ).ensure(function() {
            conn.close();
            resolve(true);
          });
        })
        .then(null, console.warn);
    });
  }
};
