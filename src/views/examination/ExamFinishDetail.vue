<template>
  <div>
    <el-button type="danger" @click="goBack" style="margin: 10px 0">
      返回
    </el-button>
  </div>
  <el-table
    :data="detail"
    style="width: 100%"
    class="table"
    stripe
    border
    max-height="400"
  >
    <el-table-column prop="title" label="试卷名称"></el-table-column>
    <el-table-column prop="account" label="学号"></el-table-column>
    <el-table-column prop="name" label="姓名"></el-table-column>
    <el-table-column prop="score" label="得分"></el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import http from '@/utils/http'
import router from '@/router'

const route = useRoute()
const id = route.query.id
const detail = ref([])
onMounted(async () => {
  detail.value = await http.get(`/exam_finish/studentDetail/${id}`)
})
const goBack = () => {
  router.push('/exam/teacher')
}
</script>

<style lang="scss" scoped>
.table {
  font-family: Consolas;
}
</style>
