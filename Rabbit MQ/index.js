var express = require('express');
var app = express();
var amqp = require('amqplib/callback_api');


const port = 5100;

// amqp.connect('amqp://localhost',(err,conn)=>{
//     conn.createChannel((err,ch) => {
//         var queue = 'First Queue'
//         var message = 'Angshuman';
//         ch.assertQueue(queue,{durable: true});
//         ch.sendToQueue(queue,Buffer.from(message),{
//             persistent:true
//         });
//         console.log("Message was sent");     
//     });
//     setTimeout(()=>{
//         conn.close();
//         process.exit(0);
//     },500);
// });

amqp.connect('amqp://localhost',function(err,connection){
    if(err){
        throw err;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
          throw error1;
        }
        var exchange = 'topic_logs';
        var args = process.argv.slice(2);
        var key = (args.length > 0) ? args[0] : 'anonymous.info';
        var msg = args.slice(1).join(' ') || 'Hello World!';
    
        channel.assertExchange(exchange, 'topic', {
          durable: false
        });
        channel.publish(exchange, key, Buffer.from(msg));
        console.log(" [x] Sent %s:'%s'", key, msg);
      });
setTimeout(function(){
    connection.close();
    process.exit(0);
},500);
})
app.listen(port);