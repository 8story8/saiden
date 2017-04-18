// book.js : BookDAO

var pool = require('./db').pool;
var ejs = require('ejs');

// 신작 도서, 베스트 도서 처리
function slideBook(req, res){
    pool.getConnection(function(err, con){
        if(err){
            console.error('err', err);
        }
        var sql = 'select bkNo, bkName from book where bkPubDate like ?';
        con.query(sql, [2017 + '%'], function(err, result1){
            var tempArr1 = new Array();
            var temp1;
            var rnum1;
            var arr1 = new Array();
            for(var i = 0; i < JSON.parse(JSON.stringify(result1)).length; i++){
                tempArr1.push(JSON.parse(JSON.stringify(result1))[i]);
            }
            for(var i = 0; i < JSON.parse(JSON.stringify(result1)).length; i++){
                rnum1 = Math.floor(Math.random()*(JSON.parse(JSON.stringify(result1)).length-1));
                temp1 = tempArr1[i];
                tempArr1[i] = tempArr1[rnum1];
                tempArr1[rnum1] = temp1;
            }
            for(var i = 0; i < 5; i++){
                arr1.push(tempArr1[i]);
            }
            var sql = 'select bkNo, bkName from book where bkPrefer > ?';
            con.query(sql, [7], function(err, result2){
                var tempArr2 = new Array();
                var temp2;
                var rnum2;
                var arr2 = new Array();
                for(var i = 0; i < JSON.parse(JSON.stringify(result2)).length; i++){
                    tempArr2.push(JSON.parse(JSON.stringify(result2))[i]);
                }
                for(var i = 0; i < JSON.parse(JSON.stringify(result2)).length; i++){
                    rnum2 = Math.floor(Math.random()*(JSON.parse(JSON.stringify(result2)).length-1));
                    temp2 = tempArr2[i];
                    tempArr2[i] = tempArr2[rnum2];
                    tempArr2[rnum2] = temp2;
                }
                for(var i = 0; i < 5; i++){
                    arr2.push(tempArr2[i]);
                }
                res.render('main.ejs', {"newBook":arr1, "bestBook":arr2});
            });
        });
        con.release;
    });
}

// 비회원용 도서 검색 처리
function searchUnauth(req, res){
    var bookInfo = req.param("bookInfo");
    pool.getConnection(function(err, con){
        if(err){
            console.error('err', err);
        }
        var sql = 'select bkNo, bkName, bkAuth, bkPub, DATE_FORMAT(bkPubdate, "%Y-%m-%d") AS bkPubdate, bkGenre, bkPrefer from book where bkName like ? or bkAuth like ? or bkPub like ?';
        con.query(sql, [bookInfo.substring(0, 2)+'%', bookInfo.substring(0, 2)+'%', bookInfo.substring(0, 2)+'%'], function(err, result){
            var obj = {"bookInfo":JSON.parse(JSON.stringify(result))};
            res.render('searchUnauth.ejs', obj);
        });
        con.release;
    });
}

// 비회원용 도서 상세 보기 처리
function searchDetailUnauth(req, res){
    var bookNo = req.param("bookNo");
    pool.getConnection(function(err, con){
        if(err){
            console.error('err', err);
        }
        var sql = 'select bkNo, bkName, bkAuth, bkPub, DATE_FORMAT(bkPubDate, "%Y-%m-%d") AS bkPubDate, bkGenre, bkPrefer from book where bkNo = ?';
        con.query(sql, [bookNo], function(err, result1){
            var sql = 'select count(*) cnt from borrow br where br.bkNo = ?';
            con.query(sql, [bookNo], function(err, result2){
                var obj = {"bookDetail":JSON.parse(JSON.stringify(result1)), "brCnt":JSON.parse(JSON.stringify(result2[0].cnt))};
                res.render('searchDetailUnauth.ejs', obj);
            });
        });
        con.release;
    });
}

// 도서 검색 처리
function search(req, res){
    var bookInfo = req.param("bookInfo");
    pool.getConnection(function(err, con){
        if(err){
            console.error('err', err);
        }
        var sql = 'select bkNo, bkName, bkAuth, bkPub, DATE_FORMAT(bkPubdate, "%Y-%m-%d") AS bkPubdate, bkGenre, bkPrefer from book where bkName like ? or bkAuth like ? or bkPub like ?';
        con.query(sql, [bookInfo.substring(0, 2)+'%', bookInfo.substring(0, 2)+'%', bookInfo.substring(0, 2)+'%'], function(err, result){
            var obj = {"userId":req.session.userId, "bookInfo":JSON.parse(JSON.stringify(result))};
            res.render('search.ejs', obj);
        });
        con.release;
    });
}

// 도서 상세 보기 처리
function searchDetail(req, res){
    var bookNo = req.param("bookNo");
    pool.getConnection(function(err, con){
        if(err){
            console.error('err', err);
        }
        var sql = 'select bkNo, bkName, bkAuth, bkPub, DATE_FORMAT(bkPubDate, "%Y-%m-%d") AS bkPubDate, bkGenre, bkPrefer from book where bkNo = ?';
        con.query(sql, [bookNo], function(err, result1){
            var sql = 'select count(*) cnt from borrow br where br.bkNo = ?';
            con.query(sql, [bookNo], function(err, result2){
                var obj = {"userId":req.session.userId, "bookDetail":JSON.parse(JSON.stringify(result1)), "brCnt":JSON.parse(JSON.stringify(result2[0].cnt))};
                res.render('searchDetail.ejs', obj);
            });
        });
        con.release;
    });
}

// 맞춤형 추천 도서 처리
function customizeResult(req, res){
    var customizeResult = req.param('check');
    pool.getConnection(function(err, con){
        if(err){
            console.error('err', err);
        }
        var sql = 'select bkNo, bkName, bkAuth, bkPub, DATE_FORMAT(bkPubDate, "%Y-%m-%d") AS bkPubDate, bkGenre, bkPrefer from book where bkGenre= ? and bkPrefer > 7 order by bkPrefer desc';
        con.query(sql, [customizeResult], function(err, result){
            var tempArr = new Array();
            var temp;
            var rnum;
            var arr = new Array();
            for(var i = 0; i < JSON.parse(JSON.stringify(result)).length; i++){
                tempArr.push(JSON.parse(JSON.stringify(result))[i]);
            }
            for(var i = 0; i < JSON.parse(JSON.stringify(result)).length; i++){
                rnum = Math.floor(Math.random()*(JSON.parse(JSON.stringify(result)).length-1));
                temp = tempArr[i];
                tempArr[i] = tempArr[rnum];
                tempArr[rnum] = temp;
            }
            for(var i = 0; i < 3; i++){
                arr.push(tempArr[i]);
            }
            res.send(200, JSON.parse(JSON.stringify(arr)));
        });
        con.release;
    });
}

module.exports.slideBook = slideBook;
module.exports.searchUnauth = searchUnauth;
module.exports.searchDetailUnauth = searchDetailUnauth;
module.exports.search = search;
module.exports.searchDetail = searchDetail;
module.exports.customizeResult = customizeResult;


