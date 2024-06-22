<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <div class="logo" @click="goHome">
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
      <div class="layout_tabbar">
        <div
          style="display: flex; justify-content: end; margin: 20px 20px"
          v-if="role === 'none'"
        >
          <el-button type="primary" @click="goLogin">登录</el-button>
          <el-button type="success" @click="goRegister">注册</el-button>
        </div>
      </div>
      <div class="main">
        <RouterView />
      </div>
    </div>
    <div
      style="
        position: absolute;
        bottom: 0;
        left: 260px;
        right: 0;
        background: #ffffff;
        height: 50px;
      "
    >
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 50px;
          font-family: Consolas;
        "
      >
        <span style="margin-right: 10px">&copy; 2024 Web课程教学辅助系统</span>
        {{ currentTime }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { constantRoute } from '@/router/routes'
import { useRoute, useRouter } from 'vue-router'
import Menu from '@/layout/Menu.vue'
import { onMounted, ref } from 'vue'
const $route = useRoute()
const router = useRouter()
const goHome = () => {
  router.push('/')
}
const currentTime = ref()
const role = ref('none')
onMounted(() => {
  setInterval(() => {
    currentTime.value = new Date().toLocaleString()
  }, 1000)
  let r = localStorage.getItem('role')
  if (r != null) role.value = r as string
})
const goLogin = () => {
  router.push('/login')
}
const goRegister = () => {
  router.push('/register')
}
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
  }

  .layout_main {
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
  }
}
.main {
  margin: 0 20px;
  position: absolute;
  width: calc(100% - $base-menu-width - 40px);
  height: calc(100vh - $base-tabbar-height - 80px);
  left: $base-menu-width;
  top: $base-tabbar-height;
  overflow: auto;
  border-radius: 8px;
  background: white;
  padding: 20px;
  box-shadow:
    0 1px 2px -2px rgba(0, 0, 0, 0.08),
    0 3px 6px 0 rgba(0, 0, 0, 0.06),
    0 5px 12px 4px rgba(0, 0, 0, 0.04);
}
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #646cff;
  margin: 20px 0 20px 0;
  cursor: pointer;
}

.logoTitle {
  font-size: 18px;
  font-family: Consolas;
  margin-left: 10px;
  font-weight: bold;
}
</style>
