//对外暴露配置路由(常量路由):全部用户都可以访问到的路由
import { RouteRecordRaw } from 'vue-router'

export const constantRoute: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/exercise',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          hidden: false,
          icon: 'homeIcon',
        },
      },
      {
        path: '/exercise',
        component: () => import('@/views/exercise/index.vue'),
        meta: {
          title: '实验发布',
          hidden: false,
          icon: 'exerciseIcon',
        },
      },
      {
        path: '/questionBank',
        component: () => import('@/views/questionBank/QuestionList.vue'),
        meta: {
          title: '自测题库',
          hidden: false,
          icon: 'questionIcon',
        },
      },
      {
        path: '/exam',
        component: () => import('@/views/examination/ExamList.vue'),
        meta: {
          title: '查看试卷',
          hidden: false,
          icon: 'examIcon',
        },
      },
      {
        path: '/doExam',
        component: () => import('@/views/examination/DoExam.vue'),
        meta: {
          title: '做题',
          hidden: true,
          icon: 'HomeFilled',
        },
      },
      {
        path: '/Editor',
        component: () => import('@/views/exercise/Editor.vue'),
        meta: {
          hidden: true,
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
