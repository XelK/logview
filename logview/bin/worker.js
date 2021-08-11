module.exports={

    getJson: function (type, from, to) {
        console.log("Recived this: "+type+" "+from+" "+to);

        const fs = require('fs')
        let path ="../logs/";

        if (type.localeCompare("access") == 0 ) {
            path+="access.log";
        } else if (type.localeCompare("error") == 0) {
            path+="error.log";
        } else if (type.localeCompare("custom") == 0) {
            path+="custom.log";
        } else{
            console.log("Wrong request!");
            return
        }

        fs.readFile(path, 'utf8' , (err, data) => {
        if (err) {
            console.error(err)
            return
        }

        data=createJson(fs,from,to);
        console.log("data nel worker:" + data);

        return data;

        })
    }

}

function createJson(file,from,to){
    let test="13.66.139.0"+"[19/Dec/2020:13:57:26 +0100]"+"GET /apache-log/access.log HTTP/1.1";
    return JSON.stringify(test);
}

