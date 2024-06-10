document.addEventListener("DOMContentLoaded", ()=>{

  // get the selectors of the buttons
  const startVideoButton = document.querySelector("button#start_video")
  const stopVideoButton = document.querySelector("button#stop_video")

  // add event listeners
  startVideoButton.addEventListener("click", ()=>{
      chrome.tabs.query({}, function(tabs){
          tabs.forEach(function(tab){
              chrome.tabs.sendMessage(tab.id, {action: "request_recording"},  function(){
                  if(!chrome.runtime.lastError)
                  {
                    startVideoButton.disabled = true;
                    stopVideoButton.disabled = false;
                    console.log("Stop video enabled")
                  } 
                  else
                  {
                    console.log(chrome.runtime.lastError)
                  }
              })
          })
      })
  })
  
  stopVideoButton.addEventListener("click", ()=>{
    chrome.tabs.query({}, function(tabs){
        tabs.forEach(function(tab){
            chrome.tabs.sendMessage(tab.id, {action: "stopvideo"},  function(res){
                if(!chrome.runtime.lastError){
                    console.log(res)
                    startVideoButton.disabled = false;
                    stopVideoButton.disabled = true;
                } 
                else
                {
                    console.log(chrome.runtime.lastError)
                }
            })
        })
    })
  })

  const replay_Button = document.getElementById('replay_interface');
  replay_Button.addEventListener('click', function() {
      chrome.tabs.create({url: 'replay.html'});
  });

})