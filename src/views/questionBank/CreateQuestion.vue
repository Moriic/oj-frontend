<template>
  <div class="form">
    <el-form :model="questionForm" label-width="80px" label-position="left">
      <el-form-item label="题目类型">
        <el-select v-model="questionForm.type" placeholder="Select">
          <el-option label="单选题" :value="0"></el-option>
          <el-option label="多选题" :value="1"></el-option>
          <el-option label="判断题" :value="2"></el-option>
          <el-option label="简答题" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="问题">
        <el-input v-model="questionForm.question"></el-input>
      </el-form-item>
      <template v-if="questionForm.type === 0 || questionForm.type === 1">
        <el-form-item label="选项">
          <div v-for="(option, index) in questionForm.options" :key="index">
            <div style="display: flex; align-items: center">
              <span style="margin-right: 10px">
                {{ String.fromCharCode(65 + index) }}
              </span>
              <el-input
                v-model="questionForm.options[index]"
                style="width: 500px; margin: 5px 0"
              ></el-input>
              <el-button
                type="danger"
                @click="removeOption(index)"
                class="margin10"
              >
                删除选项
              </el-button>
            </div>
          </div>
          <div>
            <el-button type="primary" @click="addOption" class="margin10">
              添加选项
            </el-button>
          </div>
        </el-form-item>
      </template>
      <el-form-item label="答案">
        <template v-if="questionForm.type === 0">
          <el-radio-group v-model="questionForm.answer[0]">
            <el-radio
              v-for="(option, index) in questionForm.options"
              :label="questionForm.options[index]"
              :key="index"
            >
              {{ String.fromCharCode(65 + index) }}
            </el-radio>
          </el-radio-group>
        </template>
        <template v-if="questionForm.type === 1">
          <el-checkbox-group v-model="questionForm.answer">
            <el-checkbox
              v-for="(option, index) in questionForm.options"
              :label="questionForm.options[index]"
              :key="index"
            >
              {{ String.fromCharCode(65 + index) }}
            </el-checkbox>
          </el-checkbox-group>
        </template>
        <template v-if="questionForm.type === 2">
          <el-radio-group v-model="questionForm.answer[0]">
            <el-radio label="True" key="True">True</el-radio>
            <el-radio label="False" key="False">False</el-radio>
          </el-radio-group>
        </template>
        <template v-if="questionForm.type === 3">
          <el-input v-model="questionForm.answer[0]"></el-input>
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line no-undef
import { Ref } from 'vue'

// eslint-disable-next-line no-undef
const questionForm: Ref = defineModel()
const addOption = () => {
  questionForm.value.options.push('')
}

const removeOption = (index: number) => {
  console.log(questionForm.value.options)
  questionForm.value.options.splice(index, 1)
}
</script>

<style scoped>
.form {
  max-width: 1000px;
  margin: 0 auto;
  font-family: Consolas;
}
.el-form-item {
  margin-bottom: 15px;
}
.margin10 {
  margin: 5px 10px;
}

:deep(.el-input__inner) {
  font-family: Consolas !important;
}
</style>
