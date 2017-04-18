// Controller

var express = require('express');
var router = express.Router();
var user = require('../models/user');
var book = require('../models/book');
var borrowReserve = require('../models/borrowReserve');

// 메인 페이지
router.get('/main', function (req, res){
    book.slideBook(req, res);
});

// 회원 가입 처리
router.post('/register', function (req, res){
    user.register(req, res);
});

// 아이디 중복 처리
router.post('/checkId', function (req, res){
    user.checkId(req, res);
});

// 주민 등록 번호 중복 처리
router.post('/checkNo', function (req, res){
    user.checkNo(req, res);
});

// 아이디/비밀번호 찾기 처리
router.post('/findIdPw', function (req, res){
    user.findIdPw(req, res);
});

// 로그인 페이지
router.get('/login', function (req, res){
    var obj = {"userId":req.session.userId, "newBook":req.session.arr1, "bestBook":req.session.arr2};
    res.render('login.ejs', obj);
});

// 로그인 처리
router.post('/login', function (req, res){
    user.login(req, res);
});

// 로그아웃 처리
router.post('/logout', function (req, res) {
    user.logout(req, res);
});

// 비회원용 도서 검색 페이지
router.get('/searchUnauth', function (req, res){
    book.searchUnauth(req, res);
});

// 비회원용 도서 상세 보기 페이지
router.get('/searchDetailUnauth', function (req, res){
    book.searchDetailUnauth(req, res);
});

// 도서 검색 페이지
router.get('/search', function (req, res){
    book.search(req, res);
});

// 도서 상세 보기 페이지
router.get('/searchDetail', function (req, res){
    book.searchDetail(req, res);
});

// 공지사항 페이지
router.get('/notice', function (req, res){
    var obj = {"userId":req.session.userId};
    res.render('notice.ejs', obj);
});

// 맞춤형 추천 도서 페이지
router.get('/customize', function (req, res){
    var obj = {"userId":req.session.userId};
    res.render('customize.ejs', obj);
});

// 맞춤형 추천 도서 처리
router.post('/customizeResult', function (req, res){
    book.customizeResult(req, res);
});

// 대출 여부 확인
router.post('/checkBorrow', function (req, res){
    borrowReserve.checkBorrow(req, res);
});

// 예약 여부 확인
router.post('/checkReserve', function (req, res){
    borrowReserve.checkReserve(req, res);
});

// 대출/예약 현황 목록 페이지
router.get('/borrowReserve', function (req, res){
    borrowReserve.borrowReserve(req, res);
});

// 마이 페이지
router.get('/myPage', function (req, res){
    var obj = {"userId":req.session.userId, "userName":req.session.userName, "userTel":req.session.userTel, "userEmail":req.session.userEmail};
    res.render('myPage.ejs', obj);
});

// 마이 페이지 회원 정보 수정 처리
router.post('/myPage/update', function (req, res){
    user.update(req, res);
});

module.exports = router;
    

