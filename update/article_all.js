var request=require('request');
var cheerio=require('cheerio');
var async=require('async');
var debug=require('debug')('blog:update');
/**
 * 获取分类页面博文列表
 *
 * @param {String} url
 * @param {Function} callback
 * */
function readArticleList(url,callback) {
    debug('读取博文列表:%s',url);

    request(url,function (err, res) {
        if(err)
            return callback(err);

        //根据网页内容创建DOM 操作对象
        var $ =cheerio.load(res.body.toString());

        //读取博文列表
        var articleList=[];
        $('.articleList .articleCell').each(function () {
            var $me = $(this);
            var $title = $me.find('.atc_title a');
            var $time=$me.find('.atc_tm');
            var item = {
                title:$title.text().trim(),
                url: $title.attr('href'),
                time:$time.text().trim()
            };

            //从URL中提取文章ID   exm:     href="http://blog.sina.com.cn/s/blog_69e72a420101gcva.html"
            var  s = item.url.match(/blog_([a-zA-Z0-9]+)\.html/);
            if(Array.isArray(s)){
                item.id=s[1];
                articleList.push(item);
            }
        });

        callback(null,articleList);
    });
}

/***
 * 获取博文页面内容
 *
 * @param {String} url
 * @param {Function} callback
 * */
function readArticleDetail(url, callback) {
    debug('读取博文内容：%s',url);
    request(url,function (err,res) {
        if(err)
            return callback(err);

        //根据网页内容创建DOM操作对象
        var $=cheerio.load(res.body.toString());

        //获取文章标签
        var tags=[];
        $('.blog_tag h3 a').each(function () {
            var tag=$(this).text().trim();
            if(tag){
                tags.push(tag);
            }
        });

        //获取文字内容
        var content=$('.articalContent').html().trim();

        //输出结果
     callback(null,{
         tags:tags,
         content:content
     });
    });

}

//读取分类下的所有文章
readArticleList('http://blog.sina.com.cn/s/articlelist_1776757314_0_1.html',function (err, articleList) {
    if(err)
        return console.error(err.stack);
    //依次去除articleList数组的每个元素，调用第二个参数中传入的参数
    //函数的第一个参数  articleList数组中的第一个元素
    //第二个参数是回调函数
    async.eachSeries(articleList,function (article,next) {
        //读取文章内容
        readArticleDetail(article.url,function (err, detail) {
            if(err)
                console.error(err.stack);

            //直接显示
            console.log(detail);
            //调用next（）来返回
            next();

        });
    },function (err) {
        //遍历玩artiList，执行此函数
        if(err)
            return console.error(err.stack);
        console.log("ALL OVER");
    });
});

