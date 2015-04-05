

var jsonObject = '[{"projectId": "226376", "project_name": "Agile Methodology","fetaureId": "226386","feature_name": "Test module 1","task_id": "228512","task_name": "GR-1-rest"}, {"projectId": "221972","project_name": "ECS Amalgom1","fetaureId": "229129","feture_name": "delete from default_milestone","task_id": "229359","task_name": "GR-1-Amalgum-T2"},{"projectId": "226345", "projectName": "Agile Methodology 2","fetaureId": "226332","feture_name": "Test module 2","task_id": "223412","task_name": "GR-1-rest23"}]';
var pause=false;
var lastValue=[];
var username;
 
$(document).ready(function () {
/*chrome.runtime.getBackgroundPage(function(win){
if(win.GetValidUser())
{

username=win.GetUserName();
//console.log(username);
GetTaskData();
     
//ClearTickerLocalStorage();
//RemoveFromLocalStorage();
}
});*/
restResponse=jsonObject;
init();
document.getElementById("close").addEventListener("click", function(e){
/*  chrome.alarms.create("close_app_notifiy",{
            delayInMinutes:0.1,periodInMinutes:0.1
          });*/
  chrome.app.window.get("mainWindow").close();
});
document.getElementById("minimize").addEventListener("click", function(e){
    chrome.app.window.get("mainWindow").minimize();
});
document.getElementById("maximize").addEventListener("click", function(e){
    chrome.app.window.get("mainWindow").fullscreen();
});
document.getElementById("restore").addEventListener("click", function(e){
    chrome.app.window.get("mainWindow").restore();
});
document.getElementById("btnAddTask").addEventListener("click", function(e){
var display = document.getElementById("newTask");
console.log(display);
if(display.style.display==="block")
{
display.style.display='none';
}
else
{
 display.style.display='block'; 
}
});
document.getElementById("addTask").addEventListener("click",function(e){
  var project,module,task,taskId;
  project=document.getElementById("pName").value;
  module=document.getElementById("moudle").value;
  task=document.getElementById("task").value;
  hrs=document.getElementById("hrs").value;
  hrs=hrs+"0:0";
  var desc=document.getElementById("desc").value;
  id=Math.floor((Math.random()*1000)+1);
  // AddNewTaskUI(sr,proj,mod,tsk,taskid,workedHrs,description)
GenUI(project,module,task,id,hrs);
//proto :-GenUI(proj,mod,tsk,taskid,timer)

});
});

var restResponse,client;
function GetTaskData()
{
  var path="http://localhost:3000/api/getusertask/"+username;
   client=new XMLHttpRequest();
  client.onload=function requestListner(){
 
  };
 
  client.onreadystatechange=function()
  {
  if (client.readyState==4 && client.status==200)
    {
    restResponse=client.responseText;
    
    init();
    //CheckStorageArray();
    }
  };
  client.open('GET',path,true);
  //client.setRequestHeader('Content-Type','text/plain');
  client.send();
  
}

var lastSr=0;var manualAlloc=[];
function init()
{
  
var json = JSON.parse(restResponse);
for(var i=0;i<json.length;i++)
{
GenUI(json[i].project_name,json[i].feature_name,json[i].task_name,json[i].task_id);
document.getElementById(json[i].task_id).addEventListener("click", function(e){
  var id=this.id;
  var removeDiv = document.getElementById("div_"+this.id);
  var tickTime;
  for(i=0;i<json.length;i++)
  {
    if(id == json[i].task_id)
    {
  
     StartTask(json[i].project_name,json[i].feature_name,json[i].task_name,json[i].task_id);
     removeDiv.parentNode.removeChild(removeDiv);
     break;
    }
 
  }



});
 $("#progBar").val(Math.round((i/(json.length-1))*100));
}

}
//+++++++++++++++Manual Allocation++++++++++++++++++++++++++++++++++++++++++++++
function ManualCalcAlloc(element)
{

			var val=0,division=0,getVal,other,biggest=0,biggestID,getId;
				//=document.getElementById(element).value;

				for(var i in element)
				{
					other=document.getElementById(element[i]).value;
					if(other==="")
						other=0;
						if(biggest<other)
						{
						 //check if other >100
						  biggest=other;
						  biggestID=element[i];
						}
						val =parseInt(val)+parseInt(other);

				}
				if(biggest>100){
				  biggest=100;
				  division=0;
				}
				else if(val!==100)
				{
					console.log("Total Allocation is Grater than 100%");
					val=Math.abs(100-parseInt(biggest));
					division =val/(element.length-1);
			
				}
				var tmpElement;
				 
					for(var j in element)
					{
					  getId=element[i];
						getId=getId.substring(getId.indexOf('_')+1,getId.length);
            tmpElement=document.getElementById(getId);
					if(element[j]!==biggestID)
					{

					  document.getElementById(element[j]).value=division;
					  document.getElementById("alloc_"+getId).innerHTML=division+"%";
	          transaction.push({key:getId,alloc:division,time:new Date().getTime()});
         
					}
					else{

					  	document.getElementById("alloc_"+getId).innerHTML=biggest+"%";
							transaction.push({key:getId,alloc:biggest,time:new Date().getTime()});
					}

					}
					console.log("Transaction Collection:-");
				console.log(transaction);
					console.log("Transaction************** Collection");
	}
//+++++++++++++++End++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function CheckStorageArray()
{
  var result;
   chrome.storage.local.get('unFinishedTask',function(res){
     console.log("***********");
     for(var key in res)
     {
          if(res.hasOwnProperty(key))
          {
              result = res[key];

          }
     }

    if(typeof(result)!=="undefined" && result.length!==0)//if (typeof(myVariable) != "undefined")
    {

      ReloadUnifinishedTask(result);
    }

    });

}

function ReloadUnifinishedTask(array)
{
 
    var sec,element,done; 
    
   var json = JSON.parse(restResponse);
   tasks.length=0;
   dictionary.length=0;
   var removeDiv ;
   for(var j in json)
   {
    for(var i=0;i<array.length;i++)
    {
      if(json[j].task_id==array[i].key)
      {
        
       removeDiv= document.getElementById("div_"+array[i].key);
       GenProgressUI(json[j].project_name,json[j].feature_name,json[j].task_name,json[j].task_id);
       removeDiv.parentNode.removeChild(removeDiv);
       StartAddEvent(array[i].key);
        nowTime=array[i].value;
         TaskPush(array[i].key);
         dictionary.push({key:array[i].key , value:nowTime});
      }
    }
   }
  //SetTickerLastState();
 
 
}

//+++++++++++++++Set Ticker Last State++++++++++++++++++++++++++++++++++++++++++
function SetTickerLastState()
{ 
  var result;
   chrome.storage.local.get('tickerLastState',function(res){
     console.log(res);
      for(var key in res)
     {
          if(res.hasOwnProperty(key))
          {
              result = res[key];
            
        
          }
     }
     SetTickerHelper(result);
   });
}
function SetTickerHelper(result)
{
  var intiSec,tmpElm;
  for(var i in result)
  {
     tmpElm=document.getElementById(result[i].key);
   intiSec= ConvertToSec(result[i].value);
  
   TickerTimer(tmpElm,true,intiSec);
   
  }
}
//+++++++++++++++End++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var nowTime,endTime,dictionary=[];
function GetNowLocalTime()
{
var t =new Date().getTime();
var date = new Date(t);// Milliseconds to date
var tmp=date.toString().split(" ");
return tmp[4];
}
//_____Start_______#############################################################
function StartTask(proj,mod,tsk,taskid)
{
nowTime =GetNowLocalTime();

GenProgressUI(proj,mod,tsk,taskid);
var tick=document.getElementById("tick_"+taskid);

var tickInitTime=tick.innerHTML;
tickInitTime=ConvertToSec(tickInitTime);
        TickerTimer(tick,true,tickInitTime);
        dictionary.push({key:taskid , value:nowTime});
        chrome.storage.local.set({unFinishedTask:dictionary}, function(){});
        TaskPush(taskid);
        StartAddEvent(taskid);
}
function StartAddEvent(taskid)
{
  var tick=document.getElementById("tick_"+taskid);
  var totalTime;
  var elm=document.getElementById("pause_"+taskid);
  var tickTime=tick.innerHTML;
 document.getElementById("pause_"+taskid).addEventListener('click',function(){
 var clr=$(elm).css('background-color');  
  console.log(clr);
  if( clr == "rgb(255, 221, 161)" )
  {
 $(this).css({'background-color':'#CDE5A0'});
 $(this).attr('src', "../img/play.png") ;
 
  tickTime=tick.innerHTML;
  TickerTimer(tick,false);
   pause=false;
   var time =new Date().getTime();
   transaction.push({key:taskid,alloc:0,time:time}); //push 0% if paused 4apr15
   TaskPop(taskid);
  
  }
  else
  {
   $(this).css({'background-color':'#FFDDA1'});
   $(this).attr('src', "../img/pause.png") ;
   tickerTime = ConvertToSec(tick.innerHTML);
    TickerTimer(tick,true,tickerTime);
    pause=true;
    TaskPush(taskid);
  }
});
 document.getElementById("stop_"+taskid).addEventListener('click',function(){
          
          var task=this.id;
          var json = JSON.parse(restResponse);
        
          //task=task.substring(task.indexOf('_')+1, task.length);
         var removeDiv=document.getElementById("div_"+taskid);
              for(i=0;i<json.length;i++)
              {
                if(taskid == json[i].task_id)
                {
                  var totalTime = TaskPop(taskid);
                  totalTime=parseInt(totalTime)*60;
                  totalTime= ConverterToHour(totalTime);
                  console.log("total time:-"+totalTime);
                  GenUI(json[i].project_name,json[i].feature_name,json[i].task_name,json[i].task_id,totalTime);
                   FinishTask(taskid);
                   TickerTimer(tick,false);
                  document.getElementById(json[i].task_id).addEventListener("click", function(e){
                  var id=this.id;
                  var removeDiv = document.getElementById("div_"+this.id);
                  for(i=0;i<json.length;i++)
                  {
                    if(id == json[i].task_id)
                    {
                     StartTask(json[i].project_name,json[i].feature_name,json[i].task_name,json[i].task_id);
                     removeDiv.parentNode.removeChild(removeDiv);
                     break;
                    }
                 
                  }
              });
                  removeDiv.parentNode.removeChild(removeDiv);
                 break;
                }
               
              }
              
           
        
            
});
document.getElementById("alloc_"+taskid).addEventListener('click',function(){
    document.getElementById("edit_"+taskid).style.zIndex=1;
    this.style.zIndex=-1;
    
  });
document.getElementById("edit_"+taskid).addEventListener('keydown',function(e){
  
  if(e.keyCode === 13)
  {
    document.getElementById("alloc_"+taskid).style.zIndex=1;
    this.style.zIndex=-1;
  }
    
  });
}


//_____End______################################################################

//_____Finish Task##############################################################
function FinishTask(elementId)
{
  CheckStorageArrayForEnd(elementId);
 
}
//____End________###############################################################
function CheckStorageArrayForEnd(id)
{
  var result;
    chrome.storage.local.get('unFinishedTask',function(res){

     for(var key in res)
     {
          if(res.hasOwnProperty(key))
          {
              result = res[key];

          }
     }

    if(result.length!==0 && typeof(result)!="undefined")
    {
      EndTask(result,id);
     // TickerTimer(document.getElementById(id),false);
      //TaskPop(id);
    }

    });


}
function EndTask(taskArray,elementId)
{
  for(var i=0;i<taskArray.length;i++)
  {
        if(taskArray[i].key == elementId)
        {
        taskArray.splice(i,1);
        }
  }
  RemoveFromLocalStorage();
  chrome.storage.local.set({unFinishedTask:taskArray}, function(){
  //console.log("Added");

});
}
function RemoveFromLocalStorage()
{
chrome.storage.local.remove('unFinishedTask', function(){
//console.log("***********");
//console.log("removed");
chrome.storage.local.get('unFinishedTask', function(res){
//console.log("Removal function Result:");
//console.log(res);
//console.log("***********");
});
});
}

function GenUI(proj,mod,tsk,taskid,timer)
{
  if(typeof(timer)==="undefined" || timer==="")
  {
  timer="0:0:0";
  } 
  
  var parent=document.getElementById("task_holder");
  var taskDiv = document.createElement("div");
  taskDiv.id="div_"+taskid;
  taskDiv.className = "taskdiv";
  parent.appendChild(taskDiv);
  
  var taskSection = document.createElement("section");
  var paraHead = document.createElement("p");
  paraHead.className = "p_task";
  paraHead.innerHTML = tsk;
  var paraModule = document.createElement("p");
  paraModule.innerHTML = mod;
  var paraDate = document.createElement("p");
  paraDate.innerHTML = "13-12-2015 to 13-5-2016";
  taskDiv.appendChild(taskSection);
  taskSection.appendChild(paraHead);
  taskSection.appendChild(paraModule);
  taskSection.appendChild(paraDate);

  var aside = document.createElement("aside");
  var btnImg = document.createElement("img");
  btnImg.className = "btnimg";
  btnImg.src = "../img/play.png";
  btnImg.id=taskid;
  taskDiv.appendChild(aside);
  aside.appendChild(btnImg);

  var footer = document.createElement("footer");
  var ftrleft = document.createElement("div");
  ftrleft.className = "ftr_left";
  ftrleft.innerHTML = proj;
  var ftrright = document.createElement("div");
  ftrright.className = "ftr_right";
  ftrright.innerHTML = timer;

  taskDiv.appendChild(footer);
  footer.appendChild(ftrleft);
  footer.appendChild(ftrright);
}
function GenProgressUI(proj,mod,tsk,taskid)
{
 
  var parent=document.getElementById("progess_holder");
  var progressDiv = document.createElement("div");
  progressDiv.className = "taskprogress";
  progressDiv.id="div_"+taskid;
  parent.appendChild(progressDiv);
  
  var taskSection = document.createElement("section");
  var paraHead = document.createElement("p");
  paraHead.className = "p_task";
  paraHead.innerHTML = tsk;
  var paraModule = document.createElement("p");
  paraModule.innerHTML = mod;
  var paraDate = document.createElement("p");
  paraDate.innerHTML = "13-12-2015 t0 13-5-2016";
  

  progressDiv.appendChild(taskSection);
  taskSection.appendChild(paraHead);
  taskSection.appendChild(paraModule);
  taskSection.appendChild(paraDate);

  var aside = document.createElement("aside");
  var btnpause = document.createElement("img");
  btnpause.className = "btnPauseimg";
  btnpause.src = "../img/pause.png";
  btnpause.id="pause_"+taskid;
  var btnstop = document.createElement("img");
  btnstop.className = "btnStopimg";
  btnstop.src = "../img/stop.png";
  btnstop.id="stop_"+taskid;
  var alloc =document.createElement("p");
  alloc.id="alloc_"+taskid;
  alloc.innerHTML="allocation %";
  var editalloc=document.createElement("input");
  editalloc.type="text";
  editalloc.maxLength=2;
  editalloc.id="edit_"+taskid;
  progressDiv.appendChild(aside);
  aside.appendChild(btnpause);
  aside.appendChild(btnstop);
  aside.appendChild(alloc);
  aside.appendChild(editalloc);
  
  var footer = document.createElement("footer");
  var ftrleft = document.createElement("div");
  ftrleft.className = "ftr_left";
  ftrleft.innerHTML = proj;
  var ftrright = document.createElement("div");
  ftrright.className = "ftr_right";
  ftrright.innerHTML = "0:0:0";
  ftrright.id="tick_"+taskid;
  progressDiv.appendChild(footer);
  footer.appendChild(ftrleft);
  footer.appendChild(ftrright); 
}
function AddNewTaskUI(sr,proj,mod,tsk,taskid,workedHrs,description)
{

	var table=document.getElementById("taskTable");
	table.className="tg";

  var tr=document.createElement('tr');
	table.appendChild(tr);
	var srNo=document.createElement('td');
	srNo.innerHTML=sr+1;
	var project=document.createElement('td');
  var  module=document.createElement('td');
  var  task=document.createElement('td');

  var p=document.createElement('p');
  p.innerHTML=proj;
  project.appendChild(p);
  var m=document.createElement('p');
  m.innerHTML=mod;
  module.appendChild(m);
  var t=document.createElement('p');
  t.innerHTML=proj;
  tid=taskid;
  task.appendChild(t);
	var action=document.createElement('td');
	var hrs=document.createElement("p");
	hrs.innerHTML=workedHrs;


  var action2=document.createElement('td');
  var detail=document.createElement('p');
  detail.innerHTML=description;

//----
	table.appendChild(srNo);
	table.appendChild(project);
	table.appendChild(module);
	table.appendChild(task);
	table.appendChild(action);
	table.appendChild(action2);
	action.appendChild(hrs);
  action2.appendChild(detail);
}
function GetTimeDiffrence(sTime, eTime) {
var nTotalDiff = eTime - sTime;
var oDiff = {days:0,hours:0,minutes:0,seconds:0}; //new Object
oDiff.days = Math.floor(nTotalDiff/1000/60/60/24);
nTotalDiff -= oDiff.days*1000*60*60*24;
oDiff.hours = Math.floor(nTotalDiff/1000/60/60);
nTotalDiff -= oDiff.hours*1000*60*60;
oDiff.minutes = Math.floor(nTotalDiff/1000/60);
nTotalDiff -= oDiff.minutes*1000*60;
oDiff.seconds = Math.floor(nTotalDiff/1000);
return oDiff;

}
var totalhr,totalmin,totalSec;
function TotalTime(newTime)
{
var tmpnew=[];
var tmplast=[];
var lastTime=$("#Some").text();
tmp=newTime.split(":");
tmplast=lastTime.split(":");
var tmpsec=parseInt(tmp[2])+parseInt(tmplast[2]);
var carrmin=0,carrhr=0,carrsec=0;
if(tmpsec>=60)
{
carrmin=1;
carrsec=tmpsec-60;
tmpsec=carrsec;
}

var tmpMin=parseInt(tmp[1])+parseInt(tmplast[1]);
tmpMin=tmpMin+carrmin;
if(tmpMin>=60)
{
carrhr=1;
carrmin=tmpMin-60;
tmpMin=carrmin;
}

var tmpHr=parseInt(tmp[0])+parseInt(tmplast[0]);
carrhr=carrhr+tmpHr;
//console.log(tmpHr+":"+tmpMin+":"+tmpsec);
return tmpHr+":"+tmpMin+":"+tmpsec;
}
/*
**************************Test******************************************************
********************************************************************************
*/
//1
var tasks=[],transaction=[],click=0;
function TaskPush(id)
{
	var time =new Date().getTime();
	var totalTime=0;
	var tmpPer=0;
	var percentage=0;


	tasks.push({key:id,value:time});
	percentage=Math.round(100/tasks.length);

	
	//tasks.push({key:id,value:time});
	for(var i=0;i<tasks.length;i++){
	transaction.push({key:tasks[i].key,alloc:percentage,time:time});
	CalcAlloc(1);
}
console.log("Task Push");
   console.log(tasks);

}
//2
function TaskPop(id)
{
var tmp=[],workPercent=0; //workpercent is minuts

for(var i=0;i<transaction.length;i++)
{
    if(transaction[i].key == id)
    {
    tmp.push(transaction[i]);
  	}
}
var timediffrence,hrs,min;
var time =new Date().getTime();
 for(var j =0;j<tmp.length-1;j++)
  {
    timediffrence=GetTimeDiffrence(tmp[j].time,tmp[j+1].time);
    hrs= timediffrence.hours*60;
    min= timediffrence.minutes;
    totalTime= hrs+min;
   // console.log(tmp[j].alloc);
    workPercent= workPercent+Math.round((totalTime* parseInt(tmp[j].alloc))/100);
   
  }
	timediffrence=GetTimeDiffrence(tmp[tmp.length-1].time,time);
	hrs= timediffrence.hours*60;
	min= timediffrence.minutes;
	totalTime= hrs+min;
	//console.log(tmp[tmp.length-1].alloc);

	workPercent = workPercent+Math.round((totalTime*parseInt(tmp[tmp.length-1].alloc))/100);

  //console.log(id+"(**)"+workPercent);
	for(var k =0; k< tasks.length; k++)
	{
		if(tasks[k].key == id){
		document.getElementById("alloc_"+tasks[k].key).innerHTML= "0%";
		tasks.splice(k, 1);
	 
		}

	}
	 console.log("Task Pop");
   console.log(tasks);
   
   percentage=Math.round(100/tasks.length);
	//tasks.push({key:id,value:time});
	for(var l=0;l<tasks.length;l++)
	{
	transaction.push({key:tasks[l].key,alloc:percentage,time:time});
	}
	 console.log("%^%^%^");
	console.log(transaction);
CalcAlloc(-1);
return workPercent;
}
function PopFromTask(id)
{
  	for(var i =tasks.length - 1; i >= 0; i--)
	{
		if(tasks[i].key === id){
			tasks.splice(i, 1);
		break;
		}

	}
}
//3
var alloc=0;
function CalcAlloc(val)
{
var per;
alloc=Math.abs(alloc+val);
if(alloc!==0)
	per=(100/tasks.length).toFixed(2);
else
	per=0;
 for(var i in tasks)
    {
    document.getElementById("alloc_"+tasks[i].key).innerHTML= per+"%";
    }
}
/*
********************************************************************************
***************************End Test*****************************************************
*/
var tickerID,tickerArray=[];
function TickerTimer(element,bool,sec)
{

  if(bool)
  {
    tickerID = setInterval(function(){
    sec=sec+1;
    $(element).prop('innerHTML',ConverterToHour(sec));
    //StoreTickerVal($(element).attr('id'));
      },1000);
    tickerArray.push({key:$(element).attr('id'),tid:tickerID});
    
  }
  else{

      for (var i in tickerArray)
      {
          if(tickerArray[i].key===$(element).attr('id'))
          {
          clearInterval(tickerArray[i].tid);
          
          }
      
      }
   
  }
}
function ConverterToHour(sec)
 {
    var min =parseInt(parseInt(sec) / 60);
    min = Math.floor(min);
    sec = parseInt(sec) % 60;
    var hrs = 0;
    if (min > 60) {
        hrs =Math.floor(min / 60);
        min = min % 60;
    }
    return hrs + ":" + min + ":" + sec;
}
function ConvertToSec(time)
{
var timeArray=[];
var hr,min,sec;
timeArray=time.split(":");
hr=parseInt(timeArray[0]);
sec=hr*3600;
min=parseInt(timeArray[1]);
min=min*60;
sec=sec+min;
sec=sec+parseInt(timeArray[2]);
return sec;
}


//Ticker -----------Last State
function StoreTickerVal(id)
{
  var val,elm;
  val=document.getElementById(id).innerHTML;
  
  if(lastValue.length>0)
  {
    for(var i in lastValue )
    {
      if(lastValue[i].key===id)
      {
        lastValue.splice(i,1);
       
      }
     
    }
  }
  
  lastValue.push({key:id,value:val});
  
//  console.log(lastValue);
  StoreTickerLastState(lastValue); 
}
function ClearTickerLocalStorage()
{
chrome.storage.local.remove('tickerLastState', function(){
//console.log("Ticker Data Removed");
});
} 
var tickerResult;
function StoreTickerLastState(array)
{
  /*chrome.storage.local.get('tickerLastState',function(res){
       console.log(res);
     for(var key in res)
     {
          if(res.hasOwnProperty(key))
          {
              tickerResult = res[key];
              console.log(tickerResult);
        
          }
     }
    var newData=RemoveDuplicate(result);*/
    ClearTickerLocalStorage();
    chrome.storage.local.set({'tickerLastState':array},function(){
      chrome.storage.local.get('tickerLastState',function(res){//console.log(res)
    
  });
    });
     
  
}



