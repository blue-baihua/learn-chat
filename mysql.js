const mysql=require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'node'
});
connection.connect();
//监测断开 重新链接
connection.on('error', function (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        connection.connect();
    } else {
        throw err;
    }
});
//查询
exports.select= function(sql){
    return new Promise((resolve,reject)=>{
          connection.query(sql,function (err,result) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                reject(err);
            }
              resolve(result);
        });
    });
}
//插入
//var  addSql = 'INSERT INTO websites(Id,name,url,alexa,country) VALUES(0,?,?,?,?)';
//var  addSqlParams = ['菜鸟工具', 'https://c.runoob.com','23453', 'CN'];
exports.insert= function(table,field,type,val){
  return new Promise((resolve,reject)=>{
      let addSqlParams=val.toString()
      let addSql="INSERT INTO "+table +"( "+field.toString()+ ") VALUES (" +type+ ");";
        connection.query(addSql,addSqlParams, function (err, result) {
          if(err){
              console.log('[INSERT ERROR] - ',err.message);
              reject(err);
          }else{
              resolve(result.insertId)
          }
      })
    })
}
//更新
//var modSql = 'UPDATE websites SET name = ?,url = ? WHERE Id = ?';
//var modSqlParams = ['菜鸟移动站', 'https://m.runoob.com',6];
exports.update=  function(table,sql,modSqlParams){
    let  modSql="UPDATE "+table+" "+sql;
    return new Promise((resolve,reject)=>{
         connection.query(modSql,modSqlParams,function (err, result) {
            if(err){
                console.log('[UPDATE ERROR] - ',err.message);
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
}
