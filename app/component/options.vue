<template>
  <el-menu
      :default-active="$route.path"
      mode="horizontal"
      @select="handleSelect"
      router>
    <el-menu-item index="/options">
      <router-link to="/options">{{ i18n('options') }}</router-link>
    </el-menu-item>
    <el-menu-item index="/history">
      <router-link to="/history">{{ i18n('history') }}</router-link>
    </el-menu-item>
    <el-menu-item index="/session">
      <router-link to="/session">{{ i18n('session') }}</router-link>
    </el-menu-item>
  </el-menu>

  <router-view></router-view>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import 'element-plus/theme-chalk/el-message.css';

export default defineComponent({
  setup() {
    const handleSelect = (key, keyPath) => {
      console.log(key, keyPath)
    }

    return {
      handleSelect
    }
  }
})
</script>

<style scoped>

</style>
