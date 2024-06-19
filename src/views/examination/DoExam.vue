<template>
  <div class="exam">
    <div>
      <el-card style="width: 1300px">
        <template #header>
          <div style="position: relative">
            <div style="text-align: center; font-size: 20px">
              {{ exam.title }}
            </div>
            <div class="time" v-show="timeLimit !== 0">
              倒计时: {{ formatTime(timeLeft) }}
            </div>
            <div class="process">
              答题进度: {{ currentQuestionIndex + 1 }}/ {{ exam.questionNum }}
            </div>
          </div>
        </template>
        <div v-if="currentQuestionIndex !== null" style="min-height: 600px">
          <div
            style="
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            "
          >
            <span>
              {{ currentQuestionIndex + 1 }}. {{ currentQuestion.question }}
            </span>
            <el-tag
              effect="dark"
              :type="typeTag[currentQuestion.type]"
              size="large"
            >
              {{ questionTypes[currentQuestion.type] }}
            </el-tag>
          </div>

          <div v-if="currentQuestion.type === 0">
            <!-- 单选题 -->
            <el-radio-group
              v-model="userAnswers[currentQuestionIndex][0]"
              @change="saveAnswer(currentQuestionIndex, [$event])"
              style="display: flex; flex-direction: column; align-items: start"
            >
              <el-radio
                v-for="(option, index) in currentQuestion.options"
                :key="option"
                :label="option"
                size="large"
                border
                style="margin: 10px 0"
              >
                {{ String.fromCharCode(65 + index) + '. ' + option }}
              </el-radio>
            </el-radio-group>
          </div>
          <div v-else-if="currentQuestion.type === 1">
            <!-- 多选题 -->
            <el-checkbox-group
              v-model="userAnswers[currentQuestionIndex]"
              @change="saveAnswer(currentQuestionIndex, $event)"
              style="display: flex; flex-direction: column; align-items: start"
            >
              <el-checkbox
                v-for="(option, index) in currentQuestion.options"
                :key="option"
                :label="option"
                size="large"
                border
                style="margin: 10px 0; min-width: 100px"
              >
                {{ String.fromCharCode(65 + index) + '. ' + option }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-else-if="currentQuestion.type === 2">
            <!-- 判断题 -->
            <el-radio-group
              v-model="userAnswers[currentQuestionIndex][0]"
              @change="saveAnswer(currentQuestionIndex, [$event])"
              style="display: flex; flex-direction: column; align-items: start"
            >
              <el-radio
                v-for="(option, index) in currentQuestion.options"
                :key="option"
                :label="option"
                size="large"
                border
                style="margin: 10px 0"
              >
                {{ String.fromCharCode(65 + index) + '. ' + option }}
              </el-radio>
            </el-radio-group>
          </div>
          <div v-else-if="currentQuestion.type === 3">
            <!-- 简答题 -->
            <el-input
              type="textarea"
              :autosize="{ minRows: 10, maxRows: 4 }"
              v-model="userAnswers[currentQuestionIndex]"
              @blur="saveAnswer(currentQuestionIndex, [$event.target.value])"
            ></el-input>
          </div>
        </div>
        <template #footer>
          <div class="action-buttons">
            <el-button
              @click="previousQuestion"
              :disabled="currentQuestionIndex === 0 || !exam.allowBackward"
              type="success"
            >
              上一题
            </el-button>
            <el-button
              @click="nextQuestion"
              type="primary"
              :disabled="currentQuestionIndex === exam.questionNum - 1"
            >
              下一题
            </el-button>
            <el-button @click="submitExam" type="danger">提交试卷</el-button>
          </div>
        </template>
      </el-card>
    </div>
    <!--    {{ userAnswers }}-->
    <el-dialog
      v-model="isFinish"
      width="500"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      align-center
    >
      <template #header="{ titleId }">
        <h4 :id="titleId" class="titleClass">
          {{ exam.title + ' 答题结果' }}
        </h4>
      </template>
      <div>
        <p>得分：{{ result.score }} 分 / {{ exam.examScore }} 分</p>
        <p>正确数：{{ trueCount }} 题 / {{ exam.questionNum }} 题</p>
        <p>答题情况：</p>
        <div class="flex gap-2">
          <el-tag
            v-for="(item, index) in result.result"
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
        <div class="dialog-footer">
          <el-button type="primary" @click="goToExam">返回试题页</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import http from '@/utils/http'
const questionTypes = ['单选题', '多选题', '判断题', '简答题']
const typeTag = ['primary', 'success', 'warning', 'danger']

const route = useRoute()
const examId = route.query.exam
const exam = ref({})
const userAnswers = ref([[], [], [], []])
const currentQuestionIndex = ref(0)
const timeLimit = ref(0)
const timeLeft = ref(0)
let timer = null
const isFinish = ref(false)
const result = ref({
  score: 0,
  result: [],
})
const trueCount = ref()
const router = useRouter()

const goToExam = () => {
  router.push('/exam')
}
const currentQuestion = computed(() => {
  return exam.value.questions
    ? exam.value.questions[currentQuestionIndex.value]
    : {}
})

const saveAnswer = (index, answer) => {
  userAnswers.value[index] = answer
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const nextQuestion = () => {
  if (userAnswers.value[currentQuestionIndex.value].length == 0) {
    ElMessage.error('请先回答问题')
    return
  }

  if (currentQuestionIndex.value < exam.value.questions.length - 1) {
    currentQuestionIndex.value++
  }
}

const submitExam = async () => {
  clearInterval(timer)
  for (let answer of userAnswers.value) {
    if (answer.length == 0) {
      ElMessage.error('请先回答全部题目')
      return
    }
  }

  try {
    let finishId = await http.post('/exam_finish', {
      examinationId: examId,
      answer: userAnswers.value,
    })
    result.value = await http.get(`/exam_finish/${finishId}`)
    isFinish.value = true
    trueCount.value = result.value.result.filter(Boolean).length
  } catch (error) {
    console.error('提交试卷失败:', error)
  }
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const startTimer = () => {
  timeLeft.value = timeLimit.value * 60
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timer)
      ElMessage.info('时间到，试卷将自动提交')
      submitExam()
    }
  }, 1000)
}

onBeforeMount(async () => {
  try {
    const response = await http.get(`/examination/${examId}`)
    exam.value = response
    timeLimit.value = exam.value.timeLimit
  } catch (error) {
    console.error('获取试卷数据失败:', error)
  }
  if (exam.value.randomizeOptions) {
    exam.value.questions.forEach((question) => {
      if (question.type === 0 || question.type === 1) {
        question.options.sort(() => Math.random() - 0.5)
      }
    })
  }
  if (timeLimit.value !== 0) startTimer()
  userAnswers.value = Array.from(
    { length: exam.value.questions.length },
    () => [],
  )
})
onBeforeUnmount(async () => {
  clearInterval(timer)
  await http.post('/exam_finish', {
    examinationId: examId,
    answer: userAnswers.value,
  })
})
</script>

<style scoped>
.action-buttons {
  display: flex;
  justify-content: space-between;
}
.exam {
  font-family: Consolas;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.time {
  position: absolute;
  right: 0;
  bottom: 50%;
  transform: translateY(50%);
  font-size: 18px;
  color: red;
}
.process {
  position: absolute;
  left: 0;
  bottom: 50%;
  transform: translateY(50%);
  font-size: 18px;
  color: red;
}
p {
  margin: 20px 0;
  font-size: 18px;
}
.titleClass {
  font-size: 20px;
  color: firebrick;
}
</style>
