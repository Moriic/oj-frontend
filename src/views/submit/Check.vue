<template>
  <div class="exercise-title">{{ input }}</div>  
  <hr>
  <div class="subtitle">实验内容</div>
  <!-- 问题内容区 -->
  <div class="text-wrapper">
    <Editor
      v-model="textHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
    />
  </div>

  <!-- 回答问题区 -->
  <div class="subtitle">你的作答</div>
  <div class="editor-wrapper">
    <div class="editor-container">
      <Editor
        style="height: calc(100% - 40px)"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
      />
    </div>
    <div class="button-container">
      <button class="cancel-button" @click="handleCancel">返回</button>
    </div>
  </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { useRouter } from 'vue-router'
import http from '@/utils/http'

export default {
  components: { Editor, Toolbar },
  setup() {
    const editorRef = shallowRef(null)
    const input = ref('')
    const exerciseId = ref(0) //题目id
    const textHtml = ref('')  //题目内容
    const valueHtml = ref('')  //回答内容
    const router = useRouter()

    // 使用 onMounted 钩子确保在页面加载时处理路由参数
    onMounted(async () => {
      try {
        // 等待路由参数的异步处理
        await router.isReady()

        // 如果路由中存在 id、name 和 content 参数，初始化 input 和 valueHtml
        if (
          router.currentRoute.value.query.id &&
          router.currentRoute.value.query.name &&
          router.currentRoute.value.query.content
        ) {
          exerciseId.value = router.currentRoute.value.query.id
          input.value = router.currentRoute.value.query.name
          textHtml.value = router.currentRoute.value.query.content
          
          //获取提交的内容
          const response = await http.get('/exercise_finish/submit_content?exerciseId=' + exerciseId.value)
          valueHtml.value = response
        }
      } catch (error) {
        console.error('处理路由参数时出错:', error.message)
      }
    })

    // Editor 相关配置
    const editorConfig = {}
    editorConfig.readOnly = true


    // 编辑器销毁时执行
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor) {
        editor.destroy()
      }
    })

    // 编辑器创建时回调
    const handleCreated = (editor) => {
      editorRef.value = editor
    }

    // 返回按钮点击处理
    const handleCancel = () => {
      router.push({
          path: '/submit',
          query: {
            activeTab: 'submitted'
          },
        })
    }

    return {
      editorRef,
      textHtml,
      valueHtml,
      mode: 'default',
      editorConfig,
      handleCreated,
      handleCancel,
      input,
    }
  },
}
</script>

<style scoped>
.exercise-title{
  font-size: x-large;
  font-weight: bold;
  padding: 10px;
}
.subtitle {
  padding: 10px;
  font-size: larger;
  color: #999ded;
}
.text-wrapper {
  margin: 10px;
  width: 60%;
  box-sizing: border-box;
}
.editor-wrapper {
  margin: 10px;
  width: 90%;
  box-sizing: border-box;
}

.editor-container {
  border: 1px solid #ccc;
  height: 100%;
  overflow: hidden;
}

.editor-container .w-e-text-container {
  height: 100%;
  overflow-y: auto;
}

.button-container {
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
</style>
