<template>
  <el-container class="common-layout">
    <el-main>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="title" style="color:red;">未提交实验列表</div>
          <el-input
            v-model="searchTextNoSubmitted"
            placeholder="请输入搜索内容"
            class="search-input"
            clearable
            @clear="handleSearchClearNoSubmitted"
            @keydown.enter="handleSearchNoSubmitted"
          ></el-input>
          <el-table :data="filteredDataNoSubmitted" max-height="500">
            <el-table-column fixed="left" prop="id" label="ID" width="50" />
            <el-table-column prop="name" label="实验名称" width="150" />
            <el-table-column prop="timestamp" label="发布时间"  />
          </el-table>
        </el-col>

        <el-col :span="12">
          <div class="title" style="color:green;">已提交实验列表</div>
          <el-input
            v-model="searchTextSubmitted"
            placeholder="请输入搜索内容"
            class="search-input"
            clearable
            @clear="handleSearchClearSubmitted"
            @keydown.enter="handleSearchSubmitted"
          ></el-input>
          <el-table :data="filteredDataSubmitted" max-height="500">
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
var stuid = 0;

const handleClick = async (action: string, row: any) => {
  if (action === 'check') {
    router.push({
      path: '/checkStudent',
      query: {
        id: row.id,
        name: row.name,
        content: row.content,
      }
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

const fetchData = async () => {
  try {
    const noSubmittedResponse = await http.get('/exercise/list_not_submitted_by_id?'+'stuId='+stuid)
    tableDataNoSubmitted.value = noSubmittedResponse.map((item: any) => ({
      ...item,
      timestamp: formatTimestamp(item.timestamp),
    }))
    
    const submittedResponse = await http.get('/exercise/list_submitted_by_id?'+'stuId='+stuid)
    tableDataSubmitted.value = submittedResponse.map((item: any) => ({
      ...item,
      timestamp: formatTimestamp(item.timestamp),
    }))
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

onMounted(() => {
  if(router.currentRoute.value.query.id){
    stuid = router.currentRoute.value.query.id
  }
  fetchData()
})
</script>

<style scoped>
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

.el-menu-item {
  font-size: 12px;
  border: 1px solid #ebebeb;
}

.el-aside {
  background-color: #d3dce6;
  width: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: black;
  padding: 20px;
  /* text-align: center; */
  min-height: 600px;
}

.control-row {
  margin-bottom: 15px;
}

.el-table,
.el-table th,
.el-table td {
  font-size: 11px;
}

.el-button {
  font-size: 10px;
}

.search-input {
  width: 100%;
  font-size: 10px;
}

.text-right {
  text-align: right;
}
.title{
  font-size: 20px;
  font-weight: 600;
  padding: 10px;
}
</style>