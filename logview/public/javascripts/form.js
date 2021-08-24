
function selectLog(evt, logType) {
    var i, tabcontent, tablinks;

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


      console.log("from: " +from);
      console.log("to: " +to);
      console.log("paramas: " +params);

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    evt.currentTarget.className += " active";
  
    // Create an XMLHttpRequest object
      const xhttp = new XMLHttpRequest();
  
      // Define a callback function
      xhttp.onload = function() {
          const table = createTable(this.responseText);
       
      }
  
      // Send a request
      if (params.length>0)
        var request="api/"+logType+"/"+from+"/"+to+"/?"+params.replace(/\,/g,"&");
      else
        var request="api/"+logType+"/"+from+"/"+to;
      xhttp.open("GET",request);
      xhttp.send();
  
  
  }
  
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
