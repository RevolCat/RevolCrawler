var request=require('request');
var cheerio=require('cheerio');
var mysql=require('mysql');
var debug=require('debug')('blog:update');

//创建数据连接
var db=mysql.createConnection({
    host:'127.0.0.1',
    port:3306,
    database:'blogcrawler',
    user:'root',
    password:'123456'
});

//显示所有表
db.query('show tables',function (err, tables) {
    if(err){
        console.error(err.stack);
    }else{
        console.log(tables);
    }

    db.end();
});


/**
 * 保存文章分类
 * @param {Object} data
 * @param{Function} callback
 * */
function saveClassItem(data, callback) {
    //查询分类是否存在
    db.query("SELECT * FROM 'class_list' WHERE 'id'=? LIMIT 1 ",[data.id],function (err) {
        if(err)
            return next(err);
        if(Array.isArray(data)&& data.length>=1){
            //分类存在， 更新
            db.query("UPDATE 'class_list'  SET 'name'=?  WHERE 'id'=?  ",[data.name,data.url,data.id],callback);
        }else{
            //分类不存在，添加
            db.query("INSERT INTO 'class_list' ('id', 'name', 'url') VALUES(?,?,?)  ",[data.id,data.name,data.url],callback);
        }
    });
}

