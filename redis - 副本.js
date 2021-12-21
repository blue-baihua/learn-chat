const redis = require('redis');
const client = redis.createClient({
    url: 'redis://:123456@192.168.3.132:6379'
})
client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();
//字符串
exports.setVal = async function(name,str,time){
    if(time>0){
        return   await client.setEx(name,time,str);
    }else{
        return  await client.set(name,str);
    }
};
exports.getVal= async function(name){
    return await client.get(name);
};
//哈希
exports.hSetVal=function(key,field,val){
    return client.HSET(key,field,val);
}
exports.hGetVal=function(key){
    return client.hGetAll(key);//{ field1: 'value1', field2: 'value2' }
}
//有序集合
exports.zSetVal=function(name,num,val){
    return client.zAdd(name, {score: num, value:val})
}
/*
await client.multi()
.zAdd('key', { score: 1, value: 'value' })
.zAdd('key', [{ score: 1, value: '1' }, { score: 2, value: '2' }])
 .exec()*/