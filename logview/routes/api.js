var express = require('express');
const { type } = require('os');
const fs = require('fs');

var router = express.Router();

const lg = require('../libs/logfiles');

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

        console.log("severity: "+request.sev);


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
    
    if(type.localeCompare("access") == 0){
        return jsonAccess(data);
    }
    if(type.localeCompare("error") == 0){
        return lg.jsonError(data);
    }

    if(type.localeCompare("custom") == 0){
        return jsonCustom(data);
    }
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