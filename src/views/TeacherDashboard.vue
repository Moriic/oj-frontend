<template>
  <div class="user-center">
    <div class="content">
      <div class="sidebar">
        <ul>
          <li @click="showSection('info')">个人信息</li>
          <li @click="showSection('studentManagement')">学生管理</li>
        </ul>
      </div>
      <div class="main-content">
        <div v-if="currentSection === 'info'">
          <h2>个人信息</h2>
          <img :src="user.avatar" class="avatar" />
          <form>
            <div class="input-group">
              <label>教师号：</label>
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
        <div v-if="currentSection === 'studentManagement'">
          <h2>学生管理</h2>
          <table>
            <thead>
              <tr>
                <th>序号</th>
                <th>账号</th>
                <th>名称</th>
                <th>被禁用状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in students" :key="student.id">
                <td>{{ student.id }}</td>
                <td>{{ student.account }}</td>
                <td>{{ student.name }}</td>
                <td>{{ student.blocked }}</td>
                <td class="actions">
                  <button @click="resetStudentPassword(student.account)">
                    重置密码
                  </button>
                  <button @click="toggleDisable(student.id)">禁用/启用</button>
                  <button @click="confirmDelete(student.id)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
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
        name: '请设置名称',
        account: '',
        avatar: 'http://rongcloud-web.qiniudn.com/docs_demo_rongcloud_logo.png',
        nickname: '未设置用户名',
        signature: '这是我的签名档',
        tasks: [],
      },
      students: [],
    }
  },
  methods: {
    goToPage(page) {
      this.$router.push({ name: page })
    },
    resetPassword() {
      this.$router.push('/forgetPassword')
    },
    async resetStudentPassword(account) {
      if (confirm('是否要重置密码')) {
        try {
          await this.$axios.post('/user/resetPassword', {
            account: account,
            password: '123456',
          })
        } catch (e) {
          console.log(e)
        }
        this.loadStudentMessage()
      }
    },
    async toggleDisable(id) {
      //禁用学生账号
      if (confirm('是否要禁用该账户')) {
        try {
          await this.$axios.post('/user/blockStudent', {
            id: id,
          })
        } catch (e) {
          console.log(e)
        }
        this.loadStudentMessage()
      }
    },
    async confirmDelete(id) {
      //删除学生
      if (confirm('是否要删除学生')) {
        try {
          await this.$axios.post('/user/deleteStudent', {
            id: id,
          })
        } catch (e) {
          console.log(e)
        }
        this.loadStudentMessage()
      }
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
      //获取学生信息
      const response = await this.$axios.get('/user/getStudentList')
      this.students = response.data.data
      for (let item of this.students) {
        if (item.name == null) {
          item.name = '未设置'
        }
        if (item.blocked == 1) {
          item.blocked = '被禁用'
        } else {
          item.blocked = '正常使用'
        }
      }
    },
    async loadTeacherMessage() {
      try {
        const response = await this.$axios.get('/user/getUserMessage')
        let data = response.data.data
        if (data.name != null) {
          this.user.name = data.name
        } else {
          this.user.name = '未设置'
        }
        if (data.account != null) this.user.account = data.account
        if (data.avatar != null) this.user.avatar = data.avatar
        if (data.signature != null) this.user.signature = data.signature
      } catch {
        alert('请重新登录')
        this.$router.push('/login')
      }
    },
  },
  mounted() {
    this.loadTeacherMessage()
    this.loadStudentMessage()
  },
}
</script>

<style scoped>
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

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center; /* 使单元格中的文本居中 */
}

th {
  background-color: #f2f2f2;
}

.actions {
  display: flex;
  justify-content: space-around;
}
</style>
