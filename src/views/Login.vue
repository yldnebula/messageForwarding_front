<template>
  <div class="home">
    <div class="login-container">
      <div class="pageHeader">
        <!--      <img src="../assets/logo.png" alt="logo">-->
      </div>

      <div class="login-box">
        <div class="login-text" v-if="typeView != 2">
          <span :class="'active'">登录</span>
        </div>
        <!-- 登录模块 -->
        <div class="right-content" v-show="typeView == 0">
          <div class="input-box">
            <input
              autocomplete="off"
              type="text"
              class="input"
              v-model="formLogin.userName"
              placeholder="请输入您的ID"
            />

          </div>
          <el-button
            class="loginBtn"
            type="primary"
            :disabled="isDisabled"
            :loading="isLoading"
            @click.stop="login">
            立即登录
          </el-button>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  components: {},
  data () {
    return {
      formLogin: {
        userName: '',
        userPwd: ''
      },
      formRegister: {
        userName: '',
        userPwd2: '',
        userPwd: ''
      },
      typeView: 0, // 显示不同的view
      checked: false, // 记住登录
      isLoading: false
    }
  },
  computed: {
    // 登陆按钮状态
    isDisabled () {
      return !(this.formLogin.userName)
    }
  },
  mounted () {
    this.selectLogin()
  },
  methods: {
    // 输入框焦点样式
    focusInput (index) {
      if (index === 1) {
        this.$refs.loginVerifyCode.style.borderBottomColor = '#0f52e0'
      } else {
        this.$refs.resetVerifyCode.style.borderBottomColor = '#0f52e0'
      }
    },
    blurInput (index) {
      if (index === 2) {
        this.$refs.resetVerifyCode.style.borderBottomColor = '#e7e7e7'
      } else {
        this.$refs.loginVerifyCode.style.borderBottomColor = '#e7e7e7'
      }
    },
    // 返回登录界面
    selectLogin () {
      this.typeView = 0
      this.clearInput()
    },
    // 立即登录
    login () {
      let that = this
      if (this.isDisabled || this.isLoading) {
        return false
      }
      if (!this.$Valid.validUserName(this.formLogin.userName)) {
        that.$notify.error({
          title: '错误',
          message: '请输入正确的ID'
        })
        return false
      }
      this.isLoading = true
      this.$router.push({name: 'Client2', params: {userId: that.formLogin.userName}})
    },
    // 清空输入框
    clearInput () {
      this.formLogin = {
        userName: '',
        userPwd: ''
      }
      this.formRegister = {
        userName: '',
        userPwd2: '',
        userPwd: ''
      }
    }
  }
}
</script>

<style scoped>
.home {
  width: 100%;
  height: 100vh;
  background: url("../assets/bg.jpg") center center repeat;
  background-size: 100% 100%;
  position: fixed;
}

.login-container {
  background-position: center;
  background-size: cover;
  position: relative;
  width: 100%;
  height: 100%;
}

.login-container .pageHeader {
  padding-top: 30px;
  padding-left: 40px;
}

.login-container .pageHeader img {
  vertical-align: middle;
  display: inline-block;
  margin-right: 15px;
}

.login-container .pageHeader span {
  font-size: 18px;
  display: inline-block;
  vertical-align: -4px;
  color: rgba(255, 255, 255, 1);
}

.login-container .login-box {
  position: absolute;
  left: 64vw;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  box-sizing: border-box;
  text-align: center;
  box-shadow: 0 1px 11px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  /*margin: 100px auto 0;
  */
  width: 420px;
  background: #fff;
  padding: 45px 35px;
}

.login-container .login-box .option {
  text-align: left;
  margin-top: 18px;
}

.login-container .login-box .option .checked {
  padding-left: 5px;
}

.login-container .login-box .option .forget-pwd, .login-container .login-box .option .goback {
  float: right;
  font-size: 14px;
  font-weight: 400;
  color: #4981f2;
  line-height: 20px;
  cursor: pointer;
}

.login-container .login-box .option .protocol {
  color: #4981f2;
  cursor: pointer;
}

.login-container .login-box .login-text {
  width: 100%;
  text-align: center;
  padding: 0 0 30px;
  font-size: 24px;
  letter-spacing: 1px;
}

.login-container .login-box .login-text a {
  padding: 10px;
  color: #969696;
}

.login-container .login-box .login-text a.active {
  font-weight: 600;
  color: rgba(73, 129, 242, 1);
  border-bottom: 2px solid rgba(73, 129, 242, 1);
}

.login-container .login-box .login-text a:hover {
  border-bottom: 2px solid rgba(73, 129, 242, 1);
}

.login-container .login-box .login-text b {
  padding: 10px;
}

.login-container .login-box .title {
  font-weight: 600;
  padding: 0 0 30px;
  font-size: 24px;
  letter-spacing: 1px;
  color: rgba(73, 129, 242, 1);
}

.login-container .login-box .input-box .input {
  /*margin-top: 10px;
  */
}

.login-container .login-box .input-box .input:nth-child(2), .login-container .login-box .input-box .input:nth-child(3) {
  margin-top: 20px;
}

.login-container .login-box .loginBtn {
  width: 100%;
  height: 45px;
  margin-top: 40px;
  font-size: 15px;
}

.login-container .login-box .input {
  padding: 10px 0px;
  font-size: 15px;
  width: 350px;
  color: #2c2e33;
  outline: none;
  border: 1px solid #fff;
  border-bottom-color: #e7e7e7;
  background-color: rgba(0, 0, 0, 0);
}

.login-container .login-box input:focus {
  border-bottom-color: #0f52e0;
  outline: none;
}

.login-container .login-box .button {
  line-height: 45px;
  cursor: pointer;
  margin-top: 50px;
  border: none;
  outline: none;
  height: 45px;
  width: 350px;
  background: rgba(216, 216, 216, 1);
  border-radius: 2px;
  color: white;
  font-size: 15px;
}

.login-container ::-webkit-scrollbar {
  width: 10px;
}

.login-container ::-webkit-scrollbar-track {
  border-radius: 8px;
}

.login-container ::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
}

.login-container ::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(0, 0, 0, 0.4);
}

.login-container ::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #bebebe;
  font-size: 16px;
}

.login-container ::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #bebebe;
  font-size: 16px;
}

.login-container :-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #bebebe;
  font-size: 16px;
}

.login-container input:-webkit-autofill {
  box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 1) inset;
  -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 1) inset;
  -webkit-text-fill-color: #2c2e33;
}

.login-container .ivu-checkbox-wrapper {
  margin-right: 0;
}
</style>
