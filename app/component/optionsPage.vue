<template>
  <el-container>
    <el-main>
      <el-row justify="center">
        <div class="title">
          <img :src="imgUrl" style="margin-right: 10px;">
          ReTabs
        </div>
      </el-row>

      <el-row justify="center">
        <el-card class="content-panel">
          <el-switch v-model="disablePopup" @change="changeDisablePopup" :active-text="i18n('disablePopup')"/>
        </el-card>
      </el-row>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";

export default defineComponent({
  setup() {
    let disablePopup = ref(false)
    let imgUrl = ref(chrome.extension.getURL("images/icon-32x32@2x.png"))

    chrome.storage.local.get('disablePopup', result => {
      console.log('result.disablePopup', result['disablePopup'])
      disablePopup.value = !!result['disablePopup']
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

.title {
  margin-top: 100px;
  font-size: 2em;
  font-weight: bold;
  color: darkgrey;
}

.content-panel {
  margin-top: 30px;
  height: 50%;
  width: 60%;
  min-height: 300px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
