<template>
  <div class="exercise-title">{{ stuName }}的实验提交情况</div>
  <hr />
  <el-container class="common-layout">
    <el-main>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="title" style="color: red">未提交实验列表</div>
          <el-input
            v-model="searchTextNoSubmitted"
            placeholder="请输入搜索内容"
            class="search-input"
            clearable
            @clear="handleSearchClearNoSubmitted"
            @keydown.enter="handleSearchNoSubmitted"
          ></el-input>
          <el-table
            :data="filteredDataNoSubmitted"
            max-height="400"
            stripe
            border
            class="table"
          >
            <el-table-column fixed="left" prop="id" label="ID" width="50" />
            <el-table-column prop="name" label="实验名称" width="150" />
            <el-table-column prop="timestamp" label="发布时间" />
          </el-table>
        </el-col>

        <el-col :span="12">
          <div class="title" style="color: green">已提交实验列表</div>
          <el-input
            v-model="searchTextSubmitted"
            placeholder="请输入搜索内容"
            class="search-input"
            clearable
            @clear="handleSearchClearSubmitted"
            @keydown.enter="handleSearchSubmitted"
          ></el-input>
          <el-table
            :data="filteredDataSubmitted"
            max-height="500"
            stripe
            border
            class="table"
          >
            <el-table-column fixed prop="id" label="ID" width="50" />
            <el-table-column prop="name" label="实验名称" width="150" />
            <el-table-column prop="timestamp" label="发布时间" width="200" />
            <el-table-column fixed="right" label="操作">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  @click="handleClick('check', scope.row)"
                >
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  <div class="button-container">
    <button class="cancel-button" @click="handleCancel">返回</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/utils/http'

function formatTimestamp(timestamp: number[]): string {
  const [year, month, day, hour, minute, second] = timestamp
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
    2,
    '0',
  )} ${String(hour).padStart(2, '0')}:${String(minute).padStart(
    2,
    '0',
  )}:${String(second).padStart(2, '0')}`
}

const searchTextNoSubmitted = ref('')
const searchTextSubmitted = ref('')
const router = useRouter()
const tableDataNoSubmitted = ref([])
const tableDataSubmitted = ref([])
let stuid = 0
const stuName = ref('')

const handleClick = async (action: string, row: any) => {
  if (action === 'check') {
    router.push({
      path: '/checkStudent',
      query: {
        id: row.id,
        name: row.name,
        content: row.content,
      },
    })
  }
}

const handleSearchNoSubmitted = () => {}
const handleSearchSubmitted = () => {}

const handleSearchClearNoSubmitted = () => {
  searchTextNoSubmitted.value = ''
}
const handleSearchClearSubmitted = () => {
  searchTextSubmitted.value = ''
}

const filteredDataNoSubmitted = computed(() => {
  if (!searchTextNoSubmitted.value) {
    return tableDataNoSubmitted.value
  }
  return tableDataNoSubmitted.value.filter((item) =>
    item.name.toLowerCase().includes(searchTextNoSubmitted.value.toLowerCase()),
  )
})

const filteredDataSubmitted = computed(() => {
  if (!searchTextSubmitted.value) {
    return tableDataSubmitted.value
  }
  return tableDataSubmitted.value.filter((item) =>
    item.name.toLowerCase().includes(searchTextSubmitted.value.toLowerCase()),
  )
})

// 返回按钮点击处理
const handleCancel = () => {
  router.push({
    path: '/studentSubmit',
  })
}

const fetchData = async () => {
  try {
    const noSubmittedResponse = await http.get(
      '/exercise/list_not_submitted_by_id?' + 'stuId=' + stuid,
    )
    tableDataNoSubmitted.value = noSubmittedResponse.map((item: any) => ({
      ...item,
      timestamp: formatTimestamp(item.timestamp),
    }))

    const submittedResponse = await http.get(
      '/exercise/list_submitted_by_id?' + 'stuId=' + stuid,
    )
    tableDataSubmitted.value = submittedResponse.map((item: any) => ({
      ...item,
      timestamp: formatTimestamp(item.timestamp),
    }))
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

onMounted(() => {
  if (router.currentRoute.value.query.id) {
    ;(stuid = router.currentRoute.value.query.id),
      (stuName.value = router.currentRoute.value.query.name)
  }
  fetchData()
})
</script>

<style scoped>
.exercise-title {
  margin: 10px;
  font-size: x-large;
  font-weight: bold;
}
.el-header {
  background-color: #b3c0d1;
  color: white;
  line-height: 60px;
  text-align: center;
  font-size: 1.5rem;
}

.el-sub-menu span {
  font-size: 13px;
}

.control-row {
  margin-bottom: 15px;
}

.table {
  font-family: Consolas;
}
.search-input {
  width: 100%;
  margin: 10px 0;
}

.text-right {
  text-align: right;
}
.title {
  font-size: 20px;
  font-weight: 600;
  padding: 10px;
}
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}
.cancel-button {
  padding: 7px 22px;
  font-size: 12px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #f56c6c;
}
</style>
