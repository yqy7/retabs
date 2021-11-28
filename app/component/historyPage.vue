<template>
  <el-container class="container">
    <!-- 打开chrome原生的历史记录 -->
    <el-header>
      <el-row justify="center">
        <el-col :span="4">
          <el-date-picker v-model="selectedDate" type="date" @change="updateHistoryList"></el-date-picker>
        </el-col>
        <el-col :span="12">
          <el-input v-model="searchText" :placeholder="i18n('search')" @change="updateHistoryList">
          </el-input>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-row v-for="(it, idx) in historyItems" :key="it.id" justify="center">
        <el-col :span="16">
          <list-item :item="{ url: it.url, title: it.title, time: it.lastVisitTime/1000, visitCount: it.visitCount }"
                     actionPanel @itemClick="openUrl(it.url)" @deleteItem="removeHistory(idx, it.url)"
                     @copyLink="copyLink(it.url)"></list-item>
        </el-col>
      </el-row>
    </el-main>

    <div class="float-button">
      <el-button @click="openChromeHistory" size="mini" :title="i18n('chromeHistory')">
        <img :src="getFavicon('chrome://history/')" class="float-button-img">
      </el-button>
    </div>
  </el-container>
</template>

<script lang="ts">
// Chrome history api 存在bug，只能获取本地的历史记录
// https://bugs.chromium.org/p/chromium/issues/detail?id=474511

import {defineComponent, ref} from "vue";
import ListItem from "./listItem.vue";
import {ElMessage} from 'element-plus'
import {openUrl, getFavicon, epochFormat, openChromeHistory, copyLink} from "./helper";

export default defineComponent({
  components: {ListItem, ElMessage},
  setup() {
    const searchText = ref('')
    const historyItems = ref([])
    const selectedDate = ref(new Date(new Date().toLocaleDateString()))

    const updateHistoryList = () => {
      let searchDate = selectedDate.value;
      let startTime = searchDate.valueOf();
      let endTime = new Date(searchDate).setDate(searchDate.getDate() + 1);

      chrome.history.search({text: searchText.value, startTime, endTime, maxResults: 10000}, (hItems) => {
        hItems = hItems.filter(a => a.lastVisitTime >= startTime && a.lastVisitTime < endTime);
        hItems.sort((a, b) => b.lastVisitTime - a.lastVisitTime);
        historyItems.value = hItems;
        // console.log(hItems);
      });
    }

    const removeHistory = (idx: number, url: string) => {
      console.log('delete url:' + url);
      historyItems.value.splice(idx, 1);
      chrome.history.deleteUrl({url});
    }

    // 获取历史记录
    updateHistoryList()

    return {
      // data
      searchText, historyItems, selectedDate,
      // methods
      updateHistoryList, removeHistory, openChromeHistory, openUrl, getFavicon, epochFormat, copyLink
    }
  }
})
</script>

<style scoped>
.container {
  margin-top: 50px;
}

.float-button-img {
  vertical-align: middle;
  margin: 0 5px
}

.float-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 999;
}
</style>
