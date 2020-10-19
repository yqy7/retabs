<template>
  <div class="options">
    <div class="title" title="ReTabs">
      <img :src="imgUrl" style="margin-right: 10px;">
      ReTabs
    </div>
    <div class="content-panel container">
      <div class="setting-item">
        <b-form-checkbox size="lg" v-model="disablePopup" switch @change="changeDisablePopup">Disable Popup</b-form-checkbox>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      disablePopup: false,
      imgUrl: chrome.extension.getURL("images/icon-32x32@2x.png")
    }
  },
  created() {
    chrome.storage.local.get('disablePopup', (result) => {
      this.disablePopup = result['disablePopup'];
    });
  },
  methods: {
    changeDisablePopup(disabled: boolean) {
      this.disablePopup = disabled;
      chrome.storage.local.set({disablePopup: disabled});
      let listener = function (tab:Tab) {
        chrome.sessions.getRecentlyClosed({maxResults: 1}, sessions => {
          if (sessions[0]) {
            let sessionId = sessions[0].tab ? sessions[0].tab.sessionId : sessions[0].window.sessionId;
            chrome.sessions.restore(sessionId, (restoredSession: Session) => {
              console.log(restoredSession);
            });
          }
        });
      };

      if (disabled) {
        chrome.browserAction.onClicked.addListener(listener);
        chrome.browserAction.setPopup({popup: ''});
      } else {
        chrome.browserAction.onClicked.removeListener(listener);
        chrome.browserAction.setPopup({popup: 'pages/popup.html'});
      }
    }
  }
}
</script>

<style scoped>
.options {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  flex-direction: column;
}
.content-panel {
  margin-top: 30px;
  height: 50%;
  width: 60%;
  border: 1px solid lightgray;
  border-radius: 5px;
  box-shadow: 2px 2px 2px lightgrey;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.title {
  font-size: 2em;
  font-weight: bold;
  color: darkgrey;
}
.setting-item {
  margin: 10px 0;
}
</style>
