var express = require('express');
var app = express();
var amqp = require('amqplib/callback_api');

const port = 3200;
amqp.connect('amqp://localhost',(err,conn)=>{
    conn.createChannel((err,ch) => {
        var queue = 'First Queue'
        
        ch.assertQueue(queue,{durable: true});
        console.log(queue);
        ch.consume(queue, (message) => {
            console.log(message.content.toString());
        },{
            noAck: true
        })   
    });
   
});
app.listen(port);
