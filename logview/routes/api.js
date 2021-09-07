var express = require('express');
const fs = require('fs');
var router = express.Router();
const lg = require('../libs/logfiles');

var createError = require('http-errors');


module.exports = router;

router.get('/:type/:from/:to', function (req, res,next) {

    /**
     * Object that contain parameters passed via REST call.
     * @param  type [type of log to read, can be access/error/custom]
     * @param  from [start date]
     * @param  to [end date]
     * @param  params [optional list of parameters]
     */
    const request={
        // mandatory parameters:
        type: req.params.type,
        from:req.params.from,
        to:req.params.to,
        // optional params:
        params:req.query
    }

        let resp=getData(request);
        let js = createJson(resp,request.type);


        // Errors handling
        // from/to inserted not correctly
        if(dataRangeError(request.from,request.to))
            return next(createError(400)); // 400: bad request
        // wrong parameters format inserted
        if(Object.values(request.params).includes(''))
            return next(createError(400)); // 400: bad request


        resp=[];
        js.forEach(element => {
            if(dateBetween(request.from,request.to,element.date)){
                if(find(element,request.params))
                    resp.push(element);
            }
        });
        res.json(resp);
});


/**
 * Function that search if param passed via REST is present in the js object 
 * @param  item [item from file log]
 * @param  params [array of params passed via REST call]
 */
function find(item,params){
    var ret=true;
    Object.keys(params).forEach(pKey => {
        if( (typeof params[pKey] != "undefined") && (!item[pKey].includes(params[pKey])) )
            ret=false;
    });
    return ret;
}

/**
 * Function that check the correctness of data range 
 * @param  start [start date]
 * @param  end [end date]
 */
function dataRangeError(start,end){
    let s=start.replace(":"," ");
    let e=end.replace(":"," ");
  
    s=Date.parse(s);
    e=Date.parse(e);
    if(e<s)  // end date is before start date
        return true;
    return false;
}
/**
 * Function that check if date from log is between start/end date passed by user 
 * @param  start [start date]
 * @param  end [end date]
 * @param  data [date from file]
 */
function dateBetween(start,end,data){
    let s=start.replace(":"," ");
    let e=end.replace(":"," ");
    let d=data.day+"/"+data.month+"/"+data.year+" "+data.hour+":"+data.minutes+":"+data.seconds;

    s=Date.parse(s);
    e=Date.parse(e);
    d=Date.parse(d);

    return( (s<=d) && (d<=e));

}


/**
 * Function that select the correct log file and read the content into json format.
 * @param  data [data that will contain json]
 * @param  type [type of log to read, can be access/error/custom]
 */
function createJson(data,type){   
    switch(type){
        case 'access': return lg.jsonAccess(data);
        case 'error':  return lg.jsonError(data);
        case 'custom': return lg.jsonCustom(data);
    }

}

/**
 * Function that read file.
 * @param  reques [object with requested parameters]
 */
function getData(request){

    let path=createPath(request.type);

    if (path == null) {
        return null;
    }
    response = fs.readFileSync(path, 'utf8', (err,data)=>{
        if(err) console.error(err);
    });
    return response;
}

/**
 * Function that check if correct type was selected and if the corrispondent file exists.
 * @param  reques [object with requested parameters]
 */
function createPath(type){
    // tansform log type into log file with destination
    let path ="../logs/";
    const logs=["access", "error", "custom"];

    if(logs.includes(type))
        path+=type+".log";
    else{
        console.log("Wrong request!");
        path=null;
    }
    return path;
}