<template>
  <el-container>
    <el-main>
      <el-tabs tab-position="left">
        <el-tab-pane>
          <template v-slot:label>
            <icon-bi-display></icon-bi-display>
          </template>
          <el-row v-for="session in recentlyClosedSessions"
                  :key="session.tab ? session.tab.sessionId : session.window.sessionId" justify="center">
            <el-col :span="16">
              <list-item v-if="session.tab"
                         :item="{ title: session.tab.title, url: session.tab.url, time: session.lastModified }"
                         @itemClick="reopenSession(session.tab.sessionId)" action-panel @copyLink="copyLink(session.tab.url)"></list-item>

              <session-window-item v-if="session.window" :session="session"></session-window-item>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane v-for="device in devices" :key="device.deviceName" :label="device.deviceName">
          <el-row v-for="session in device.sessions"
                  :key="session.tab ? session.tab.sessionId : session.window.sessionId" justify="center">
            <el-col :span="16">
              <list-item v-if="session.tab"
                         :item="{ title: session.tab.title, url: session.tab.url, time: session.lastModified }"
                         @itemClick="reopenSession(session.tab.sessionId)" action-panel @copyLink="copyLink(session.tab.url)"></list-item>

              <session-window-item v-if="session.window" :session="session"></session-window-item>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import Session = chrome.sessions.Session
import Device = chrome.sessions.Device
import {defineComponent, reactive, toRefs} from "vue"
import ListItem from "./listItem.vue";
import SessionWindowItem from "./sessionWindowItem.vue";
import { reopenSession, copyLink } from "./helper";

export default defineComponent({
  components: {SessionWindowItem, ListItem},
  setup() {
    const data = reactive({
      recentlyClosedSessions: <Session[]>null,
      devices: <Device[]>null,
    })

    chrome.sessions.getRecentlyClosed(sessions => {
      data.recentlyClosedSessions = sessions;
    })

    chrome.sessions.getDevices(devices => {
      data.devices = devices;
    })

    return {
      ...toRefs(data),
      reopenSession, copyLink
    }
  }
})
</script>

<style scoped>
svg, img {
  vertical-align: middle;
}

</style>
