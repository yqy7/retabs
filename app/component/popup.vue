<template>
  <div class="popup">

    <div>
      <div class="title" id="recentlyClosedWindowsAndTabs">
        {{ i18n('recentlyClosedWindowsAndTabs') }}
      </div>
      <div v-for="(session, index) in recentlyClosedSessions"
           :key="session.tab ? session.tab.sessionId : session.window.sessionId">
        <div v-if="index < 5 || showMoreClosedTabs">
          <div v-if="session.tab" class="item-info" @click="reopenSession(session.tab.sessionId)">
            <div>
              <img :src="getFavicon(session.tab.url)" class="favicon-img"/>
            </div>
            <div class="item-detail">
              <div :title="session.tab.title">
                {{ session.tab.title }}
              </div>
              <div :title="session.tab.url" class="item-detail-url">
                {{ session.tab.url }}
              </div>
              <div>
                {{ epochFormat(session.lastModified) }}
              </div>
            </div>
          </div>

          <div v-if="session.window" class="window-info">
            <div class="win-title" @click="reopenSession(session.window.sessionId)">
              <icon-bi-window></icon-bi-window>
              <span style="font-size: 0.8em;">{{ i18n('openInNewWindow') }}</span>
            </div>
            <div v-for="tab in session.window.tabs"
                 class="item-info" :key="tab.sessionId" @click="reopenSession(tab.sessionId)">
              <div>
                <img :src="getFavicon(tab.url)" class="favicon-img"/>
              </div>
              <div class="item-detail">
                <div :title="tab.title">
                  {{ tab.title }}
                </div>
                <div :title="tab.url" class="item-detail-url">
                  {{ tab.url }}
                </div>
                <div>
                  {{ epochFormat(session.lastModified) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!showMoreClosedTabs" @click="showMoreClosedTabs = true" class="show-more-less">
        {{ i18n('showMore') }}
      </div>
      <div v-if="showMoreClosedTabs" @click="showMoreClosedTabs = false" class="show-more-less">
        {{ i18n('showLess') }}
      </div>
    </div>

    <div v-for="device in devices" :key="device.deviceName">
      <div class="title" :id="device.deviceName"> {{ device.deviceName }}</div>
      <div v-for="session in device.sessions"
           :key="session.tab ? session.tab.sessionId : session.window.sessionId">
        <div v-if="session.tab" class="item-info" @click="reopenSession(session.tab.sessionId)">
          <div>
            <img :src="getFavicon(session.tab.url)" class="favicon-img"/>
          </div>
          <div class="item-detail">
            <div :title="session.tab.title">
              {{ session.tab.title }}
            </div>
            <div :title="session.tab.url" class="item-detail-url">
              {{ session.tab.url }}
            </div>
            <div>
              {{ epochFormat(session.lastModified) }}
            </div>
          </div>
        </div>

        <div v-if="session.window" class="window-info">
          <div class="win-title" @click="reopenSession(session.window.sessionId)">
            <icon-bi-window></icon-bi-window>
            <span style="font-size: 0.8em;">{{ i18n('openInNewWindow') }}</span>
          </div>
          <div v-for="tab in session.window.tabs"
               class="item-info" :key="tab.sessionId" @click="reopenSession(tab.sessionId)">
            <div>
              <img :src="getFavicon(tab.url)" class="favicon-img"/>
            </div>
            <div class="item-detail">
              <div :title="tab.title">
                {{ tab.title }}
              </div>
              <div :title="tab.url" class="item-detail-url">
                {{ tab.url }}
              </div>
              <div>
                {{ epochFormat(session.lastModified) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="title" id="history">{{ i18n('history') }}</div>
      <div v-for="history in historyItems" class="item-info" :key="history.id" @click="openUrl(history.url)">
        <div>
          <img :src="getFavicon(history.url)" class="favicon-img">
        </div>
        <div class="item-detail">
          <div>
            {{ history.title }}
          </div>
          <div class="item-detail-url" :title="history.url">
            {{ history.url }}
          </div>
          <div>
            {{ epochFormat(history.lastVisitTime / 1000) }}
          </div>
        </div>
      </div>
      <div @click="openHistory" class="show-more-less">
        {{ i18n('moreHistory') }}
      </div>
    </div>

    <div class="anchors">
      <div class="anchor-item">
        <a href="#recentlyClosedWindowsAndTabs" :title="i18n('recentlyClosedWindowsAndTabs')">
          <icon-bi-files></icon-bi-files>
        </a>
      </div>
      <div v-for="device in devices" :key="device.deviceName" class="anchor-item">
        <a :href="'#' + device.deviceName" :title="device.deviceName">
          <icon-bi-laptop></icon-bi-laptop>
        </a>
      </div>
      <div class="anchor-item">
        <a href="#history" :title="i18n('history')">
          <icon-bi-clock-history></icon-bi-clock-history>
        </a>
      </div>
      <div class="anchor-item">
        <a href="#" @click="openSettings" :title="i18n('settings')">
          <icon-bi-gear></icon-bi-gear>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Session = chrome.sessions.Session
import Device = chrome.sessions.Device
import HistoryItem = chrome.history.HistoryItem
import {unix} from 'dayjs'
import {defineComponent, reactive, toRefs} from 'vue'

export default defineComponent({
  setup() {
    const data = initData()
    return {
      ...toRefs(data),
      ...useActionMethods(),
      ...useHelperMethods(),
    }
  }
})

function initData() {
  const data = reactive({
    recentlyClosedSessions: <Session[]>null,
    devices: <Device[]>null,
    historyItems: <HistoryItem[]>null,
    showMoreClosedTabs: false
  })
  chrome.sessions.getRecentlyClosed(sessions => {
    data.recentlyClosedSessions = sessions;
  })
  chrome.sessions.getDevices(devices => {
    data.devices = devices;
  })
  chrome.history.search({text: '', maxResults: 20}, results => {
    data.historyItems = results;
  })
  return data
}

function useHelperMethods() {
  const epochFormat = (epoch: number) => {
    if (epoch) {
      return unix(epoch).format('YYYY-MM-DD HH:mm:ss');
    }
    return null;
  }
  const getFavicon = (url: string) => {
    return 'chrome://favicon/size/32/' + url;
  }

  return {
    epochFormat,
    getFavicon
  }
}

function useActionMethods() {
  const openUrl = (url: string) => {
    chrome.tabs.query({url}, function (b) {
      b.length ? chrome.tabs.update(b[0].id, {active: !0}) : chrome.tabs.create({url});
    });
  }
  const openHistory = () => {
    let url = 'chrome://history/';
    openUrl(url);
    window.close();
  }
  const openSettings = () => {
    let url = chrome.extension.getURL("pages/options.html");
    openUrl(url);
    window.close();
  }
  const reopenSession = (sessionId: string) => {
    chrome.sessions.restore(sessionId, (restoredSession: Session) => {
      console.log(restoredSession);
    });
  }

  return {
    openUrl,
    openHistory,
    openSettings,
    reopenSession
  }
}

</script>

<style scoped>
.popup {
  width: 400px;
  padding: 10px 0;
}

.item-info {
  margin: 10px;
  padding: 2px 5px;
  border: 1px solid lightgray;
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 0.8em;
  cursor: pointer;
}

.item-info:hover {
  background-color: lightgray;
  box-shadow: 1px 1px 1px lightgray;
}

.favicon-img {
  width: 32px;
  height: 32px;
}

.item-detail {
  margin-left: 10px;
}

.item-detail-url {
  color: blue;
}

.window-info {
  border: 1px solid lightgray;
  margin: 10px;
}

.title {
  padding: 0 10px;
  font-size: 1rem;
}

.win-title {
  padding: 0 10px;
  cursor: pointer;
  text-align: center;
}

.win-title + .item-info {
  margin: 5px 10px;
}

.win-title:hover {
  text-decoration: underline blue;
  text-decoration-thickness: 1px;
}

.show-more-less {
  color: blue;
  text-align: center;
  cursor: pointer;
  font-size: .8em;
}

.anchors {
  position: fixed;
  right: 10px;
  top: 200px;
  font-size: 1.5em;
  text-align: center;
  border: 1px solid deepskyblue;
  border-radius: 5px;
  background-color: whitesmoke;
}

.anchor-item {
  width: 40px;
  height: 40px;
  line-height: 2;
}

.anchor-item:hover {
  background-color: lightgray;
}

svg, img {
  vertical-align: middle;
}
</style>
