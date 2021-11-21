<template>
  <div class="options">
    <div class="title" title="ReTabs">
      <img :src="imgUrl" style="margin-right: 10px;">
      ReTabs
    </div>
    <div class="content-panel">
      <div class="setting-item">
        <el-switch v-model="disablePopup" @change="changeDisablePopup" active-text="Disable Popup" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    let disablePopup = ref(false)
    let imgUrl = ref(chrome.extension.getURL("images/icon-32x32@2x.png"))

    chrome.storage.local.get('disablePopup', result => {
      console.log('result.disablePopup', result['disablePopup'])
      disablePopup.value = !!result['disablePopup']
      console.log(disablePopup)
    });

    const changeDisablePopup = (disabled: boolean) => {
      chrome.storage.local.set({disablePopup: disabled}, () => {
        disablePopup.value = disabled
      });
    }

    return {
      disablePopup,
      imgUrl,
      changeDisablePopup,
    }
  }
})
</script>

<style scoped>
img {
  vertical-align: middle;
}

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
  font-size: 1.5em;
}

.title {
  font-size: 2em;
  font-weight: bold;
  color: darkgrey;
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

.setting-item {
  margin: 10px 0;
}
</style>
