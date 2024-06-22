<template>
  <div class="home">
    <div style="padding: 10px;font-weight: bold;font-size: 24px;color: #646cff">公告栏</div>
    <el-card style="max-width: 98%;margin: 0 auto;padding: 10px">
      本周5.13实验校验时间较久，请不要短时间内多次重复提交。
实验检查项在实验提交中查看。
校验次数达8次后展示具体错误，8次前仅展示错误类型。
点击右上角姓名可修改密码，但不要忘记😤
需要将img标签的引用地址从本地地址改为线上链接(仅校内网访问)
style标签、title标签写在head标签内部，而不是body标签内部
  </el-card>
  <div style="margin: 20px 10px;font-weight: bold;font-size: 24px;color: #646cff">最新发布实验</div>
  <div class="demo-collapse">
    <el-collapse accordion>
      <el-collapse-item :name="item" v-for="item in exercises" :key="item">
        <template #title>
          <div style="color: grey;margin-right: 30px;">{{ item.timestamp }}</div>
          {{item.name}}
        </template>
        <div class="text-wrapper" v-html="item.content"></div>
      </el-collapse-item>
    </el-collapse>
  </div>
    <el-footer>&copy; 2024 Web课程教学辅助系统<br>{{ currentTime }}</el-footer>
  </div>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'
import { ref,onBeforeUnmount, onMounted,shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import http from '@/utils/http'
const editorRef = shallowRef(null)
const editorConfig = {readOnly:true}
const mode= ref('default')
const currentTime = ref(new Date().toLocaleString());
const exercises = ref([]);
const router = useRouter();
let timer;

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

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date().toLocaleString();
  }, 1000);

  (async()=>{
    const response = await http.get('/exercise/list_published')
    exercises.value = response.map((item: any) => ({
      ...item,
      timestamp: formatTimestamp(item.timestamp),
    }))
    console.log(response)
  })();
});
const handleCreated = (editor) => {
      editorRef.value = editor
    }
    // 编辑器销毁时执行
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor) {
        editor.destroy()
      }
    })
</script>

<style scoped>
.home {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
}
.demo-collapse{
  margin: 0 auto;
  width: 96%;
}
.text-wrapper {
  margin: 10px;
  width: 60%;
  box-sizing: border-box;
}
.el-footer {
  text-align: center;
  background-color: #646cff;
  color: #fff;
  height: 50px;
  margin-top: auto;
}
</style>
