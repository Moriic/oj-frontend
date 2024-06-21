<template>
  <div class="login-container">
    <div class="login-box">
      <h2>用户登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <input
            type="text"
            id="username"
            v-model="username"
            required
            placeholder="学号"
          />
          <div v-if="account_error != ''" class="error-message">
            {{ account_error }}
          </div>
        </div>
        <div class="input-group">
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="输入密码"
          />
          <div v-if="password_error != ''" class="error-message">
            {{ password_error }}
          </div>
          <div v-if="login_error != ''" class="error-message">
            {{ login_error }}
          </div>
        </div>
        <div class="remember-forgot">
          <div class="rememer-password">
            <input type="checkbox" id="rememberMe" v-model="rememberMe" />
            <label for="rememberMe">储存密码</label>
          </div>
          <div>
            <a @click="handleForgotPassword">重设密码</a>
          </div>
        </div>
        <button type="submit" class="login-button">登录</button>
      </form>
      <div class="register-link">
        <div @click="goToRegister">创建您的学生账号</div>
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
      rememberMe: false,
      account_error: '',
      password_error: '',
      login_error: '',
    }
  },
  methods: {
    async handleLogin() {
      // 进行登录逻辑处理
      let account = this.username
      let password = this.password

      let flag = true
      // 判断输入结果是否合理
      if (account == '') {
        this.account_error = '账号不能为空'
        flag = false
      } else if (!/^\d+$/.test(account)) {
        this.account_error = '账号必须为10位数字'
        flag = false
      }

      if (password == '') {
        this.password_error = '密码不能为空'
        flag = false
      }

      //发送登录请求
      if (flag) {
        try {
          const response = await this.$axios.post('/user/login', {
            account: account,
            password: password,
          })
          let data = response.data.data
          //登录成功
          if (response.status == 200) {
            if (data.blocked == 1) {
              alert('账号已被冻结')
              return
            }
            console.log(response.data)
            //获取身份信息
            localStorage.setItem('token', data.token)
            //存储角色身份
            localStorage.setItem('role', data.role)
            //跳转到首页
            alert('登录成功')
            this.$router.push('/home')
          } else {
            // 登录失败，显示错误信息
            alert('登录失败,账号或密码错误')
          }
        } catch (error) {
          // 处理网络或服务器错误
          console.error(error)
          this.login_error = '登录失败，请稍后重试。'
        }
      }
    },
    // 忘记密码逻辑
    handleForgotPassword() {
      this.$router.push('/forgetPassword')
    },
    goToRegister() {
      this.$router.push('/register')
    },
  },
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom, #4a00e0, #8e2de2);
}

.login-box {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 500px;
  text-align: center;
  color: white;
}

.login-box h2 {
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 14px;
}

.input-group input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.remember-forgot label {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.remember-forgot a {
  color: white;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
}

.rememer-password {
  display: flex;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: transparent;
  border: 1px solid white;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.register-link {
  margin-top: 20px;
  font-size: 14px;
}

.register-link div:hover {
  color: rgb(214, 117, 174);
  text-decoration: underline;
}

.error-message {
  display: flex;
  margin-top: 10px;
  color: red;
  font-size: 10px;
}
</style>
