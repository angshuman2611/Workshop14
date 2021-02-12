var express = require('express');
var app = express();
var amqp = require('amqplib/callback_api');

const port = 3000;
// amqp.connect('amqp://localhost',(err,conn)=>{
//     conn.createChannel((err,ch) => {
//         var queue = 'First Queue'
        
//         ch.assertQueue(queue,{durable: true});
//         console.log(queue);
//         ch.consume(queue, (message) => {
//             console.log(message.content.toString());
//         },{
//             noAck: true
//         })   
//     });
   
// });

var args = process.argv.slice(2);
if(args.length == 0){
    console.log("Usage: receive_logs_topic.js <facility>.<severity>");
    process.exit(1);
}
amqp.connect('amqp://localhost',function(err,connection){
    if(err){
        throw err;
    }
    connection.createChannel(function(err1,channel){
        if(err1){
            throw err1
        }
var exchange = 'topic_logs'
channel.assertQueue(exchange,'topic',{
    durable: false
})
        channel.assertQueue('',{
            exclusive: true
          }, function(error2, q) {
            if (error2) {
              throw error2;
            }
            console.log(' [*] Waiting for logs. To exit press CTRL+C');
      
            args.forEach(function(key) {
              channel.bindQueue(q.queue, exchange, key);
            });
            channel.consume(q.queue, function(msg) {
                console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
              }, {
                noAck: true
              });
            });
          });
 });

app.listen(port);
