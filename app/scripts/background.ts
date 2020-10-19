
import Session = chrome.sessions.Session;
import Tab = chrome.tabs.Tab;

chrome.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
});

chrome.storage.local.get('disablePopup', (result) => {
  if (result && result['disablePopup']) {
    chrome.browserAction.onClicked.addListener(function (tab:Tab) {
      chrome.sessions.getRecentlyClosed({maxResults: 1}, sessions => {
        if (sessions[0]) {
          let sessionId = sessions[0].tab ? sessions[0].tab.sessionId : sessions[0].window.sessionId;
          chrome.sessions.restore(sessionId, (restoredSession: Session) => {
            console.log(restoredSession);
          });
        }
      });
    });
    chrome.browserAction.setPopup({popup: ''});
  } else {
    chrome.browserAction.setPopup({popup: 'pages/popup.html'});
  }
});
