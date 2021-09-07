
/**
 * Function used into html page. 
 * Read parameters insereted into html page. Convert data parameters, check the correctness 
 * of parameters and execute the HttpRequest to the api page
 * @param  button [selected button on the page]
 * @param  logType [type of log selected, can be: access/error/custom]
 */
function selectLog(button, logType) {
    var i, tablinks;

      let from=document.getElementById("from").value;
      let to=document.getElementById("to").value;
      let params=document.getElementById("params").value;

      const month=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

      // convert to date format requested by api
      const reg=/(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)/;
      let t=from.match(reg);
      from=t[3]+"-"+month[t[2]%10-1]+"-"+t[1]+":"+t[4]+":"+t[5]+":"+t[6];
      t=to.match(reg);
      to=t[3]+"-"+month[t[2]%10-1]+"-"+t[1]+":"+t[4]+":"+t[5]+":"+t[6];

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    button.currentTarget.className += " active";
  
    // Create an XMLHttpRequest object
      const xhttp = new XMLHttpRequest();
  
      // Define a callback function
      xhttp.onreadystatechange=function(){
        if (xhttp.readyState === 4) {
          if (xhttp.status === 200) {
            createTable(this.responseText);
          } else {
             alert("Error code: "+xhttp.status+"\nPlease insert correct parameters!");
          }
      }
    }
      // Send a request
      if (params.length>0)
        var request="api/"+logType+"/"+from+"/"+to+"/?"+params.replace(/\,/g,"&");
      else
        var request="api/"+logType+"/"+from+"/"+to;
      xhttp.open("GET",request, true);
      xhttp.send();
  
  }
  

  /**
 * Function that update table with selected parameters. 
 * Read data, extract informations and create html table 
 * @param  data [data in json format created from log file ]
 */
  function createTable(data){

  const jdata=JSON.parse(data);
  const t=document.getElementById("main_table");
  
  t.innerHTML = "";  // delete table before create new one
  
  var r=t.insertRow();
  var c;
  
  Object.keys(jdata[0]).forEach(key => {
      var th=document.createElement('th');
      r.appendChild(th);
      th.innerHTML=key;
  });
  
  jdata.forEach(row => {
      r=t.insertRow();
      Object.values(row).forEach(item =>{
          c=r.insertCell();
          if(typeof item == "object"){
              c.innerHTML=item.day+"/"+item.month+"/"+item.year+" "+item.hour+":"+item.minutes+":"+item.seconds;
          }
          else{
              c.innerHTML=item;
          }
          
      })
  })
  }
