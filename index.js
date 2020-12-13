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

app.use(function(req, res, next) {
    console.log('첫 번째 미들웨어 호출됨');
    res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
    res.write('접속성공! 그리고 변경 완료...ㅎㅎ');
    res.end();
});

var router = express.Router();

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