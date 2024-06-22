<template>
  <div class="table">
    <el-button @click="goTo" type="danger" style="margin-bottom: 10px">
      返回
    </el-button>
    <el-table
      stripe
      border
      :data="questionBanks"
      max-height="720"
      style="width: 100%"
    >
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
      <el-table-column
        prop="answer"
        label="答案"
        v-if="showAnswer"
      ></el-table-column>
      <el-table-column prop="score" width="60" label="分值"></el-table-column>
      <el-table-column label="结果" width="100">
        <template #default="scope">
          <el-tag
            :type="resultTagType(scope.$index)"
            disable-transitions
            effect="dark"
          >
            {{ resultLabel(scope.$index) }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '@/utils/http'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const questionBanks = ref([])
const examId = route.query.examId
const questionTypes = ['单选题', '多选题', '判断题', '简答题']
const typeTag = ['primary', 'success', 'warning', 'danger']
const finishId = route.query.finishId
const result = ref([])
const showAnswer = ref(false)

const goTo = () => {
  router.push({ path: '/exam', query: { tab: 'second' } })
}

const typeFilters = questionTypes.map((type, index) => ({
  text: type,
  value: index,
}))

const formatType = (row, column, cellValue) => {
  return questionTypes[cellValue] || '未知类型'
}

const filterType = (value, row) => {
  return row.type === value
}

const resultLabel = (index) => {
  return result.value[index] ? '正确' : '错误'
}

const resultTagType = (index) => {
  return result.value[index] ? 'success' : 'danger'
}

onMounted(async () => {
  try {
    let response = await http.get(`/examination/${examId}`)
    questionBanks.value = response.questions
    showAnswer.value = response.allowViewAnswers
    response = await http.get(`/exam_finish/${finishId}`)
    result.value = response.result
    questionBanks.value.map((question, index) => {
      return {
        ...question,
        isCorrect: result.value[index],
      }
    })
  } catch (error) {
    console.error('获取试卷数据失败:', error)
  }
})
</script>

<style scoped>
.table {
  margin: 20px 30px 0 30px;
  font-family: Consolas;
}
</style>
