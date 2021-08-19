var express = require('express');
const { type } = require('os');
const fs = require('fs');

var router = express.Router();

module.exports = router;

    router.get('/:type/:from/:to', function (req, res,next) {

    console.log(req);

    const request={
        // mandatory parameters:
        type: req.params.type,
        from:req.params.from,
        to:req.params.to,
        // optional params:
        ip:req.query["ip"],
        sev:req.query["severity"],
        module:req.query["module"],
        msg:req.query["msg"]
    }

        console.log("type: "+request.type);
        console.log("from: "+request.from);
        console.log("to: "+request.to);

        let resp=getData(request);
        let js = createJson(resp,request.type);

        resp=[];
        js.forEach(element => {
            if(dateBetween(request.from,request.to,element.date))
                resp.push(element);
        });

        res.json(resp);
});




function dateBetween(start,end,data){
    let s=start.replace(":"," ");
    let e=end.replace(":"," ");
    let d=data.day+"/"+data.month+"/"+data.year+" "+data.hour+":"+data.minutes+":"+data.seconds;
    
    s=Date.parse(s);
    e=Date.parse(e);
    d=Date.parse(d);

    return( (s<=d) && (d<=e));
}



function createJson(data,type){
    
    var temp=data.split("\n");
    var resp=[];
    var i=0;

   
    /* apache common log format: LogFormat "%h %l %u %t \"%r\" %>s %b" common
    * see: https://httpd.apache.org/docs/2.4/logs.html
    * example:
    * 127.0.0.1 - frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326
    * where:
    * 127.0.0.1 (%h) This is the IP address of the client (remote host) which made the request to the server. If HostnameLookups is set to On, then the server will try to determine the hostname and log it in place of the IP address. However, this configuration is not recommended since it can significantly slow the server. Instead, it is best to use a log post-processor such as logresolve to determine the hostnames. The IP address reported here is not necessarily the address of the machine at which the user is sitting. If a proxy server exists between the user and the server, this address will be the address of the proxy, rather than the originating machine.
    * - (%l): The "hyphen" in the output indicates that the requested piece of information is not available. 
        * In this case, the information that is not available is the RFC 1413 identity of the client determined by identd on the clients machine. This information is highly unreliable and should almost never be used except on tightly controlled internal networks. Apache httpd will not even attempt to determine this information unless IdentityCheck is set to On.
    * frank (%u): This is the userid of the person requesting the document as determined by HTTP authentication. The same value is typically provided to CGI scripts in the REMOTE_USER environment variable. If the status code for the request (see below) is 401, then this value should not be trusted because the user is not yet authenticated. If the document is not password protected, this part will be "-" just like the previous one.
    * [10/Oct/2000:13:55:36 -0700] (%t): The time that the request was received. The format is: [day/month/year:hour:minute:second zone]
        * day = 2*digit
        * month = 3*letter
        * year = 4*digit
        * hour = 2*digit
        * minute = 2*digit
        * second = 2*digit
        * zone = (`+' | `-') 4*digit
    * "GET /apache_pb.gif HTTP/1.0" (\"%r\"): The request line from the client is given in double quotes. The request line contains a great deal of useful information. First, the method used by the client is GET. Second, the client requested the resource /apache_pb.gif, and third, the client used the protocol HTTP/1.0. It is also possible to log one or more parts of the request line independently. For example, the format string "%m %U%q %H" will log the method, path, query-string, and protocol, resulting in exactly the same output as "%r".
    * 200 (%>s): This is the status code that the server sends back to the client. This information is very valuable, because it reveals whether the request resulted in a successful response (codes beginning in 2), a redirection (codes beginning in 3), an error caused by the client (codes beginning in 4), or an error in the server (codes beginning in 5). The full list of possible status codes can be found in the HTTP specification (RFC2616 section 10).
    * 2326 (%b): The last part indicates the size of the object returned to the client, not including the response headers. If no content was returned to the client, this value will be "-". To log "0" for no content, use %B instead.
    */

    if(type.localeCompare("access") == 0){
        const regAccess=/(\d+\.\d+\.\d+\.\d+) (\S+) (\S+) \[(\d+)\/(\w+)\/(\d+)\:([\d]+)\:(\d+)\:(\d+)(?:.*)\] "(\w+) (\S+) (\S+)\" (\d+) (\d+)/;
        temp.forEach((line)=>{
            const w=line.match(regAccess);
            if(w !== null){
                resp.push({});
                resp[i].ip=w[1];
                resp[i].l=w[2];
                resp[i].userid=w[3];
                resp[i].date={};
                    resp[i].date.year=w[6];
                    resp[i].date.month=w[5];
                    resp[i].date.day=w[4];
                    resp[i].date.hour=w[7];
                    resp[i].date.minutes=w[8];
                    resp[i].date.seconds=w[9];
                resp[i].method=w[10];
                resp[i].path=w[11];
                resp[i].proto=w[12];
                resp[i].resp=w[13];
                resp[i].dim=w[14];
                i++;
            }
        });
    }

    /* Apache combined log format.
    LogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-agent}i\"" combined
    This format is exactly the same as the Common Log Format, with the addition of two more fields. 
    Each of the additional fields uses the percent-directive %{header}i, where header can be any HTTP request header. 
    The access log under this format will look like:
    127.0.0.1 - frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"
    */
    if(type.localeCompare("custom") == 0){
        const regCustom=/(\d+\.\d+\.\d+\.\d+) (\S) (\S+) \[(\d+)\/(\w+)\/(\d+)\:(\d+)\:(\d+)\:(\d+)(?:.*)\] \"(\w+) (\S+) (\S+)\" (\d+) (\d+) "(\S+)" "(.*)"/;
        temp.forEach((line)=>{
            const w=line.match(regCustom);
            if(w !== null){
                resp.push({});
                resp[i].ip=w[1];
                resp[i].l=w[2];
                resp[i].userid=w[3];
                resp[i].date={};
                    resp[i].date.year=w[6];
                    resp[i].date.month=w[5];
                    resp[i].date.day=w[4];
                    resp[i].date.hour=w[7];
                    resp[i].date.minutes=w[8];
                    resp[i].date.seconds=w[9];
                resp[i].method=w[10];
                resp[i].path=w[11];
                resp[i].proto=w[12];
                resp[i].statusCode=w[13];
                resp[i].dim=w[14];
                resp[i].referal=w[15];
                resp[i].userAgent=w[16];
                i++;
            }
        });
    }

    /* Apache error log format: 
    * example: 
        [Fri Sep 09 10:42:29.902022 2011] [core:error] [pid 35708:tid 4328636416] [client 72.15.99.187] File does not exist: /usr/local/apache2/htdocs/favicon.ico
    */
    if(type.localeCompare("error") == 0 ){
        const regError=/\[(\w+) (\w+) (\d+) (\d+):(\d+):(\d+) (\d+)] \[(\w+):(\w+)](?:.*) (\d+\.\d+\.\d+\.\d+):(\d+)] (.*)/;
        temp.forEach((line)=>{
            const w=line.match(regError);
            if(w !== null){
                resp.push({});
                resp[i].ip=w[10];
                resp[i].date={};
                resp[i].date.day=w[3];
                resp[i].date.weekDay=w[1];
                resp[i].date.month=w[2];
                resp[i].date.year=w[7];
                resp[i].date.hour=w[4];
                resp[i].date.minutes=w[5];
                resp[i].date.seconds=w[6];
                resp[i].msg=w[12];
                resp[i].severity=w[9];
                resp[i].module=w[8];
                i++;
            }
        });
    }
    
    return resp;
}

function getData(request){

    let path=checkPath(request.type);

    if (path == null) {
        return
    }
    response = fs.readFileSync(path, 'utf8', (err,data)=>{
        if(err) console.error(err);
    });
    return response;
}

function checkPath(type){
    // check log type
    let path ="../logs/";
    if (type.localeCompare("access") == 0 ) {
        path+="access.log";
    } else if (type.localeCompare("error") == 0) {
        path+="error.log";
    } else if (type.localeCompare("custom") == 0) {
        path+="custom.log";
    } else{
        console.log("Wrong request!");
        path=null;
    }
    return path;
}