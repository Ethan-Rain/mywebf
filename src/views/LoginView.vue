<template>
  <div class="login-container">
    <div class="login-box">
      <h2>用户登录</h2>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const loginForm = ref({
  username: '',
  password: ''
})

const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
}

const loading = ref(false)
const loginFormRef = ref()

const handleLogin = async () => {
  loading.value = true
  try {
    await loginFormRef.value.validate()
    await userStore.login(loginForm.value)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (error) {
    ElMessage.error('登录失败，请检查输入')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 整体背景：采用柔和绿调渐变 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #e0f7e9, #f0fdfc);
}

/* 登录框基本样式 */
.login-box {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px 60px;
  width: 400px;
  text-align: center;
}

/* 标题样式 */
.login-box h2 {
  margin-bottom: 20px;
  color: var(--main-green, #7ecfa1);
  font-size: 2rem;
  font-weight: bold;
}

/* 表单区域 */
.login-form {
  margin-top: 20px;
}
.el-form-item {
  margin-bottom: 20px;
}

/* input 框圆角美化 */
.el-input__inner {
  border-radius: 6px;
}

/* 登录按钮 */
.login-button {
  width: 100%;
  border-radius: 6px;
  font-weight: bold;
  background: linear-gradient(145deg, var(--main-green, #7ecfa1), var(--accent-green, #a8e0c8));
  border: 2px solid rgba(60, 120, 80, 0.7);
  box-shadow: 0 6px 12px rgba(60, 120, 80, 0.2);
  transition: all 0.2s ease;
}
.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(60, 120, 80, 0.3);
  border: 2px solid rgba(60, 120, 80, 0.9);
  color: var(--button-hover-color, rgba(255, 255, 255, 0.85));
}

/* 可选：自定义element-plus组件颜色变量（若需要，可根据项目进行全局调整） */
:root {
  --main-green: #7ecfa1;
  --accent-green: #a8e0c8;
  --button-hover-color: rgba(255, 255, 255, 0.85);
  --text-shadow-color: rgba(60, 120, 80, 0.3);
  --button-text-color: #ffffff;
}
</style>
