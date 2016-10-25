var async=require('async');
var debug=require('debug')('myapp:main');
debug("现在时间是 %s",new Date());
/*
async.series([
    function (done) {
        console.log(1);
        done();
    },
    function (done) {
        console.log(2);
     //   done(new Error('错啦'));
    },
    function (done) {
        console.log(3);
        done();
    }
],    function (err) {
   if(err) throw err;
    console.log("done");
});*/

//并行执行一组函数    async.parallel()

var arr=[1,2,3,4,5];
async.each(arr,function (item, done) {
    setTimeout(function () {
        console.log(item);
        done();
    },Math.random()*1000);
},function (err) {
    if(err) throw err;
    console.log("DONE...............");
});