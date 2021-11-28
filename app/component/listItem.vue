<template>
  <el-row class="item-info">
    <el-col :span="actionPanel ? 22 : 24" class="item-info-click">
      <div @click="$emit('itemClick')">
        <img :src="getFavicon(item.url)" class="favicon-img"/>
        <div class="item-detail">
          <div :title="item.title">
            {{ item.title ? item.title : '-' }}
          </div>
          <div :title="item.url" class="item-detail-url">
            {{ item.url }}
          </div>
          <div>
          <span>
            {{ epochFormat(item.time) }}
          </span>
            <span v-if="item.visitCount" style="margin-left: 20px;">
            {{ i18n('visitCount') }}: {{ item.visitCount }}
          </span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col v-if="actionPanel" :span="2" class="action-panel">
      <el-tooltip v-if="$attrs.onDeleteItem" :content="i18n('delete')" placement="bottom" effect="light"
                  :enterable="false">
        <icon-bi-x-circle class="action-icon" @click="$emit('deleteItem')"></icon-bi-x-circle>
      </el-tooltip>

      <el-tooltip v-if="$attrs.onCopyLink" :content="i18n('copyLink')" placement="bottom" effect="light"
                  :enterable="false">
        <icon-bi-link class="action-icon" @click="$emit('copyLink')"></icon-bi-link>
      </el-tooltip>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue"
import {epochFormat, getFavicon,} from "./helper";

interface Item {
  url: string,
  title: string,
  time: number,
  visitCount: number
}

export default defineComponent({
  props: {
    item: Object as PropType<Item>,
    actionPanel: Boolean
  },
  setup() {
    return {
      getFavicon,
      epochFormat
    }
  }
})
</script>

<style scoped>
.item-info {
  margin: 5px;
  padding: 2px 5px;
  border: 1px solid lightgray;
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 0.8em;
}

.item-info-click {
  cursor: pointer;
  overflow: hidden;
}

.item-info-click:hover {
  background-color: lightgray;
  box-shadow: 1px 1px 1px lightgray;
}

.favicon-img {
  display: inline-block;
  vertical-align: middle;
  width: 32px;
  height: 32px;
}

.item-detail {
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
}

.item-detail-url {
  color: var(--el-color-primary);
}

.action-icon {
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin-right: 5px;
}

.action-panel {
  text-align: right;
}
</style>
