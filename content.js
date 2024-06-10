console.log("Injection Successful")

let rec;
let user_Interactions = [];

// load user interactions from storage
chrome.storage.local.get('userInteractions', (result) => {
    if (result.user_Interactions) {
      user_Interactions = result.user_Interactions;
    }
});

// this will bind the click event and save the user interactions
window.addEventListener('click', (event) => {
    event.preventDefault();
    let interaction_click = {type: 'click', element: event.target.outerHTML};
    user_Interactions.push(interaction_click);
    console.log('The clicked element:', event.target.outerHTML);

    // This will send a message to the background script to save the interaction
    chrome.runtime.sendMessage({action: 'saveInteraction', interaction: interaction_click});
});

// this will bind the keydown event and save the user interactions
window.addEventListener('keydown', (event) => {
    user_Interactions.push({type: 'keydown', timestamp: Date.now(), key: event.key});
    console.log(user_Interactions);
    chrome.storage.local.set({userInteractions: user_Interactions});
});

// this requests user interactions from the background script
chrome.runtime.sendMessage({action: 'getUserInteractions'}, (response) => {
    let userinteract = response.userinteract;
    console.log('The received user interactions:', userinteract);
});

// this will start recording a media stream when it's called, and when the recording is stopped, 
// it saves the recording as a "screen-recording.webm" file.
function onAccessApproved(stream){
  rec = new MediaRecorder(stream);
  rec.start();
  rec.onstop = function(){
    stream.getTracks().forEach(function(track){
      if(track.readyState === "ready"){
        track.stop()
      }
      else{
        console.log("Track has stopped");
      }
    });
  }
  rec.ondataavailable = function(event)
  {
    let blobrecording  = event.data;
    let URL = URL.createObjectURL(blobrecording);
    let aTag = document.createElement("a");

    aTag.style.display = "none";
    aTag.href = URL;
    aTag.download = "screenrecording.webm"
    document.body.appendChild(aTag);
    aTag.click();
    document.body.removeChild(aTag);
    URL.revokeObjectURL(URL);
  }
}

