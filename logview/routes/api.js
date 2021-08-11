var express = require('express');
var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('api', { title: 'LogView-API' });
// });

module.exports = router;



//const worker = require('../bin/worker.js');

router.get('/', function (req, res,next) {
  console.log("type: " + req.query["type"] +
              "\nfrom: " + req.query["from"] + 
              "\nto: "+req.query["to"]);
  type=req.query["type"];
  from=req.query["from"];
  to=req.query["to"];


    let test= { from : "13.66.139.0", date : "19/Dec/2020:13:57:26 +0100", message : "GET /apache-log/access.log HTTP/1.1"};
    res.json(test);

//     let data=getJson(type,from,to);
//   console.log("\ndata in api: "+data);
//   res.send('Got a GET request at /api ');


//   console.log("before\n");
// setTimeout(res.send(data), 30)
//     console.log("after\n");
// //    res.send(data);
})

// function callback(data,res){
//     console.log("\ndata in api: "+data);
//     res.send('Got a GET request at /api '+ data);

// }


// // const worker = require("../")

// // app.get('/api', function (req, res,next) {
// //   console.log("type: " + req.query["type"] +
// //               "\nfrom: " + req.query["from"] + 
// //               "\nto: "+req.query["to"]);
// //   res.send('Got a GET request at /api');
// // })

// // app.post('/api', function (req, res) {
// //   res.send('Got a POST request at /api')
// // })
// // app.put('/api', function (req, res) {
// //   res.send('Got a PUT request at /api')
// // })
// // app.delete('/api', function (req, res) {
// //   res.send('Got a DELETE request at /api')
// // })

// function getJson (type, from, to) {
//     console.log("Recived this: "+type+" "+from+" "+to);

//     const fs = require('fs')
//     let path ="../logs/";

//     if (type.localeCompare("access") == 0 ) {
//         path+="access.log";
//     } else if (type.localeCompare("error") == 0) {
//         path+="error.log";
//     } else if (type.localeCompare("custom") == 0) {
//         path+="custom.log";
//     } else{
//         console.log("Wrong request!");
//         return
//     }

//     fs.readFile(path, 'utf8' , (err, data) => {
//     if (err) {
//         console.error(err)
//         return
//     }

//     data=createJson(fs,from,to);
//     console.log("data nel worker:" + data);

//     return data;

//     })
// }



// function createJson(file,from,to){
// let test="13.66.139.0"+"[19/Dec/2020:13:57:26 +0100]"+"GET /apache-log/access.log HTTP/1.1";
// return JSON.stringify(test);
// }
