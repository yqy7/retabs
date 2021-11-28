<template>
  <div class="window-info">
    <div class="win-title" @click="reopenSession(session.window.sessionId)">
      <icon-bi-window></icon-bi-window>
      <span style="font-size: 0.8em; margin-left: 5px;">{{ i18n('openInNewWindow') }}</span>
    </div>

    <div v-for="tab in session.window.tabs" :key="tab.sessionId">
      <list-item :item="{
        title: tab.title,
        url: tab.url,
        time: session.lastModified,
      }" action-panel @copyLink="copyLink(tab.url)" @itemClick="reopenSession(tab.sessionId)"></list-item>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import ListItem from "./listItem.vue";
import {reopenSession, copyLink} from "./helper";

export default defineComponent({
  components: {ListItem},
  props: {
    session: Object
  },
  setup() {
    return {
      copyLink, reopenSession
    }
  }
})
</script>

<style scoped>
svg, img {
  vertical-align: middle;
}

.window-info {
  border: 1px solid lightgray;
  margin: 5px;
}

.win-title {
  padding: 5px 10px 0 10px;
  cursor: pointer;
  text-align: center;
}

.win-title:hover {
  text-decoration: underline var(--el-color-primary);
  text-decoration-thickness: 1px;
}
</style>
