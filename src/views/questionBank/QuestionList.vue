<template>
  <div class="table">
    <div style="display: flex; justify-content: end; margin-bottom: 20px">
      <!-- 搜索框 -->
      <el-input
        v-model="searchText"
        placeholder="输入关键词搜索题目"
        @input="searchQuestions"
        style="width: 200px; margin-right: 20px"
      ></el-input>

      <el-button type="primary" @click="createQuestion">新增题目</el-button>
      <el-button
        type="success"
        @click="createTestPaper"
        style="margin-left: 10px"
      >
        生成试卷
      </el-button>
    </div>
    <el-table
      stripe
      border
      :data="filteredQuestionBanks"
      max-height="720"
      style="width: 100%"
      @selection-change="handleSelectionChange"
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
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="editQuestion(scope.row)"
          >
            修改
          </el-button>
          <el-popconfirm
            title="确认删除?"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm="deleteQuestion(scope.row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="createDialogVis" title="新增题目" width="800">
    <CreateQuestion v-model="questionForm" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="createDialogVis = false">取消</el-button>
        <el-button type="primary" @click="submitQuestion">提交</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="updateDialogVis" title="修改题目" width="800">
    <CreateQuestion v-model="questionForm" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelUpdate">取消</el-button>
        <el-button type="primary" @click="updataQuestion">提交</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="createExamVis" title="新增试卷" width="800">
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
import { ref, onMounted, reactive, watch } from 'vue'
import http from '@/utils/http'
import CreateQuestion from '@/views/questionBank/CreateQuestion.vue'
import CreateExamination from '@/views/examination/CreateExamination.vue'

const createDialogVis = ref(false)
const updateDialogVis = ref(false)
const createExamVis = ref(false)

const questionBanks = ref([])

const questionTypes = ['单选题', '多选题', '判断题', '简答题']
const typeTag = ['primary', 'success', 'warning', 'danger']

const typeFilters = questionTypes.map((type, index) => ({
  text: type,
  value: index,
}))

let questionForm = reactive({
  id: 0,
  type: 0,
  question: '',
  options: [''],
  answer: [''],
  score: 5,
})

const examForm = reactive({
  title: '',
  questions: null,
  randomizeOptions: false,
  allowViewAnswers: false,
  allowBackward: false,
  isRandom: false,
  numberOfQuestions: 0,
  isTime: false,
  timeLimit: 120,
})

const submitExam = async () => {
  if (!examForm.isTime) examForm.timeLimit = 0
  try {
    if (examForm.isRandom) {
      const shuffledQuestions = questionBanks.value.sort(
        () => 0.5 - Math.random(),
      ) // 打乱题目列表
      const selectedQuestions = shuffledQuestions.slice(
        0,
        examForm.numberOfQuestions,
      ) // 选择前numberOfQuestions个题目
      examForm.questions = selectedQuestions.map((q) => q.id) // 将题目ID转换为JSON字符串
    } else {
      if (selectedQuestionIds.value.length === 0) {
        ElMessage.error('请先选择题目')
        return
      }
      examForm.questions = selectedQuestionIds.value
    }

    await http.post('/examination/add', examForm)
    ElMessage.success('试卷创建成功')
  } catch (error) {
    ElMessage.error('试卷创建失败')
  }
  createExamVis.value = false
  resetExamForm()
}
const resetExamForm = () => {
  examForm.title = ''
  examForm.questions = null
  examForm.randomizeOptions = false
  examForm.allowViewAnswers = false
  examForm.allowBackward = false
  examForm.isRandom = false
  examForm.numberOfQuestions = 0
  examForm.isTime = false
  examForm.timeLimit = 120
}
const cancelUpdate = () => {
  updateDialogVis.value = false
}
const createQuestion = () => {
  createDialogVis.value = true
  resetForm()
}

const submitQuestion = async () => {
  await http.post('/question/add', questionForm)
  createDialogVis.value = false
  resetForm()
  getQuestionList()
}

const resetForm = () => {
  questionForm.type = 0
  questionForm.question = ''
  questionForm.options = ['']
  questionForm.answer = ['']
}

const getQuestionList = async () => {
  const result = await http.get(`/question/list`)
  questionBanks.value = result
  filteredQuestionBanks.value = result
}

const deleteQuestion = async (id) => {
  await http.delete(`/question/${id}`)
  ElMessage.success('删除成功')
  await getQuestionList()
}

const formatType = (row, column, cellValue) => {
  return questionTypes[cellValue] || '未知类型'
}

const selectedQuestionIds = ref([])

const handleSelectionChange = (selectedRows) => {
  selectedQuestionIds.value = selectedRows.map((row) => row.id)
  examForm.questions = selectedQuestionIds.value
  examForm.numberOfQuestions = selectedQuestionIds.value.length
}

const createTestPaper = () => {
  createExamVis.value = true
}

const editQuestion = async (data) => {
  let result = await http.get(`/question/${data.id}`)
  questionForm.id = result.id
  questionForm.type = result.type
  questionForm.question = result.question
  questionForm.options = result.options
  questionForm.answer = result.answer
  // questionForm = result
  updateDialogVis.value = true
}

const updataQuestion = async () => {
  await http.put('/question', questionForm)
  ElMessage.success('修改成功')
  updateDialogVis.value = false
  await getQuestionList()
}

const filterType = (value, row) => {
  return row.type === value
}

onMounted(() => {
  getQuestionList()
})

// 搜索关键词
const searchText = ref('')

// 过滤后的题目列表
const filteredQuestionBanks = ref([])

// 搜索题目函数
const searchQuestions = () => {
  if (!searchText.value.trim()) {
    // 如果搜索关键词为空，显示所有题目
    filteredQuestionBanks.value = [...questionBanks.value]
  } else {
    // 否则根据搜索关键词过滤题目
    filteredQuestionBanks.value = questionBanks.value.filter((question) => {
      // 搜索题目内容
      const isQuestionMatched = question.question
        .toLowerCase()
        .includes(searchText.value.trim().toLowerCase())

      // 搜索选项内容
      const isOptionMatched = question.options.some((option) =>
        option.toLowerCase().includes(searchText.value.trim().toLowerCase()),
      )

      // // 搜索答案内容
      // const isAnswerMatched = question.answer
      //   .toLowerCase()
      //   .includes(searchText.value.trim().toLowerCase())

      // 如果题目、选项或答案中包含搜索关键词，则返回 true，否则返回 false
      return isQuestionMatched || isOptionMatched
    })
  }
}

// 监听题目列表的变化，触发搜索
watch(questionBanks, () => {
  searchQuestions()
})
</script>

<style scoped>
.table {
  margin: 20px 30px 0 30px;
  font-family: Consolas;
}

.pagination {
  display: flex;
  justify-content: center;
  margin: 20px auto;
}
</style>
