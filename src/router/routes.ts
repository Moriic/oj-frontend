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
        path: '/submit',
        component: () => import('@/views/submit/index.vue'),
        meta: {
          title: '实验提交',
          hidden: false,
          icon: 'exerciseSubIcon',
        },
      },
      {
        path: '/submitting',
        component: () => import('@/views/submit/Submitting.vue'),
        meta: {
          title: '提交实验',
          hidden: true,
        },
      },
      {
        path: '/check',
        component: () => import('@/views/submit/Check.vue'),
        meta: {
          title: '查看已提交实验',
          hidden: true,
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
          title: '查看试卷,学生',
          hidden: false,
          icon: 'examIcon',
        },
      },
      {
        path: '/exam/teacher',
        component: () => import('@/views/examination/ExamListTeacher.vue'),
        meta: {
          title: '查看试卷,老师',
          hidden: false,
          icon: 'examIcon',
        },
      },
      {
        path: '/updateExam',
        component: () => import('@/views/examination/UpdateExamination.vue'),
        meta: {
          title: '修改试题',
          hidden: true,
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
        path: '/showQuestion',
        component: () => import('@/views/examination/ShowQuestion.vue'),
        meta: {
          title: '修改试题',
          hidden: true,
          icon: 'examIcon',
        },
      },
      {
        path: '/studentSubmit',
        component: () => import('@/views/studentSubmit/index.vue'),
        meta: {
          title: '学生提交',
          hidden: false,
          icon: 'submitIcon',
        },
      },
      {
        path: '/studentExercise',
        component: () => import('@/views/studentSubmit/exercise.vue'),
        meta: {
          title: '学生提交情况',
          hidden: true,
          icon: 'HomeFilled',
        },
      },
      {
        path: '/checkStudent',
        component: () => import('@/views/studentSubmit/Check.vue'),
        meta: {
          title: '查看学生提交记录',
          hidden: true,
        },
      },
      {
        path: '/Editor',
        component: () => import('@/views/exercise/Editor.vue'),
        meta: {
          title: '查看学生提交记录',
          hidden: true,
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
