<template>
  <div class="exam-list">
    <div style="min-height: 700px">
      <el-row :gutter="20">
        <el-col :span="8" v-for="(exam, index) in examList" :key="exam.id">
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
                {{ exam.timeLimit === 0 ? '无限制' : `${exam.timeLimit} 分钟` }}
              </p>
              <p>随机排列选项: {{ exam.randomizeOptions ? '是' : '否' }}</p>
              <p>允许查看答案: {{ exam.allowViewAnswers ? '是' : '否' }}</p>
              <p>允许回退答题: {{ exam.allowBackward ? '是' : '否' }}</p>
            </div>

            <template #footer>
              <div style="display: flex; justify-content: center">
                <el-button
                  type="success"
                  @click="puslishExam(index)"
                  v-if="exam.type === 1"
                >
                  发布试题
                </el-button>
                <el-button
                  type="info"
                  @click="puslishExam(index)"
                  v-if="exam.type === 2"
                >
                  撤回发布
                </el-button>
                <el-button type="primary" @click="updateExam(exam.id)">
                  修改试题
                </el-button>
                <el-button type="warning" @click="finishDetail(exam.id)">
                  答题情况
                </el-button>
                <el-popconfirm
                  title="确认删除?"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  @confirm="deleteExam(exam.id)"
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
  </div>

  <el-dialog v-model="updateExamVis" title="新增试卷" width="800">
    <CreateExamination v-model="examForm" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="createExamVis = false">取消</el-button>
        <el-button type="primary" @click="submitExam">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '@/utils/http'
import { useRouter } from 'vue-router'
import CreateExamination from '@/views/examination/CreateExamination.vue'

const examList = ref([])
const router = useRouter()

const finishDetail = (id) => {
  router.push({ path: '/finishDetail', query: { id } })
}

const puslishExam = async (index) => {
  await http.post(`/examination/publish/${examList.value[index].id}`)
  await getExamList()
  if (examList.value[index].type === 2) ElMessage.success('发布成功')
  else ElMessage.success('撤回成功')
}

const getExamList = async () => {
  try {
    const result = await http.get('/examination/list/teacher')
    examList.value = result
  } catch (error) {
    console.error('Failed to fetch exam list:', error)
  }
}

const deleteExam = async (id) => {
  await http.delete(`/examination/${id}`)
  ElMessage.success('删除成功')
  await getExamList()
}
const updateExam = (id) => {
  router.push({
    path: '/updateExam',
    query: { exam: id, path: '/exam/teacher' },
  })
}

onMounted(() => {
  getExamList()
})
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
