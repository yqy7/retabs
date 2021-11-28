chrome.runtime.onInstalled.addListener((details) => {
    console.log('installed', details)
});

const listener = () => {
    chrome.sessions.getRecentlyClosed({maxResults: 1}, sessions => {
        if (sessions[0]) {
            let sessionId = sessions[0].tab ? sessions[0].tab.sessionId : sessions[0].window.sessionId;
            chrome.sessions.restore(sessionId, restoredSession => {
                console.log(restoredSession);
            });
        }
    })
}

chrome.storage.local.get('disablePopup', (result) => {
    if (result && result['disablePopup']) {
        chrome.browserAction.onClicked.addListener(listener);
        chrome.browserAction.setPopup({popup: ''});
    } else {
        chrome.browserAction.setPopup({popup: 'pages/popup.html'});
    }
})

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.disablePopup) {
        if (changes.disablePopup.newValue) {
            chrome.browserAction.onClicked.addListener(listener);
            chrome.browserAction.setPopup({popup: ''});
        } else {
            chrome.browserAction.onClicked.removeListener(listener);
            chrome.browserAction.setPopup({popup: 'pages/popup.html'});
        }
    }
})


