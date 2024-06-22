<template>
  <div class="exercise-title">{{ input }}</div>
  <hr />
  <div class="subtitle">实验内容</div>
  <!-- 问题内容区 -->
  <div class="text-wrapper">
    <Editor
      v-model="textHtml"
      :defaultConfig="textConfig"
      :mode="mode"
      @onCreated="handleCreated"
    />
  </div>
  <div class="subtitle">作答区域</div>
  <!-- 回答问题区 -->
  <div class="editor-wrapper">
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
    <div class="button-container">
      <button class="submit-button" @click="handleSubmit">提交</button>
      <button class="cancel-button" @click="handleCancel">取消</button>
    </div>
  </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { useRouter } from 'vue-router'
import http from '@/utils/http'
import { ElMessage } from 'element-plus'

export default {
  components: { Editor, Toolbar },
  setup() {
    const editorRef = shallowRef(null)
    const input = ref('')
    const exerciseId = ref(0) //题目id
    const textHtml = ref('') //题目内容
    const valueHtml = ref('') //回答内容
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
        }
      } catch (error) {
        console.error('处理路由参数时出错:', error.message)
      }
    })

    // Editor 相关配置
    const toolbarConfig = {}
    const textConfig = {}
    textConfig.readOnly = true

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
      },
    }

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

    // 处理提交逻辑
    const handleSubmit = async () => {
      try {
        // 校验输入是否为空
        if (valueHtml.value.trim() == '<p><br></p>') {
          ElMessage.warning('请输入实验内容')
          return
        }

        const requestBody = {
          exerciseId: exerciseId.value,
          content: valueHtml.value,
        }

        // 发送 POST 请求添加新实验
        await http.post('/exercise_finish/submit', requestBody)

        // 请求成功后，显示提交成功的提示消息
        ElMessage.success('提交成功')

        // 请求成功后，跳转到指定页面
        router.push({
          path: '/submit',
          query: {
            activeTab: 'submitted',
          },
        })
      } catch (error) {
        console.error('提交失败:', error.message)
        ElMessage.error('提交失败，请稍后重试')
      }
    }

    // 取消按钮点击处理
    const handleCancel = () => {
      router.push('/submit')
    }

    return {
      editorRef,
      textHtml,
      valueHtml,
      mode: 'default',
      toolbarConfig,
      textConfig,
      editorConfig,
      handleCreated,
      handleSubmit,
      handleCancel,
      input,
    }
  },
}
</script>

<style scoped>
.exercise-title {
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
  width: 80%;
  box-sizing: border-box;
}
.editor-wrapper {
  height: 500px;
  width: 90%;
  margin: 0 auto;
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
