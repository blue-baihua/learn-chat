const express = require('express');
const app = express();
const http = require('http'); //载入 http 模块，并将实例化的 HTTP 赋值给变量 http
const server = http.createServer(app);
const cors = require('cors')
const {Server} = require("socket.io");
const redis=require('./redis');
const mysql=require('./mysql');
(async ()=>{
    //获取MYSQL插入 ID
    let insert_id;
    await mysql.insert('test',['name','add_date'],'?,'+Date.parse(new Date()),['baihua']).then((res=>{
        insert_id=res;
    })).catch((err=>{
        console.log(err);
    }));
    console.log('mysql 数据库插入ID:'+insert_id);
    //MYSQL 查询数据
    let query_data;
    await mysql.select("select * from test").then((res=>{query_data=res})).catch((err=>{console.log(err)}));
    console.log(query_data);
    //MYSQL 更新数据
      let mysql_update;
      await mysql.update('test','set name=? where id=?',['joy',5]).then((res=>{mysql_update=res})).catch((err=>{console.log(err)}));
      console.log(mysql_update);
      await mysql.select("select * from test").then((res=>{query_data=res})).catch((err=>{console.log(err)}));
       console.log(query_data);
    //REDIS设置字符串值
    let set_str_res;
   await  redis.setVal('name2','123',1000).then((res=>{
       set_str_res=res;
    }));
    console.log('REDIS SET结果:'+set_str_res);
    //获取REDIS 字符串值
    var redis_str_val;
    await redis.getVal('name2').then((res=>{
        redis_str_val=res;
    }));
    console.log('name2值:'+redis_str_val);
    //有序集合设置值
    let zset_res;
    await redis.zSetVal('color',1236,'pear').then((res=>{
        zset_res=res;
    }))
    console.log('REDIS ZADD结果:'+set_str_res);
})();
const io = new Server(server, {
    //支持跨域请求
    cors: {
            origin: "ws://localhost:3000",
            methods: ["GET", "POST"],
    }
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {  //连接事件
    console.log('num:'+io.engine.clientsCount);//当前连接的客户端数量
    console.log('a user connected');
    console.log('token:'+socket.handshake.auth.token);//读取客户端发送过来的TOKEN
    //绑定事件
    socket.on('chat message', (msg) => {  //与客户端绑定事件名称对应   chat message
            console.log('message: ' + msg);
            console.log('socket_id: ' + socket.id);
            io.emit('chat message', msg);//向所有人发送信息
        });
    //绑定事件
        socket.on('ferret',(name) => {  //与客户端绑定事件名称对应   ferret
            console.log('name: ' + name);
            socket.join(name);
            // fn("woot");
            io.to(name).emit('ferret','hi-'+name);//发送指定房间
            io.emit('ferret','ALL'+name);//向所有人发送
            // });
        });
    //断开链接
    socket.on('disconnect', () => {
        console.log('user disconnected：'+socket.id);
    });
    });
const port = 3000;
server.listen(port, () => {
    console.log('listening on *:'+port);
});