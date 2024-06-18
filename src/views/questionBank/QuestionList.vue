<template>
  <div class="table">
    <div style="display: flex; justify-content: end; margin-bottom: 20px">
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
      :data="questionBanks"
      max-height="700"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="编号" width="80"></el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        :formatter="formatType"
        width="80"
      ></el-table-column>
      <el-table-column prop="question" label="问题"></el-table-column>
      <el-table-column prop="options" label="选项"></el-table-column>
      <el-table-column prop="answer" label="答案"></el-table-column>
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
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import http from '@/utils/http'
import { useRouter } from 'vue-router'
import CreateQuestion from '@/views/questionBank/CreateQuestion.vue'

const createDialogVis = ref(false)
const updateDialogVis = ref(false)

const router = useRouter()

const questionBanks = ref([])
const selectedQuestions = ref([])

const questionTypes = ['单选题', '多选题', '判断题', '填空题', '简答题']

let questionForm = reactive({
  type: 0,
  question: '',
  options: [''],
  answer: [''],
})

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
}

const deleteQuestion = async (id: number) => {
  await http.delete(`/question/${id}`)
  // eslint-disable-next-line no-undef
  ElMessage.success('删除成功')
  await getQuestionList()
}

const formatType = (row: any, column: any, cellValue: number) => {
  return questionTypes[cellValue] || '未知类型'
}

const handleSelectionChange = (selectedRows: any) => {
  selectedQuestions.value = selectedRows
}

const createTestPaper = () => {
  if (selectedQuestions.value.length === 0) {
    alert('请先选择题目')
    return
  }
  console.log('Selected questions:', selectedQuestions.value)
  // 在此处处理创建试卷的逻辑，比如将选中的题目发送到服务器或存储在状态管理器中
  // ...
  router.push('/createTestPaper')
}

const editQuestion = async (data: any) => {
  let result = await http.get(`/question/${data.id}`)
  questionForm.type = result.type
  questionForm.question = result.question
  questionForm.options = result.options
  questionForm.answer = result.answer
  // questionForm = result
  updateDialogVis.value = true
}

const updataQuestion = async () => {
  await http.put('/question', questionForm)
  // eslint-disable-next-line no-undef
  ElMessage.success('修改成功')
  updateDialogVis.value = false
}
onMounted(() => {
  getQuestionList()
})
</script>

<style scoped>
.table {
  max-width: 1100px;
  margin: 50px auto;
  font-family: Consolas;
}
.pagination {
  display: flex;
  justify-content: center;
  margin: 20px auto;
}
</style>
