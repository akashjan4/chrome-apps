
var sec=0;
var validUser,username;
var result=[];
chrome.app.runtime.onLaunched.addListener(function(launchData) {

 chrome.app.window.create(
    'popup.html',
    {
      id: 'mainWindow',
      frame:"none",
   outerBounds: {width:1024,height:800, minWidth:800, maxWidth:1024,minHeight:600,maxHeight:800}
    },function(win)
    {

      win.onClosed.addListener(function() {
          console.log("the window is closed now.");
          
         
//---
      chrome.storage.local.get('unFinishedTask',function(res){
           console.log(res);
     for(var key in res)
     {
          if(res.hasOwnProperty(key))
          {
              result = res[key];
              console.log(result);
        
          }
     }
      
    var opt = {type: "basic",title: "Pending Task",message:result.length+" Task(s) Pending", iconUrl:"img/144.png"};
      chrome.notifications.create("al20",opt , function()
          {
            console.log("notification");
        

          });
          
         
         
    });
       chrome.storage.local.get('tickerLastState',function(res){
           console.log('tickerLastState');
           console.log(res);
       });       
//----
       });
       
      
    
  });
  
  
/*crome.alarms.onAlarm.addListener(function(e){
  if(e.name=="close_app_notifiy")
  {
      opt = {type: "basic",  title:"ReOpen App!",  message:"App is Closed, Reopen to proceed",buttons:[{title:'Open', iconUrl:'img/ic_action_settings.png'}], iconUrl:"img/ic_action_warning.png"};
      chrome.notifications.create("open20",opt,function(){});
  }
 
})  ;*/
chrome.identity.getProfileUserInfo(function(userinfo){
var user =userinfo.email;
console.log(user);
 var opt;
 if(user==="")
 {
    opt = {type: "basic",
  title:"Error!",
  message:"User is Not Logged in",
    buttons:[{title:'Go Setting', iconUrl:'img/ic_action_settings.png'}],
   iconUrl:"img/ic_action_warning.png"};
   SetValidUser(false,"");
 }
 else if(user.indexOf("techendeavour")>-1)
 {
  opt = {type: "basic",
  title:"Welcome!",
  message:user,
  buttons:[{title:'Go Setting', iconUrl:'img/ic_action_settings.png'}],
   iconUrl:"img/144.png"};
  SetValidUser(true,user);
 }
 else
 {
  opt = {type: "basic",
  title:"Invalid User",
  message:user +" is Not a Vaild ID",
  expandedMessage: "You need to login into chrome using Valid Techendeavour ID",
  buttons:[{title:'Go Setting', iconUrl:'img/ic_action_settings.png'}],
  iconUrl:"img/ic_action_error.png"};
   SetValidUser(false);
 }

          chrome.notifications.create("al20",opt , function()
          {
            console.log("notification");

          });
          chrome.notifications.onButtonClicked.addListener(function()
          {
            console.log("notification click");
            window.open("https://accounts.google.com/login");
          });

});
Show();
});

function CallMe(){
  console.log("Suspend");
}
function Show()
{
console.log("load");
chrome.idle.setDetectionInterval(15);
var time = 0;
var lock = 0;
chrome.idle.onStateChanged.addListener(function (newState) {
    if (newState == "idle") {
        // Reset the state as you wish
        console.log("Idle State Detected " + time);
        console.log("Idle Start @"+GetNowLocalTime());
        setInterval(function () { time = parseInt(time) + 1; }, 1000);
    }
    if (newState == "active") {


        console.log("***************active start********************************************");
        console.log("active @"+GetNowLocalTime());
        console.log("inactive:" + time + "sec Locked:" + lock + "sec");
        console.log("lock For:" + ConverterToHour(lock));
        console.log("Total Idle Time" + ConverterToHour(time));
        console.log("***************active end********************************************");
    }
    if (newState == "locked") {
          console.log("Locked @"+GetNowLocalTime());
        setInterval(function () { lock = parseInt(lock) + 1; }, 1000);
        //convert sec to hr:mm:sec
       }

});

}

function GetNowLocalTime()
{
var t =new Date().getTime();
var date = new Date(t);// Milliseconds to date
var tmp=date.toString().split(" ");
return tmp[4];
}
function ConverterToHour(sec)
 {
    var min =parseInt(parseInt(sec) / 60);
    min = parseInt(min);
    var lsec = parseInt(sec) % 60;
    var hrs = 0;
    if (min > 60) {
        hrs =parseInt(min / 60);
        min = min % 60;
    }
    return hrs + ":" + min + ":" + lsec;
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
function SetValidUser(bool,user)
{
    username=user;
   validUser=bool;
}
function GetValidUser()
{

   return validUser;
}
function GetUserName()
{
  return username;

}
