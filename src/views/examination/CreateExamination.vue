<template>
  <div class="new-exam">
    <el-form :model="examForm" label-width="120px" label-position="left">
      <el-form-item
        label="试卷标题"
        prop="title"
        :rules="[
          { required: true, message: '请输入试卷标题', trigger: 'blur' },
        ]"
      >
        <el-input v-model="examForm.title"></el-input>
      </el-form-item>
      <el-form-item label="生成模式" prop="questions">
        <el-radio-group v-model="examForm.isRandom">
          <el-radio :label="false" border>选择题目生成</el-radio>
          <el-radio :label="true" border>随机生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="题目个数">
        <el-input-number
          v-model="examForm.numberOfQuestions"
          :disabled="!examForm.isRandom"
        />
      </el-form-item>
      <el-form-item label="是否限制时长">
        <el-switch v-model="examForm.isTime"></el-switch>
      </el-form-item>
      <el-form-item label="限制时长" v-show="examForm.isTime">
        <el-input-number v-model="examForm.timeLimit"></el-input-number>
        <span style="margin-left: 10px">分钟</span>
      </el-form-item>
      <el-form-item label="随机排列选项" prop="randomizeOptions">
        <el-switch v-model="examForm.randomizeOptions"></el-switch>
      </el-form-item>
      <el-form-item label="允许查看答案" prop="allow_view_answers">
        <el-switch v-model="examForm.allowViewAnswers"></el-switch>
      </el-form-item>
      <el-form-item label="允许回退答题" prop="allow_backward">
        <el-switch v-model="examForm.allowBackward"></el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue'

// eslint-disable-next-line no-undef
const examForm: Ref = defineModel()
</script>

<style scoped>
.new-exam {
  margin: 20px;
}
</style>
