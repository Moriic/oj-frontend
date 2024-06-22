<template>
  <div class="reset-container">
    <div class="reset-box">
      <h2>重设密码</h2>
      <form @submit.prevent="handleResetPassword">
        <div class="input-group">
          <input
            id="new-password"
            v-model="account"
            required
            placeholder="账号"
          />
        </div>
        <div class="input-group">
          <input
            type="password"
            id="new-password"
            v-model="newPassword"
            required
            placeholder="新密码"
          />
        </div>
        <div class="input-group">
          <input
            type="password"
            id="confirm-password"
            v-model="confirmPassword"
            required
            placeholder="确认新密码"
          />
        </div>
        <button type="submit" class="reset-button">重设密码</button>
      </form>
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
      account: '',
      newPassword: '',
      confirmPassword: '',
      error: '',
      successMessage: '',
    }
  },
  methods: {
    async handleResetPassword() {
      // 清空之前的错误信息
      this.error = ''
      this.successMessage = ''

      if (!/^\d{10}$/.test(this.account)) {
        this.error = '学号必须为10位数字'
        return
      }

      // 验证输入
      if (this.newPassword === '' || this.confirmPassword === '') {
        this.error = '密码不能为空'
        return
      }

      if (this.newPassword !== this.confirmPassword) {
        this.error = '两次输入的密码不一致'
        return
      }

      // 发送重设密码请求
      try {
        const response = await this.$axios.post('/user/resetPassword', {
          account: this.account,
          password: this.newPassword,
        })

        // 检查响应状态
        if (response.data.code === 0) {
          this.successMessage = '密码重设成功'
          setTimeout(() => {
            this.$router.push('/login')
          }, 1000)
        } else {
          this.error = '重设密码失败，请稍后再试'
        }
      } catch (error) {
        console.error(error)
        this.error = '重设密码失败，请稍后再试'
      }
    },
  },
}
</script>

<style scoped>
.reset-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #5c3aff 0%, #7c67ff 100%);
}

.reset-box {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 2rem;
  width: 400px;
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

.reset-button {
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

.reset-button:hover {
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
</style>
