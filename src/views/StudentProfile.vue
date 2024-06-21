<template>
  <div class="user-center">
    <div class="content">
      <div class="sidebar">
        <ul>
          <li @click="showSection('info')">个人信息</li>
          <li @click="showSection('tasks')">待办事项</li>
        </ul>
      </div>
      <div class="main-content">
        <div v-if="currentSection === 'info'">
          <h2>个人信息</h2>
          <img :src="user.avatar" class="avatar" />
          <form>
            <div class="input-group">
              <label>学号</label>
              <div v-show="user.account">{{ user.account }}</div>
            </div>
            <div class="input-group">
              <label>姓名</label>
              <input type="text" v-model="user.name" required />
            </div>
            <div class="input-group">
              <label>签名档</label>
              <input type="text" v-model="user.signature" />
            </div>
            <button @click="updateProfile">更新信息</button>
            <button @click="resetPassword">重新设置密码</button>
            <button @click="logout">登出</button>
          </form>
        </div>
        <div v-if="currentSection === 'tasks'">
          <div class="addtodo">
            <input class="inputTask" type="text" v-model="newTask" />
            <button @click="addTask(newTask)">添加事项</button>
          </div>
          <ul class="task-list">
            <li v-for="task in tasks" :key="task.id" class="task-item">
              <span>{{ task.task }}</span>
              <button @click="deleteTask(task.id)" class="delete-button">
                删除
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentSection: 'info',
      user: {
        account: '',
        avatar: 'http://rongcloud-web.qiniudn.com/docs_demo_rongcloud_logo.png',
        name: '未设置名称',
        signature: '这是我的签名档',
      },
      tasks: [{ id: 0, text: '暂无代办事项' }],
      newTask: '', // 添加一个新任务输入框的绑定值
    }
  },
  methods: {
    goToPage(page) {
      this.$router.push({ name: page })
    },
    resetPassword() {
      this.$router.push('/forgetPassword')
    },
    logout() {
      // 执行登出逻辑
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      this.$router.push('/login')
    },
    showSection(section) {
      this.currentSection = section
    },
    async deleteTask(taskId) {
      await this.$axios.post('/user/deleteTask', {
        taskId: taskId,
      })
    },
    async addTask(text) {
      try {
        await this.$axios.post('/user/setTodoList', {
          task: text,
        })
        const todoList = await this.$axios.get('/user/getTodoList')
        console.log(todoList)
        let list = todoList.data.data
        if (list != []) this.tasks = list
        else this.tasks = [{ id: 0, text: '暂无代办事项' }]
      } catch (e) {
        console.log(e)
      }
    },
    updateProfile() {
      // 执行更新个人信息逻辑
      if (confirm('确定要更新信息吗？')) {
        this.$axios.post('/user/setUserMessage', {
          name: this.user.name,
          signature: this.user.signature,
        })
      }
    },
    async loadStudentMessage() {
      try {
        const response = await this.$axios.get('/user/getUserMessage')
        const todoList = await this.$axios.get('/user/getTodoList')
        let data = response.data.data
        let list = todoList.data.data
        if (data.name != null) this.user.name = data.name
        if (data.account != null) this.user.account = data.account
        if (data.avatar != null) this.user.avatar = data.avatar
        if (data.signature != null) this.user.signature = data.signature
        if (list != []) this.tasks = list
      } catch {
        alert('请重新登录')
        this.$router.push('/login')
      }
    },
  },
  mounted() {
    this.loadStudentMessage()
  },
}
</script>

<style scoped>
.delete-button {
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.task-list {
  list-style-type: none;
  padding: 0;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}

.addtodo {
  display: flex;
}

.user-center {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f6fa;
}

.header {
  background: #4a69bd;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.nav a {
  margin: 0 1rem;
  color: white;
  text-decoration: none;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 1rem;
}

.content {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 200px;
  background: #6a89cc;
  color: white;
  padding: 1rem;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 0.5rem 0;
  cursor: pointer;
  transition: background 0.3s;
}

.sidebar li:hover {
  background: #4a69bd;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background: white;
}

.input-group {
  margin-bottom: 1rem;
}

input[type='text'],
input[type='file'] {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.75rem 1.5rem;
  background: #4a69bd;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #3b5998;
}
</style>
