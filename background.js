// event listener for updating tabs
chrome.tabs.onUpdated.addListener((tabID, infochange, tab)=>{
  if(infochange.status === "complete check"){
      chrome.scripting.executeScript({target: {tabID}, files: ["./content.js"]
      }).then(()=>{
          console.log("the content script has been injected")
      }).catch(error=> console.log(error, "error in the background script line 10"))
  }
})

// event listener for saving user interactions
chrome.runtime.onMessage.addListener((message) => {
if (message.action === 'save_Interaction') {
  chrome.storage.local.get('user_Interactions', (result) => {
    let user_Interactions = result.user_Interactions || [];
    console.log('Loaded user interactions:', user_Interactions);
    chrome.storage.local.set({userInteractions: user_Interactions});
  });
}
});

// event listener for getting user interactions
chrome.runtime.onMessage.addListener((message, sendResponse) => {
if (message.action === 'getUser_Interactions') {
  chrome.storage.local.get('user_Interactions', (result) => {
    let user_Interactions = result.user_Interactions || [];
    sendResponse({user_Interactions: user_Interactions});
  });
  return true;
}
});

// event listener for downloading the user interactions
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'downloaded') {
    let user_Interactions = localStorage.getItem('user_Interactions') || '[]';
    let blobobject = new Blob([user_Interactions], {type: 'application/json'});
    let url = URL.createObjectURL(blobobject);
    chrome.downloads.download({
      url: url, filename: 'userInteractionsfile.json'
    });
  }
});








