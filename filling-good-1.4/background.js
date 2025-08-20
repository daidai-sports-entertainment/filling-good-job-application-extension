chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.tabs.sendMessage(tab.id, { action: "toggleSidebar" });
  } catch (error) {
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ["content.css"]
    });
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
    
    setTimeout(() => {
      chrome.tabs.sendMessage(tab.id, { action: "toggleSidebar" });
    }, 100);
  }
});