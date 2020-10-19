<template>
<div class="popup">

  <div>
    <div class="title" name="recentlyClosedWindowsAndTabs" id="recentlyClosedWindowsAndTabs">{{i18n('recentlyClosedWindowsAndTabs')}}</div>
    <div v-for="(session, index) in recentlyClosedSessions"
         :key="session.tab ? session.tab.sessionId : session.window.sessionId">
      <div v-if="index < 5 || showMoreClosedTabs">
        <div v-if="session.tab" class="item-info" @click="reopenSession(session.tab.sessionId)">
          <div>
            <img :src="getFavicon(session.tab.url)" class="favicon-img" />
          </div>
          <div class="item-detail">
            <div :title="session.tab.title">
              {{ session.tab.title }}
            </div>
            <div :title="session.tab.url" class="item-detail-url">
              {{ session.tab.url }}
            </div>
            <div>
              {{ session.lastModified | epochFormat }}
            </div>
          </div>
        </div>

        <div v-if="session.window" class="window-info">
          <div class="win-title" @click="reopenSession(session.window.sessionId)">
            <b-icon-window></b-icon-window> <span style="font-size: 0.5em;">{{i18n('openInNewWindow')}}</span>
          </div>
          <div v-for="tab in session.window.tabs"
               class="item-info" :key="tab.sessionId" @click="reopenSession(tab.sessionId)">
            <div>
              <img :src="getFavicon(tab.url)" class="favicon-img" />
            </div>
            <div class="item-detail">
              <div :title="tab.title">
                {{ tab.title }}
              </div>
              <div :title="tab.url" class="item-detail-url">
                {{ tab.url }}
              </div>
              <div>
                {{ session.lastModified | epochFormat }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!showMoreClosedTabs" @click="showMoreClosedTabs = true" class="show-more-less">
      {{i18n('showMore')}}
    </div>
    <div v-if="showMoreClosedTabs" @click="showMoreClosedTabs = false" class="show-more-less">
      {{i18n('showLess')}}
    </div>
  </div>

  <div v-for="device in devices" :key="device.deviceName">
    <div class="title" :name="device.deviceName" :id="device.deviceName"> {{ device.deviceName }}</div>
    <div v-for="session in device.sessions"
         :key="session.tab ? session.tab.sessionId : session.window.sessionId">
      <div v-if="session.tab" class="item-info" @click="reopenSession(session.tab.sessionId)">
        <div>
          <img :src="getFavicon(session.tab.url)" class="favicon-img" />
        </div>
        <div class="item-detail">
          <div :title="session.tab.title">
            {{ session.tab.title }}
          </div>
          <div :title="session.tab.url" class="item-detail-url">
            {{ session.tab.url }}
          </div>
          <div>
            {{ session.lastModified | epochFormat }}
          </div>
        </div>
      </div>

      <div v-if="session.window" class="window-info">
        <div class="win-title" @click="reopenSession(session.window.sessionId)">
          <b-icon-window></b-icon-window> <span style="font-size: 0.5em;">{{i18n('openInNewWindow')}}</span>
        </div>
        <div v-for="tab in session.window.tabs"
             class="item-info" :key="tab.sessionId" @click="reopenSession(tab.sessionId)">
          <div>
            <img :src="getFavicon(tab.url)" class="favicon-img" />
          </div>
          <div class="item-detail">
            <div :title="tab.title">
              {{ tab.title }}
            </div>
            <div :title="tab.url" class="item-detail-url">
              {{ tab.url }}
            </div>
            <div>
              {{ session.lastModified | epochFormat }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div>
    <div class="title" name="history" id="history">{{i18n('history')}}</div>
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
          {{ history.lastVisitTime/1000 | epochFormat }}
        </div>
      </div>
    </div>
    <div @click="openHistory" class="show-more-less">
      {{i18n('moreHistory')}}
    </div>
  </div>

  <div class="anchors">
    <div class="anchor-item">
      <a href="#recentlyClosedWindowsAndTabs" :title="i18n('recentlyClosedWindowsAndTabs')">
        <b-icon-files></b-icon-files>
      </a>
    </div>
    <div v-for="device in devices" :key="device.deviceName" class="anchor-item">
      <a :href="'#' + device.deviceName" :title="device.deviceName">
        <b-icon-laptop></b-icon-laptop>
      </a>
    </div>
    <div class="anchor-item">
      <a href="#history" :title="i18n('history')">
        <b-icon-clock-history></b-icon-clock-history>
      </a>
    </div>
    <div class="anchor-item">
      <a href="#" @click="openSettings" :title="i18n('settings')">
        <b-icon-gear></b-icon-gear>
      </a>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import Session = chrome.sessions.Session;
import Device = chrome.sessions.Device;
import HistoryItem = chrome.history.HistoryItem;

import * as dayjs from "dayjs";

export default {
  data() {
    return {
      recentlyClosedSessions: <Session[]>null,
      devices: <Device[]> null,
      historyItems: <HistoryItem[]>null,
      showMoreClosedTabs: false
    }
  },
  created() {
    chrome.sessions.getRecentlyClosed(sessions => {
      this.recentlyClosedSessions = sessions;
    });
    chrome.sessions.getDevices(devices => {
      this.devices = devices;
    });
    chrome.history.search({text: '', maxResults: 20}, results => {
      this.historyItems = results;
    });
  },
  methods: {
    reopenSession(sessionId: string) {
      chrome.sessions.restore(sessionId, (restoredSession: Session) => {
        console.log(restoredSession);
      });
    },
    getFavicon(url: string) {
      return 'chrome://favicon/size/32/' + url;
    },
    openUrl(url: string) {
      chrome.tabs.query({ url }, function(b) {
        b.length ? chrome.tabs.update(b[0].id, {active: !0}) : chrome.tabs.create({ url });
      });
    },
    openHistory() {
      let url = 'chrome://history/';
      this.openUrl(url);
      window.close();
    },
    openSettings() {
      let url = chrome.extension.getURL("pages/options.html");
      this.openUrl(url);
      window.close();
    }
  },
  filters: {
    epochFormat(epoch: number) {
      if (epoch) {
        return dayjs.unix(epoch).format('YYYY-MM-DD HH:mm:ss');
      }
      return null;
    }
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
  padding: 0 5px;
  border: 1px solid lightgray;
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 0.5em;
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
}
.win-title {
  padding: 0 10px;
  cursor: pointer;
  text-align: center;
}
.win-title+.item-info {
  margin: 5px 10px;
}
.win-title:hover {
  text-decoration: underline blue;
  text-decoration-thickness: 3px;
}
.show-more-less {
  color: blue;
  text-align: center;
  cursor: pointer;
  font-size: .5em;
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
}
.anchor-item:hover {
  background-color: lightgray;
}
</style>
