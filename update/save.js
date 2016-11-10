var async=require('async');
var db=require('../config').db;
var debug=require('debug')('blog:update:save');

/**
 * 保存文章分类
 *
 * @param {Object} list
 * @param {Function} callback*/
exports.classList=function (list, callback) {
   debug('保存文章分类列表到数据库中:%d',list.length);

    async.eachSeries(list,function (item, next) {
        //查询分类是否存在
        db.query("SELECT * FROM 'class_list' WHERE 'id'=? LIMIT 1 ",[item.id],function (err, data) {
            if(err)
                return next(err);
            if(Array.isArray(data) && data.length>=1){
                //分类已存在 ，更新
                db.query("UPDATE 'class_list' SET 'name'=? ,'url'=? WHERE 'id'=?  ",[item.name,item.url,item.id],next);
            }else{
                //分类不存在 ，添加
                db.query("INSERT INTO 'class_list' ('id','name','url') VALUES (?,?,?)",[item.id,item.name,item.url],next);
            }
        });
    },callback);
    //保存class_list
};

/**保存文章列表
 *
 * @param{Number} class_id
 * @param{Array} list
 * @param{Function} callback
 * */
exports.articleList=function (class_id, list, callback) {
   debug('保存文章列表到数据库中：%d,%d',class_id,list.length);

    async.eachSeries(list,function (item, next) {
        db.query  ("SELECT * FROM 'article_list' WHERE 'id'=? AND 'class_id'=? LIMIT 1  ",[item.id,class_id],function (err, data) {
            if(err)
                return next(err);

            //发布时间转成时间戳
            var create_time=new Date(item.time).getTime()/1000;

            if(Array.isArray(data) && data.length>=1){
                //分类存在，更新
                db.query("UPDATE 'article_list' SET 'title'=?,'url'=?,'class_id'=?,'create_time'=? WHERE 'id'=? AND 'class_id'=? ",
                [item.title,item.url,class_id,create_time,item.id,class_id],next);
            }else{
                //分类不存在，添加
                db.query("INSERT INTO 'article_list' ('id','title','url','class_id','create_time') VALUES(?,?,?,?,?)",
                [item.id,item.title,item.url,class_id,create_time],next);
            }

        });
    },callback);
    //articleList
};

/**
 * 保存文章分类文章数量
 *
 * @param{Number} class_id
 * @param{Number} count
 * @param{Function| callback*/
exports.articleCount=function (class_id, count, callback) {
    debug('保存文章分类的文章数量：%d,%d',class_id,count);

    db.query("UPDATE 'class_list' SET 'count'=? WHERE 'id'=? ",[count,class_id],callback);
};

/**
 * 保存文章标签
 *
 * @param {String} id
 * @param {Array} tags
 * @param {function} callback*/
exports.articleTags=function (id,tags,callback) {
    debug('保存文章标签:%s,%s',id,tags);

    //删除旧标签
    db.query("DELETE FROM 'article_tag' WHERE 'id'=? ",[id],function (err) {
        if(err)
            return callback(err);
        if(tags.length>0){
            //添加新标签信息
            //sql代码
            var values=tags.map(function (tags) {
                return '('+db.escape(id)+','+db.escape(tags)+')';

            }).join(',');

            db.query("INSERT INTO 'article_tags' ('id','tags') VALUES   "+values,callback);
        }else{
            //如果无标签，直接返回
            callback(null);
        }
    });
    //articleTags
};