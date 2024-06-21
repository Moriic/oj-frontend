<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <div class="logo">
          <svg-icon name="logo" size="38px" color="#eff0ff" class="logoIcon" />
          <h1 class="logoTitle">Web课程教学辅助系统</h1>
        </div>
        <!-- 菜单组件-->
        <el-menu
          :collapse="false"
          :default-active="$route.path"
          active-text-color="#646CFF"
        >
          <!--根据路由动态生成菜单-->
          <Menu :menuList="constantRoute[0].children"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 内容展示区域 -->
    <div class="layout_main">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { constantRoute } from '@/router/routes'
import { useRoute } from 'vue-router'
import Menu from '@/layout/Menu.vue'
const $route = useRoute()
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    transition: all 0.3s;
    box-shadow:
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(29, 35, 41, 0.05) 2px 0px 8px 0px;
    padding: 0 10px;
    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);

      .el-menu {
        border-right: none;
      }
    }
  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    top: 0;
    left: $base-menu-width;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width - 40px);
    height: calc(100vh - $base-tabbar-height - 20px);
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;
    border-radius: 8px;
    background: white;

    box-shadow:
      0 1px 2px -2px rgba(0, 0, 0, 0.08),
      0 3px 6px 0 rgba(0, 0, 0, 0.06),
      0 5px 12px 4px rgba(0, 0, 0, 0.04);
    margin: 0 20px;
    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #646cff;
  margin: 20px 0 20px 0;
}

.logoTitle {
  font-size: 18px;
  font-family: Consolas;
  margin-left: 10px;
}
</style>
