<template>
  <div class="home">
    <!-- 搜索框区域 -->
    <div style="display: flex; align-items: center">
      <el-popover placement="right" :width="700" trigger="hover">
        <template #reference>
          <el-input v-model="searchText" placeholder="请输入搜索内容" class="search-input" clearable @clear="handleSearchClear"
            @input="handleSearch"></el-input>
        </template>
        <div class="hoverable-div" v-for="item in searchRes" key="item" style="width: 100%;height: 35px;border: 1px;border-radius: 5px;padding: 5px;" @click="handleClick(item)">
          <span style="font-weight: bold;font-size: large;">{{ item.menu }}</span>
          <span style="font-weight: bold;"> > {{ item.title }}</span>
          <span style="color: gray;"> > {{ item.content }}</span>
        </div>
      </el-popover>
    </div>

    <!-- 公告栏区 -->
    <div style="padding: 5px;font-weight: bold;font-size: 24px;color: #646cff">公告栏</div>
    <div id="announce-card" class="text-wrapper">
      <Editor
        v-model="valueHtml"
        :defaultConfig="textConfig"
        :mode="mode"
        @onCreated="handleCreated"
      />
    </div>

    <!-- 公告栏编辑区 -->
    <div id="editor" class="editor-wrapper">
    <div class="editor-container">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: calc(100% - 40px)"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
      />
    </div>
  </div>
  <div id = 'edit-button' class="button-container-edit">
      <button class="submit-button" @click="handleEdit">编辑</button>
    </div>
  <div id = 'button-container' class="button-container">
      <button class="submit-button" @click="handleSubmit">提交</button>
      <button class="cancel-button" @click="handleCancel">取消</button>
    </div>

    <!-- 最新发布实验列表 -->
    <div style="margin: 20px 10px;font-weight: bold;font-size: 24px;color: #646cff">最新发布实验</div>
    <div class="demo-collapse">
      <el-collapse accordion>
        <el-collapse-item :name="item" v-for="item in exercises" :key="item">
          <template #title>
            <div style="color: grey;margin-right: 30px;">{{ item.timestamp }}</div>
            {{ item.name }}
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
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { ref, onBeforeUnmount, onMounted, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import http from '@/utils/http'
const editorRef = shallowRef(null)
const mode = ref('default')
const currentTime = ref(new Date().toLocaleString());
const exercises = ref([]);
const router = useRouter();
const searchRes = ref([])
const searchText = ref('')
const announce = ref(localStorage.getItem('announce'))
const valueHtml = ref(localStorage.getItem('announce'))  //回答内容
const toolbarConfig = {}
const textConfig = {readOnly:true}
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

function formatMenu(menu: string): string {
  if (menu == 'exam') {
    return '自测题库';
  }
  if (menu == 'exercise') {
    return '实验提交';
  }
  return menu;
}

onMounted(() => {
  if(localStorage.getItem('announce')==null){
    localStorage.setItem('announce','<p style="text-align: left; line-height: 1;"><span style="background-color: rgb(217, 217, 217); font-family: 黑体;">实验检查项在实验提交中查看。校验次数达8次后展示具体错误，8次前仅展示错误类型。</span></p><p style="text-align: left; line-height: 1.15;"><span style="background-color: rgb(217, 217, 217); font-family: 黑体;">点击右上角姓名可修改密码，但不要忘记😤</span></p><p style="text-align: left; line-height: 1.15;"><span style="background-color: rgb(217, 217, 217); font-family: 黑体;">需要将img标签的引用地址从本地地址改为线上链接(仅校内网访问)</span></p>');
    
    announce.value = localStorage.getItem('announce')
    valueHtml.value = localStorage.getItem('announce')
  }

  timer = setInterval(() => {
    currentTime.value = new Date().toLocaleString();
  }, 1000);

  (async () => {
    const response = await http.get('/exercise/list_published')
    exercises.value = response.map((item: any) => ({
      ...item,
      timestamp: formatTimestamp(item.timestamp),
    }))
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

const handleSearch = async () => {
  if (searchText.value != '') {
    const response = await http.get('/exercise/search?searchStr=' + searchText.value);
    searchRes.value = response.map((item: any) => ({
      ...item,
      menu: formatMenu(item.menu),
    }))
  }
}

const handleClick = (item: any) => {
  if (item.menu == '实验提交') {
    router.push('/questionBank');
  }
  if (item.menu == '自测题库') {
    router.push('/submit');
  }
}
const handleSearchClear = () => {
  searchText.value = ''
}


const editorConfig = {
      MENU_CONF: {
        uploadImage: {
          server: 'http://localhost:8100/exercise/uploadImage',
          fieldName: 'file',
          customInsert(res, insertFn) {
            const url = res.data
            insertFn(url)
          },
        },
        uploadVideo: {
          server: 'http://localhost:8100/exercise/uploadVideo',
          fieldName: 'file',
          maxFileSize:1024 * 1024 * 1024,
          customInsert(res, insertFn) {
            const url = res.data
            insertFn(url)
          },
        },
      },
    }

    // 公告编辑按钮点击处理
    const handleEdit = async () => {
      document.getElementById('edit-button').style.display = 'none';
      document.getElementById('announce-card').style.display = 'none';
      document.getElementById('editor').style.display = 'block';
      document.getElementById('button-container').style.display = 'flex';
    }

    // 公告提交按钮点击处理
    const handleSubmit = async () => {
      localStorage.setItem('announce',valueHtml.value)
      announce.value = localStorage.getItem('announce')
      document.getElementById('edit-button').style.display = 'flex';
      document.getElementById('announce-card').style.display = 'block';
      document.getElementById('editor').style.display = 'none';
      document.getElementById('button-container').style.display = 'none';
    }

    // 公告取消按钮点击处理
    const handleCancel = () => {
      document.getElementById('edit-button').style.display = 'flex';
      document.getElementById('announce-card').style.display = 'block';
      document.getElementById('editor').style.display = 'none';
      document.getElementById('button-container').style.display = 'none';
    }
    
</script>

<style scoped>
.home {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
}

.demo-collapse {
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

.el-input {
  padding: 10px;
  width: 300px;
}
.hoverable-div:hover {
  background-color: #dddefb;
  cursor: pointer;
}
.editor-wrapper {
  display: none;
  height: 300px;
  width: 98%;
  margin: 0 auto;
  box-sizing: border-box;
}

.editor-container {
  border: 1px solid #ccc;
  height: 100%;
  overflow: scroll;
}
.button-container {
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  display: none;
}
.button-container-edit{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.submit-button,
.cancel-button {
  padding: 7px 22px;
  font-size: 12px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button {
  background-color: #409eff;
}

.cancel-button {
  background-color: #f56c6c;
}
.text-wrapper {
  border: 5px solid rgb(203, 203, 203);
  border-radius: 15px;
  width: 98%;
  box-sizing: border-box;
}
</style>
