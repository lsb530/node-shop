var express = require('express'), http = require('http'), path = require('path');
var bodyParser = require('body-parser'), cookieParser = require('cookie-parser'),
    staticServer = require('serve-static'), errorHandler = require('errorhandler');
var expressErrorHandler = require('express-error-handler');
var expressSession = require('express-session');
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// public 폴더를 staticServer으로 오픈
app.use('/public', staticServer(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));
var router = express.Router();
var users = [
    {
        id: 1,
        name: 'Hyun'
    },
    {
        id: 2,
        name: 'Alice'
    },
    {
        id: 3,
        name: 'Kelly'
    }
];

app.use(function(req, res, next) {
    console.log('첫 번째 미들웨어 호출됨');
    res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
    res.write('접속성공! 그리고 변경 완료...ㅎㅎ');
    res.end();
});

// 라우팅 함수 등록
router.route('/process/login').post(function(req, res) {
    console.log('/process/login 처리함.');
    
    var paramId = req.body.id || req.query.id; // get방식일때랑 post방식일때 둘다 처리
    var paramPassword = req.body.password || req.query.password;
    
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버에서 응답한 결과입니다.</h1>');
    res.write('<div><p>Param Id : ' + paramId + '</p></div>');
    res.write('<div><p>Param password : ' + paramPassword + '</p></div>');
    res.write("<br><br><a href='/public/login2.html'>로그인 페이지로 돌아가기</a>");
    res.end();
});

app.get('/api/users', function(req, res) {
    res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
    res.write('hello'+users);
    res.end();
});



//=====404 오류 페이지 처리=====//
var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);
app.use('/', router);

//===== 서버 시작 =====//
http.createServer(app).listen(app.get('port'), function(req, res) {
    console.log('서버가 시작되었습니다. 포트 : ' + app.get('port')); 
});