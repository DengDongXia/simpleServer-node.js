const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
var mime = require('./mime'); // 加载我们的mime.js
var config = require('./config');


const server =  http.createServer(function(req,res){
  var pathName = url.parse(req.url).pathname;  // 获取文件名"/xxx"
      // 对中文进行解码,防止乱码
      pathName = decodeURI(pathName);
      // 获取资源的绝对路径
      var realFilePath = path.resolve(__dirname+ pathName);
      console.log(realFilePath);
      // 获取对应文件的文档类型
      var ext = path.extname(pathName); // 获取后缀名,如'.html'
      ext = ext?ext.slice(1): 'notKnow';  // 取掉.符号

      //通过和mine.js里面设定好的正则进行匹配，判断当前请求的图片是否为图片
      if (ext.match(config.Expires.fileMatch)) {
          var expires = new Date();
          expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
          // 设置响应头
          res.setHeader("Expires", expires.toUTCString());
          res.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);
      }
      // 定义未知文档的类型MIME
      var contentType = mime[ext] || "text/plain"; // 后缀名存在就进行映射,不存在就是'text/plain'
  
    //从文件系统中都去请求的文件内容  
    fs.readFile(pathName.substr(1),function(err, data) {  
        if(err) {  
            console.log(err);  
            //HTTP 状态码 404 ： NOT FOUND  
            //Content Type:text/plain  
            res.writeHead(404,{'Content-Type': contentType});  
        }  
        else {  
            //HTTP 状态码 200 ： OK  
            //Content Type:text/plain  
            res.writeHead(200,{'Content-Type': contentType});  
            var content =  fs.readFileSync(realFilePath,"binary");   //解释图片时，格式必须为 binary 否则会出错
             //写会相应内容  
            res.write(content,"binary"); //解释图片时，格式必须为 binary，否则会出错
  
        }  
        //发送响应数据  
        res.end();  
    });  
}).listen(8081);  
  
console.log('Server running at http://127.0.0.1:8081/');  