// borrowReserve.js : borrowReserveDAO

var pool = require('./db').pool;
var ejs = require('ejs');

// 대출 여부 확인
function checkBorrow(req, res){
    var bookNo = req.param('bookNo');
    pool.getConnection(function(err, con){
        if(err) {
            console.error('err', err);
        }
        var sql = 'select count(*) cnt from borrow br, book bk where br.bkNo = bk.bkNo and br.bkNo = ?';
        con.query(sql, [bookNo], function(err, result){
            res.send(200, JSON.stringify(result[0].cnt));
        });
        con.release;
    });
}

// 예약 여부 확인
function checkReserve(req, res){
    var bookNo = req.param('bookNo');
    pool.getConnection(function(err, con){
        if(err) {
            console.error('err', err);
        }
        var sql = 'select count(*) cnt from reserve rs, book bk where rs.bkNo = bk.bkNo and rs.bkNo = ?';
        con.query(sql, [bookNo], function(err, result){
            res.send(200, JSON.stringify(result[0].cnt));
        });
        con.release;
    });
}

// 대출/예약 현황 목록
function borrowReserve(req, res){
    var userNo = req.session.userNo;
    pool.getConnection(function(err, con){
        if(err){
            console.error('err', err);
        }
        var sql = 'select bk.bkNo AS bkNo, bk.bkName AS bkName, DATE_FORMAT(br.brBDate, "%Y-%m-%d") AS brBDate, DATE_FORMAT(br.brRDate, "%Y-%m-%d") AS brRDate from book bk, user us, borrow br where us.userNo = br.userNo and bk.bkNo = br.bkNo and us.userNo = ?';
        con.query(sql, [req.session.userNo], function(err, result1){
            var sql = 'select bk.bkNo AS bkNo, bk.bkName AS bkName, DATE_FORMAT(rs.rsRDate, "%Y-%m-%d") AS rsRDate from book bk, user us, reserve rs where us.userNo = rs.userNo and bk.bkNo = rs.bkNo and us.userNo = ?';
            con.query(sql, [req.session.userNo], function(err, result2){
                var sql = 'delete from borrow br where br.userNo = ? and br.bkNo = ?, SYSDATE() = DATE_ADD(br.brRDate, INTERVAL 1 DAY)';
                con.query(sql, [req.session.userNo], function(err){
                    var sql = 'delete from reserve rs where rs.userNo = ? and SYSDATE() = DATE_ADD(rs.rsRDate, INTERVAL 1 DAY)';
                    con.query(sql, [req.session.userNo], function(err){
                        res.render('borrowReserve.ejs', {"userId":req.session.userId, "borrow":JSON.parse(JSON.stringify(result1)), "reserve":JSON.parse(JSON.stringify(result2))});
                    });
                });
            });
        });
        con.release;
    });
}

module.exports.checkBorrow = checkBorrow;
module.exports.checkReserve = checkReserve;
module.exports.borrowReserve = borrowReserve;

