<template>
  <el-container class="common-layout">
    <el-main>
      <el-col :span="6">
        <el-input
          v-model="searchText"
          placeholder="请输入搜索内容"
          class="search-input"
          clearable
          @clear="handleSearchClear"
          @keydown.enter="handleSearch"
        ></el-input>
      </el-col>

      <el-tabs v-model="activeTab" @tab-change="fetchData">
        <el-tab-pane label="待提交实验列表" name="noSubmitted">
          <el-table :data="filteredDataNoSubmitted" max-height="500">
            <el-table-column fixed prop="id" label="ID" width="150" />
            <el-table-column prop="name" label="实验名称" width="280" />
            <el-table-column prop="timestamp" label="发布时间" width="370" />
            <el-table-column fixed="right" label="操作">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  @click="handleClick('submit', scope.row)"
                >
                  答题
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="已提交实验列表" name="submitted">
          <el-table :data="filteredDataSubmitted" max-height="500">
            <el-table-column fixed prop="id" label="ID" width="150" />
            <el-table-column prop="name" label="实验名称" width="280" />
            <el-table-column prop="timestamp" label="发布时间" width="370" />
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
        </el-tab-pane>
      </el-tabs>
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

const searchText = ref('')
const router = useRouter()
const tableDataNoSubmitted = ref([]) 
const tableDataSubmitted = ref([]) 
const activeTab = ref('noSubmitted')

const handleClick = async (action: string, row: any) => {
  if (action === 'check') {
    router.push({
      path: '/check',
      query: {
        id: row.id,
        name: row.name,
        content: row.content,
      }
    })
  }
  if (action === 'submit') {
    router.push({
      path: '/submitting',
      query: {
        id: row.id,
        name: row.name,
        content: row.content,
      },
    })
  }
}

const handleSearch = () => {}

const handleSearchClear = () => {
  searchText.value = ''
}

const filteredDataNoSubmitted = computed(() => {
  if (!searchText.value) {
    return tableDataNoSubmitted.value
  }
  return tableDataNoSubmitted.value.filter((item) =>
    item.name.toLowerCase().includes(searchText.value.toLowerCase()),
  )
})

const filteredDataSubmitted = computed(() => {
  if (!searchText.value) {
    return tableDataSubmitted.value
  }
  return tableDataSubmitted.value.filter((item) =>
    item.name.toLowerCase().includes(searchText.value.toLowerCase()),
  )
})

const fetchData = async () => {
  try {
    if (activeTab.value === 'noSubmitted') {      
      const response = await http.get('/exercise/list_no_submitted')
      tableDataNoSubmitted.value = response.map((item: any) => ({
        ...item,
        timestamp: formatTimestamp(item.timestamp),
      }))
    } else if (activeTab.value === 'submitted') {
      const response = await http.get('/exercise/list_submitted')
      tableDataSubmitted.value = response.map((item: any) => ({
        ...item,
        timestamp: formatTimestamp(item.timestamp),
      }))
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

onMounted(() => {
  if(router.currentRoute.value.query.activeTab){
    activeTab.value = router.currentRoute.value.query.activeTab
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
  text-align: center;
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
</style>
