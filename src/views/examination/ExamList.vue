<template>
  <div class="exam-list">
    <el-tabs type="border-card" stretch v-model="activeName">
      <el-tab-pane label="待完成试卷" name="first" stretch>
        <div style="min-height: 68vh">
          <el-row :gutter="20">
            <el-col :span="8" v-for="exam in examList" :key="exam.id">
              <el-card shadow="hover">
                <template #header>
                  <div style="text-align: center; font-size: 18px">
                    {{ exam.title }}
                  </div>
                </template>
                <div>
                  <p>题数: {{ exam.questionNum }} 题</p>
                  <p>总分: {{ exam.examScore }} 分</p>
                  <p>
                    限制时长:
                    {{
                      exam.timeLimit === 0 ? '无限制' : `${exam.timeLimit} 分钟`
                    }}
                  </p>
                  <p>随机排列选项: {{ exam.randomizeOptions ? '是' : '否' }}</p>
                  <p>允许查看答案: {{ exam.allowViewAnswers ? '是' : '否' }}</p>
                  <p>允许回退答题: {{ exam.allowBackward ? '是' : '否' }}</p>
                </div>

                <template #footer>
                  <div style="display: flex; justify-content: center">
                    <el-button type="primary" @click="doExam(exam.id)">
                      开始答题
                    </el-button>
                    <el-button
                      type="success"
                      v-if="exam.type === 0"
                      @click="updateExam(exam.id)"
                    >
                      修改试题
                    </el-button>
                    <el-popconfirm
                      title="确认删除?"
                      confirm-button-text="确认"
                      cancel-button-text="取消"
                      @confirm="deleteExam(exam.id)"
                      v-if="exam.type === 0"
                    >
                      <template #reference>
                        <el-button type="danger">删除试题</el-button>
                      </template>
                    </el-popconfirm>
                  </div>
                </template>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已完成试卷" name="second">
        <div style="min-height: 68vh">
          <el-row :gutter="20">
            <el-col :span="8" v-for="exam in finishList" :key="exam.id">
              <el-card shadow="hover">
                <template #header>
                  <div style="text-align: center; font-size: 18px">
                    {{ exam.examinationVO.title + ' 答题结果' }}
                  </div>
                </template>
                <div>
                  <p>
                    得分：{{ exam.score }} 分 /
                    {{ exam.examinationVO.examScore }} 分
                  </p>
                  <p>
                    正确数：{{ exam.result.filter(Boolean).length }} 题 /
                    {{ exam.examinationVO.questionNum }} 题
                  </p>
                  <p>答题情况：</p>
                  <div class="flex gap-2">
                    <el-tag
                      v-for="(item, index) in exam.result"
                      :type="item ? 'success' : 'danger'"
                      effect="dark"
                      round
                      size="large"
                      :key="index"
                      style="margin: 10px 5px; font-size: 15px"
                    >
                      {{ (item, index) }}
                    </el-tag>
                  </div>
                </div>
                <template #footer>
                  <div style="display: flex; justify-content: center">
                    <el-button
                      type="primary"
                      @click="showDetail(exam.examinationId, exam.id)"
                    >
                      查看详情
                    </el-button>
                  </div>
                </template>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import http from '@/utils/http'
import { useRoute, useRouter } from 'vue-router'
const showDetail = (examId, finishId) => {
  router.push({ path: '/showQuestion', query: { examId, finishId } })
}
const examList = ref([])
const finishList = ref([])
const router = useRouter()
const activeName = ref('first')
const route = useRoute()

const doExam = (examId) => {
  router.push({ path: '/doExam', query: { exam: examId } })
}

const getExamList = async () => {
  try {
    const result = await http.get('/examination/list')
    examList.value = result
  } catch (error) {
    console.error('Failed to fetch exam list:', error)
  }
}

const getFinishList = async () => {
  try {
    const result = await http.get('/exam_finish/list')
    finishList.value = result
  } catch (error) {
    console.error('Failed to fetch exam list:', error)
  }
}

onMounted(() => {
  getExamList()
  getFinishList()
  const tabParam = route.query?.tab
  if (tabParam) {
    activeName.value = tabParam
  }
})

onActivated(() => {
  getExamList()
  getFinishList()
})

const updateExam = (id) => {
  router.push({ path: '/updateExam', query: { exam: id, path: '/exam' } })
}

const deleteExam = async (id) => {
  await http.delete(`/examination/${id}`)
  await getExamList()
  ElMessage.success('删除成功')
}
</script>

<style scoped>
.exam-list {
  padding: 10px 20px;
  font-family: Consolas;
}

.el-card {
  margin-bottom: 20px;
}

p {
  margin: 10px 0;
}

:deep(.el-tabs__item) {
  font-size: 17px !important;
}
</style>
