var mysql=require('mysql');
var debug=require('debug')('blog:update');

//创建数据连接
exports.db=mysql.createConnection({
    host:'127.0.0.1',
    port:3306,
    database:'blogcrawler',
    user:'root',
    password:'123456'
});

exports.sinaBlog={
    url:'http://blog.sina.com.cn/liuxu28'
};