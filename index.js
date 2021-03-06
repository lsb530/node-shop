var express = require('express'), http = require('http'), path = require('path');
var bodyParser = require('body-parser'), cookieParser = require('cookie-parser'),
    staticServer = require('serve-static'), errorHandler = require('errorhandler');
var mysql = require('mysql');
mysql://b3ed6a16f0a180:23e0e9f3@us-cdbr-east-02.cleardb.com/heroku_95d78f19fd2d409?reconnect=true
var connection = mysql.createConnection({
  host     : 'us-cdbr-east-02.cleardb.com',
  user     : 'b3ed6a16f0a180',
  password : '23e0e9f3',
  database : 'heroku_95d78f19fd2d409'
});
var expressErrorHandler = require('express-error-handler');
var expressSession = require('express-session');
var app = express();
app.use(express.json());

app.set('port', process.env.PORT || 3080);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.json());
app.use('/public', staticServer(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));

var router = express.Router();

// 라우팅 함수 등록
router.route('/process/login').post(function(req, res) {
    console.log('/process/login 처리함.');
    
    var paramId = req.body.id || req.query.id; // get방식일때랑 post방식일때 둘다 처리
    var paramPassword = req.body.password || req.query.password;
    
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버에서 응답한 결과입니다.</h1>');
    res.write('<div><p>Param Id : ' + paramId + '</p></div>');
    res.write('<div><p>Param password : ' + paramPassword + '</p></div>');
    res.write("<br><br><a href='/public/login.html'>로그인 페이지로 돌아가기</a>");
    res.end();
});

router.route('/api/clothes').get(function(req, res) {
    console.log('전체 옷 api 호출');
    
    //res.redirect('리액트배포경로');
    
    const jdata_dog = [
    {"name": "식빵", "family": "웰시코기", "age": 1, "weight": 2.14},
    {"name": "콩콩", "family": "포메라니안", "age": 3, "weight": 2.5},
    {"name": "젤리", "family": "푸들", "age": 7, "weight": 3.1}
    ];
    
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>강아지 데이터입니다 ㅋㅋ</h1>');
    res.write(JSON.stringify(jdata_dog));
    res.end();
});

router.route('/api').post(function(req, res) {
   var name = req.body.name|| req.query.id;
    var pw = '비밀번호';
    console.log(name);
    console.log('탐정이죠');
    
    //응답
    res.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});
    
    //DOM
    res.write("<!DOCTYPE html>");
    res.write("<html>");
    res.write("<head>");
    res.write("    <title>Me server</title>");
    res.write("    <meta charset='UTF-8'>");
    res.write("    <meta name='description'' content=''>");
    res.write("    <meta name='keywords' content=''>");
    res.write("</head>");
    res.write("<body>");
    res.write("<div>안녕하세요</div>");
    res.write("<div>NodeJS 실습 시간입니다.</div>");
    res.write("</body>");
    res.write("</html>");
    
    //응답 종료
    res.end();
});

router.route('/').get(function(req, res) {
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>웹 개발 API서버!</h1>');
    //제가 생각한 원래 방식: node와 react를 한 프로젝트 경로에 합친다.
//    res.redirect('리액트 주소'); // 돌아가는 방식: 배포한 리액트 주소경로
    res.end();
});

router.route('/db').get(function(req, res) {
   connection.query('SELECT * from test', function(err, rows, fields) {
      if (err) {
        console.log('error: ', err);
        throw err;
      }
      res.send(['DB test!!!!', rows]);
    }); 
});

//=====404 오류 페이지 처리=====//
//var errorHandler = expressErrorHandler({
//    static: {
//        '404': './public/404.html'
//    }
//});
//app.use(expressErrorHandler.httpError(404));
//app.use(errorHandler);
app.use('/', router);

//===== 서버 시작 =====//
http.createServer(app).listen(app.get('port'), function(req, res) {
    console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));
});