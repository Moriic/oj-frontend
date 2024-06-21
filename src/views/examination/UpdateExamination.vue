<template>
  <div class="new-exam">
    <el-form :model="examForm" label-width="120px" label-position="left">
      <el-form-item label="试卷标题" prop="title">
        <el-input v-model="examForm.title"></el-input>
      </el-form-item>
      <el-form-item label="是否限制时长">
        <el-switch v-model="examForm.isTime"></el-switch>
      </el-form-item>
      <el-form-item label="限制时长" v-show="examForm.isTime">
        <el-input-number v-model="examForm.timeLimit"></el-input-number>
        <span style="margin-left: 10px">分钟</span>
      </el-form-item>
      <div class="options">
        <el-form-item label="随机排列选项" prop="randomizeOptions">
          <el-switch v-model="examForm.randomizeOptions"></el-switch>
        </el-form-item>
        <el-form-item label="允许查看答案" prop="allow_view_answers">
          <el-switch v-model="examForm.allowViewAnswers"></el-switch>
        </el-form-item>
        <el-form-item label="允许回退答题" prop="allow_backward">
          <el-switch v-model="examForm.allowBackward"></el-switch>
        </el-form-item>
        <el-button
          type="success"
          @click="submitExam"
          style="
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-70%);
          "
        >
          保存试题
        </el-button>
      </div>
    </el-form>
    <el-table
      :data="questionList"
      style="width: 100%"
      stripe
      border
      max-height="560"
      class="table"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="编号" width="80"></el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        :formatter="formatType"
        :filters="typeFilters"
        :filter-method="filterType"
        width="80"
      >
        <template #default="scope">
          <el-tag
            :type="typeTag[scope.row.type]"
            disable-transitions
            effect="dark"
          >
            {{ questionTypes[scope.row.type] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="question" label="问题"></el-table-column>
      <el-table-column prop="options" label="选项"></el-table-column>
      <el-table-column prop="answer" label="答案"></el-table-column>
      <el-table-column prop="score" width="60" label="分值"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-popconfirm
            title="确认移除?"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm="deleteQuestion(scope.row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small">移除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import http from '@/utils/http'

const route = useRoute()
const router = useRouter()
const examId = route.query.exam
const nextPath = route.query.path
const questionList = ref([])
const examForm = ref({
  id: 0,
  title: '',
  isRandom: false,
  numberOfQuestions: 0,
  isTime: false,
  timeLimit: 0,
  randomizeOptions: false,
  allowViewAnswers: false,
  allowBackward: false,
  questions: [],
})

const submitExam = async () => {
  if (!examForm.value.isTime) examForm.value.timeLimit = 0
  examForm.value.questions = questionList.value.map((question) => question.id)
  await http.put('/examination', examForm.value)
  ElMessage.success('试卷保存成功')
  await router.push(nextPath)
}

onMounted(async () => {
  try {
    const response = await http.get(`/examination/${examId}`)
    examForm.value = response
    questionList.value = response.questions
    if (examForm.value.timeLimit !== 0) {
      examForm.value.isTime = true
    }
  } catch (error) {
    console.error('获取试卷数据失败:', error)
  }
})
const questionTypes = ['单选题', '多选题', '判断题', '简答题']
const typeTag = ['primary', 'success', 'warning', 'danger']

const typeFilters = questionTypes.map((type, index) => ({
  text: type,
  value: index,
}))

const filterType = (value, row) => {
  return row.type === value
}
const formatType = (row, column, cellValue) => {
  return questionTypes[cellValue] || '未知类型'
}

const deleteQuestion = (id) => {
  questionList.value = questionList.value.filter(
    (question) => question.id !== id,
  )
}
</script>

<style scoped>
.new-exam {
  margin: 20px auto;
}
.options {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 60px;
  position: relative;
}
.table {
  font-family: Consolas;
}
</style>
