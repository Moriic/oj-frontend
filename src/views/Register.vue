<template>
  <div class="register-container">
    <div class="register-box">
      <h2>用户注册</h2>
      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <input
            type="text"
            id="username"
            v-model="username"
            required
            placeholder="学号"
          />
        </div>
        <div class="input-group">
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="输入密码"
          />
        </div>
        <div class="input-group">
          <input
            type="password"
            id="confirm-password"
            v-model="confirmPassword"
            required
            placeholder="确认密码"
          />
        </div>
        <button type="submit" class="register-button" @click="register">
          注册
        </button>
      </form>
      <div class="login-link">
        <div @click="goToLogin">已有账号？点击登录</div>
      </div>
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      error: '',
      successMessage: '',
    }
  },
  methods: {
    async handleRegister() {
      //验证是否是可注册状态
      const response = await this.$axios.get('/user/canRegister')
      console.log(response)
      if (response.status == 200) {
        if (response.data.data == 0) {
          ElMessage.error('无法注册')
          return
        }
      } else {
        ElMessage.error('系统错误')
        return
      }

      // 清空之前的错误信息
      this.error = ''
      this.successMessage = ''

      // 验证输入
      if (
        this.username === '' ||
        this.password === '' ||
        this.confirmPassword === ''
      ) {
        this.error = '所有字段不能为空'
        return
      }

      if (this.password !== this.confirmPassword) {
        this.error = '两次输入的密码不一致'
        return
      }

      if (!/^\d{10}$/.test(this.username)) {
        this.error = '学号必须为10位数字'
        return
      }

      // 发送注册请求
      try {
        const response = await this.$axios.post('/user/register', {
          account: this.username,
          password: this.password,
        })

        let data = response.data
        // 检查响应状态
        if (response.status === 200) {
          if (data.message == 'ok') {
            this.successMessage = '注册成功，请前往登录'
            setTimeout(() => {
              this.goToLogin()
            }, 1000) // 1000 毫秒 = 1 秒
          } else if (data.message == '注册账号已存在')
            ElMessage.success('账号已存在,请前往登录')
        } else {
          this.error = '注册失败，请稍后再试'
        }
      } catch (error) {
        this.error = '注册失败，请稍后再试'
      }
    },
    goToLogin() {
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #5c3aff 0%, #7c67ff 100%);
}

.register-box {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 2rem;
  width: 300px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  text-align: center;
}

h2 {
  color: white;
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1rem;
}

.input-group input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.register-button {
  width: 100%;
  padding: 0.75rem;
  border-radius: 5px;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.register-button:hover {
  background: rgba(255, 255, 255, 0.5);
}

.error-message {
  color: red;
  margin-top: 1rem;
}

.success-message {
  color: green;
  margin-top: 1rem;
}

.login-link {
  margin-top: 1rem;
}

.login-link div {
  color: white;
  cursor: pointer;
  text-decoration: none;
  transition: text-decoration 0.3s ease;
}

.login-link div:hover {
  text-decoration: underline;
}
</style>
