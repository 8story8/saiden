// user.js : UserDAO

var pool = require('./db').pool;
var ejs = require('ejs');

// 아이디 중복 처리
function checkId(req, res){
    var ruserId = req.param('ruserId');
    pool.getConnection(function(err, con){
        if(err){
            console.error('err', err);
        }
        var sql = 'select count(*) dupFlag from user where userId = ?';
        con.query(sql, [ruserId], function(err, result){
            var dupFlag = result[0].dupFlag;
            if(dupFlag == 1){
                res.send(200, dupFlag);
            }
            else{
                res.send(200, dupFlag);
            }
        });
        con.release;
    });
}

// 주민 등록 번호 중복 처리
function checkNo(req, res){
    var ruserNo = req.param('ruserNo');
    pool.getConnection(function(err, con){
        if(err){
            console.error('err', err);
        }
        var sql = 'select count(*) dupFlag from user where userNo = ?';
        con.query(sql, [ruserNo], function(err, result){
            var dupFlag = result[0].dupFlag;
            if(dupFlag == 1){
                res.send(200, dupFlag);
            }
            else{
                res.send(200, dupFlag);
            }
        });
        con.release;
    });
}

// 아이디/비밀번호 찾기 처리
function findIdPw(req, res){
    var cuserName = req.param('cuserName');
    var cuserNo = req.param('cuserNo');
    var cuserTel = req.param('cuserTel');
    var cuserEmail = req.param('cuserEmail');
    pool.getConnection(function(err, con){
        if(err){
            console.error('err', err);
        }
        var sql = 'select userId, userPw from user where userName = ? and userNo = ? and userTel = ? and userEmail = ?';
        con.query(sql, [cuserName, cuserNo, cuserTel, cuserEmail], function(err, result){
            if(result[0] != null){
                res.json(200, result[0]);
            }
            else
            {
                res.json(200, "null");
            }
        });
        con.release;
    });
}

// 회원가입 처리
function register(req, res){
    var ruserId = req.body.ruserId;
    var ruserPw = req.body.ruserPw;
    var ruserPwc = req.body.ruserPwc;
    var ruserName = req.body.ruserName;
    var ruserNo = req.body.ruserNo;
    var ruserTel = req.body.ruserTel;
    var ruserEmail = req.body.ruserEmail;
    pool.getConnection(function(err, con){
        if(err){
            console.error('err', err);
        }
        var sql = 'insert into user values(?, ?, ?, ?, ?, ?);';
        con.query(sql, [ruserId, ruserPw, ruserName, ruserNo, ruserTel, ruserEmail], function(err){
            res.redirect('/main');
        });
        con.release;
    });
}

// 로그인 처리
function login(req, res){
    var userId = req.body.userId;
    var userPw = req.body.userPw;
    pool.getConnection(function(err, con){
        if(err){
            console.error('err', err);
        }
        var sql = 'select count(*) flag, userName, userTel, userEmail, userNo from user where userId = ? and userPw = ?';
        con.query(sql, [userId, userPw], function(err, result){
            var flag = result[0].flag;
            var userName = result[0].userName;
            var userTel = result[0].userTel;
            var userEmail = result[0].userEmail;
            var userNo = result[0].userNo;
            if(flag == 1){
                req.session.userId = userId;
                req.session.userName = userName;
                req.session.userTel = userTel;
                req.session.userEmail = userEmail;
                req.session.userNo = userNo;
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
                        req.session.arr1 = arr1;
                        req.session.arr2 = arr2;
                        res.redirect('/login');
                    });
                });
            }
            else{
                res.redirect('/main');
            }
        });
        con.release;
    });
}

// 로그아웃 처리
function logout(req, res){
    req.session.destroy(function(err){
        if(err){
            console.error('err', err);
        }
        else{
            res.redirect('/main');
        }
    });
}

// 마이 페이지 회원 정보 수정 처리
function update(req, res){
    var iPw = req.body.iPw;
    var iTel = req.body.iTel;
    var iEmail = req.body.iEmail;
    pool.getConnection(function(err, con){
        if(err){
            console.error('err', err);
        }
        var sql = 'update user set userPw = ?, userTel =?, userEmail = ? where userId = ?';
        con.query(sql, [iPw, iTel, iEmail, req.session.userId], function(err, result){
            req.session.userTel = iTel;
            req.session.userEmail = iEmail;
            res.redirect('/myPage');
        });
        con.release;
    });
}

module.exports.login = login;
module.exports.logout = logout;
module.exports.register = register;
module.exports.checkId = checkId;
module.exports.checkNo = checkNo;
module.exports.findIdPw = findIdPw;
module.exports.update = update;



