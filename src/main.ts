import { createApp } from 'vue'
import App from './App.vue'
import '@/styles/index.scss'
import 'virtual:svg-icons-register'
import registerGlobComp from '@/components'
import pinia from '@/store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import axios from 'axios'

// 全局设置基础URL
axios.defaults.baseURL = 'http://localhost:8100'

const app = createApp(App)

axios.interceptors.request.use(
  (config) => {
    // 1.从缓存中获取到token,这里的Authorization时登录时你给用户设置token的键值
    const token = localStorage.getItem('token')
    //console.log(token)
    // 2.如果token不为null，那么设置到请求头中，此处哪怕为null，我们也不进行处理，因为后台会进行拦截
    if (token) {
      config.headers['authentication'] = token
    }
    // 3.放行
    return config
  },
  (error) => {
    //失败后抛出错误
    Promise.reject(error)
  },
)

// 将 axios 挂载到 Vue 原型上
app.config.globalProperties.$axios = axios

app.use(registerGlobComp)
app.use(ElementPlus)
app.use(pinia)
app.use(router)

app.mount('#app')
