var express = require('express');
const { type } = require('os');
const fs = require('fs');

var router = express.Router();

module.exports = router;

router.get('/', function (req, res,next) {

    let type=req.query["type"];
    let from=req.query["from"];
    let to=req.query["to"];

    if( (typeof type == 'undefined') || (typeof from == 'undefined') || (typeof to == 'undefined') )
        res.send('Got a GET request at /api without parameters');
    else{
        //console.log('Got a GET request at /api with:'+type + " "+from+" "+to);
        let resp=getData(type,from,to);
        let js = createJson(resp,type);
        res.json(js);
    }
});

function createJson(data,type){
    
    var temp=data.split("\n");
    var resp=[];
    var i=0;

    if(type.localeCompare("error") == 0 || type.localeCompare("custom") == 0){
        temp.forEach((item)=>{
            var w=item.match(/\[(.*?)\]/g);  // for logs with []
            if(w !== null){
                resp.push({});
                resp[i].data=w[0].slice(1,-1);
                resp[i].from=w[2].slice(1,-1);
                resp[i].msg=item.slice(item.lastIndexOf(']')+2,);
                i++;
            }
        });
    }

    if(type.localeCompare("access") == 0){
        temp.forEach((item)=>{
            if(item.length >0){
                resp.push({});
                resp[i].data=item.match(/\[(.*?)\]/g)[0].slice(1,-1);
                resp[i].from=item.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g)[0];
                resp[i].msg=item.match(/\"(.*?)\"/g)[0].slice(1,-1);
                i++;
            }
            });
    }
    return resp;
}

function getData(type, from, to, callback){

    let path=checkPath(type);

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