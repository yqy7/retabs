<template>
  <div class="popup">
    <div class="search-bar">
      <el-input v-model="searchText" :placeholder="i18n('searchHistory')" @change="changeSearchText"></el-input>
    </div>

    <div v-if="searchHistoryItems === null">
      <!-- 最近的session -->
      <div>
        <div class="title" id="recentlyClosedWindowsAndTabs">
          {{ i18n('recentlyClosedWindowsAndTabs') }}
        </div>
        <div v-for="(session, index) in recentlyClosedSessions"
             :key="session.tab ? session.tab.sessionId : session.window.sessionId">
          <div v-if="index < 5 || showMoreClosedTabs">
            <list-item v-if="session.tab"
                       :item="{ title: session.tab.title, url: session.tab.url, time: session.lastModified }"
                       @itemClick="reopenSession(session.tab.sessionId)" action-panel
                       @copyLink="copyLink(session.tab.url)"></list-item>

            <session-window-item v-if="session.window" :session="session"></session-window-item>
          </div>
        </div>

        <div v-if="!showMoreClosedTabs" @click="showMoreClosedTabs = true" class="show-more-less">
          {{ i18n('showMore') }}
        </div>
        <div v-if="showMoreClosedTabs" @click="showMoreClosedTabs = false" class="show-more-less">
          {{ i18n('showLess') }}
        </div>
      </div>

      <!-- 其他设备的session -->
      <div v-for="device in devices" :key="device.deviceName">
        <div class="title" :id="device.deviceName"> {{ device.deviceName }}</div>
        <div v-for="session in device.sessions"
             :key="session.tab ? session.tab.sessionId : session.window.sessionId">
          <list-item v-if="session.tab"
                     :item="{ title: session.tab.title, url: session.tab.url, time: session.lastModified }"
                     @itemClick="reopenSession(session.tab.sessionId)" action-panel
                     @copyLink="copyLink(session.tab.url)"></list-item>

          <session-window-item v-if="session.window" :session="session"></session-window-item>
        </div>
      </div>

      <!-- 历史记录 -->
      <div id="history">
        <div class="title">{{ i18n('history') }}</div>
        <list-item v-for="it in historyItems" :key="it.id"
                   :item="{ url: it.url, title: it.title, time: it.lastVisitTime/1000, visitCount: it.visiCount }"
                   @itemClick="openUrl(it.url)" action-panel @copyLink="copyLink(it.url)"></list-item>
        <div @click="openHistory" class="show-more-less">
          {{ i18n('moreHistory') }}
        </div>
      </div>

      <!-- 按钮 -->
      <div class="anchors">
        <el-button size="small" @click="changeAnchor('#recentlyClosedWindowsAndTabs')"
                   :title="i18n('recentlyClosedWindowsAndTabs')">
          <icon-bi-files></icon-bi-files>
        </el-button>
        <el-button v-for="device in devices" :key="device.deviceName" :title="device.deviceName"
                   @click="changeAnchor('#' + device.deviceName)" size="small">
          <icon-bi-laptop></icon-bi-laptop>
        </el-button>
        <el-button size="small" :title="i18n('history')" @click="changeAnchor('#history')">
          <icon-bi-clock-history></icon-bi-clock-history>
        </el-button>
        <el-button size="small" @click="openSettings" :title="i18n('settings')">
          <icon-bi-gear></icon-bi-gear>
        </el-button>
      </div>
    </div>

    <div v-else>
      <div class="title">{{ i18n('history') }}</div>
      <list-item v-for="it in searchHistoryItems" :key="it.id"
                 :item="{ url: it.url, title: it.title, time: it.lastVisitTime/1000, visitCount: it.visiCount }"
                 @itemClick="openUrl(it.url)" action-panel @copyLink="copyLink(it.url)"></list-item>
      <div @click="openHistory" class="show-more-less">
        {{ i18n('moreHistory') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Session = chrome.sessions.Session
import Device = chrome.sessions.Device
import HistoryItem = chrome.history.HistoryItem
import {defineComponent, reactive, toRefs} from 'vue'
import {getFavicon, epochFormat, openUrl, openHistory, openSettings, reopenSession, copyLink} from "./helper";
import ListItem from "./listItem.vue";
import SessionWindowItem from "./sessionWindowItem.vue";
import 'element-plus/theme-chalk/el-message.css';

export default defineComponent({
  components: {ListItem, SessionWindowItem},
  setup() {
    const data = initData()
    const changeSearchText = () => {
      if (data.searchText === '') {
        data.searchHistoryItems = null;
      } else {
        chrome.history.search({text: data.searchText, maxResults: 50}, results => {
          data.searchHistoryItems = results;
        })
      }
    }

    const changeAnchor = (anchor) => {
      window.location = anchor
    }

    return {
      // data
      ...toRefs(data),

      // method
      getFavicon,
      epochFormat,
      openUrl,
      openHistory,
      openSettings,
      reopenSession,
      changeSearchText,
      changeAnchor,
      copyLink
    }
  }
})

function initData() {
  const data = reactive({
    recentlyClosedSessions: <Session[]>null,
    devices: <Device[]>null,
    historyItems: <HistoryItem[]>null,
    searchHistoryItems: <HistoryItem[]>null,
    showMoreClosedTabs: false,
    searchText: ''
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
</script>

<style scoped>
.popup {
  width: 400px;
  padding: 5px 0 10px 0;
}

.search-bar {
  margin: 5px 10px;
}

.title {
  padding: 5px 10px;
  font-size: 1rem;
}

.show-more-less {
  color: #409EFF;
  text-align: center;
  cursor: pointer;
  font-size: .8em;
}

.anchors {
  position: fixed;
  right: 0;
  top: 200px;
  border: 1px solid #409EFF;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}

.anchors .el-button {
  margin: 0;
  padding: 0;
  width: 40px;
  height: 40px;
}

.anchors .el-button + .el-button {
  border-top: 0;
}
</style>
