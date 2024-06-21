//对外暴露配置路由(常量路由):全部用户都可以访问到的路由
import { RouteRecordRaw } from 'vue-router'

export const constantRoute: Array<RouteRecordRaw> = [
  {
    //登录
    path: '/login',
    component: () => import('@/views/Login.vue'),
    name: 'login',
    meta: {
      title: '登录', //菜单标题
      hidden: true, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
    },
  },
  {
    //忘记密码
    path: '/forgetPassword',
    component: () => import('@/views/ForgetPassword.vue'),
    name: 'forgetPassword',
    meta: {
      title: '重设密码', //菜单标题
      hidden: true, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
    },
  },
  {
    //注册账号
    path: '/register',
    component: () => import('@/views/Register.vue'),
    name: 'register',
    meta: {
      title: '注册账号', //菜单标题
      hidden: true, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
    },
  },
  {
    //学生个人信息
    path: '/studentProfile',
    component: () => import('@/views/StudentProfile.vue'),
    name: 'studentProfile',
    meta: {
      title: '学生信息', //菜单标题
      hidden: true, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
    },
  },
  {
    //老师个人信息+学生管理T
    path: '/teacherDashboard',
    component: () => import('@/views/TeacherDashboard.vue'),
    name: 'teacherDashboard',
    meta: {
      title: '教师管理页面', //菜单标题
      hidden: true, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
    },
  },
  {
    //登录成功以后展示数据的路由
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    meta: {
      title: '',
      hidden: false,
      icon: '',
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          hidden: false,
          icon: 'HomeFilled',
        },
      },
    ],
  },
]

//异步路由
export const asnycRoute = []

//任意路由
export const anyRoute = {
  //任意路由
  path: '/:pathMatch(.*)*',
  redirect: '/404',
  name: 'Any',
  meta: {
    title: '任意路由',
    hidden: true,
    icon: 'DataLine',
  },
}
