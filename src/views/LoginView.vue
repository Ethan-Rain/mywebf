<template>
  <div class="login-page">
    <!-- 背景小颗粒 -->
    <div class="dots-bg" aria-hidden="true"></div>

    <!-- 行星轨道装饰 -->
    <div class="orbit-system" aria-hidden="true">
      <div class="orbit orbit1">
        <div class="planet"></div>
      </div>
      <div class="orbit orbit2">
        <div class="planet earth">
          <div class="moon-orbit">
            <div class="moon"></div>
          </div>
        </div>
      </div>
      <div class="orbit orbit3">
        <div class="planet"></div>
      </div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-container">
      <el-card class="login-card">
        <h2 class="login-title">用户登录</h2>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入密码" />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              :disabled="loading"
              @click="onLogin"
            >
              {{ loading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginApi } from '@/api/auth';
import { ElMessage, ElForm } from 'element-plus';  // 导入ElForm类型

// 定义表单数据类型
interface FormData {
  username: string;
  password: string;
}

// 定义登录响应数据类型
interface LoginResponse {
  token: string;
  [key: string]: any;  // 允许其他额外字段
}

const router = useRouter();

const form = ref<FormData>({
  username: '',
  password: ''
});
const loading = ref(false);
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};
// 为formRef指定正确类型
const formRef = ref<InstanceType<typeof ElForm> | null>(null);

const onLogin = () => {
  // 先判断formRef是否存在
  if (!formRef.value) return;

  formRef.value.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;
    try {
      console.log('登录中...', form.value);
      // 调用登录接口并指定返回类型
      const response = await loginApi(form.value.username, form.value.password) as { data: LoginResponse };
      console.log('登录成功', response);

      // 保存token到本地存储（修正token获取路径）
      if (response && response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        // 登录成功后跳转到首页
        router.push('/');
      } else {
        ElMessage.error('登录失败：无效的响应格式');
      }
    } catch (error) {
      console.error('登录失败:', error);
      ElMessage.error('登录失败：用户名或密码错误');
    } finally {
      loading.value = false;
    }
  });
};
</script>

<style scoped>
.login-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 粒子背景和轨道动画复用首页样式 */
.dots-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(#ffffff20 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: 0;
}

/* 轨道系统样式 */
.orbit-system {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: rotate 60s linear infinite;
}

.orbit1 {
  width: 150px;
  height: 150px;
}
.orbit2 {
  width: 250px;
  height: 250px;
}
.orbit3 {
  width: 350px;
  height: 350px;
}

.planet {
  width: 12px;
  height: 12px;
  background-color: #00c6ff;
  border-radius: 50%;
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
}

.earth {
  background-color: #00ffcc;
}

.moon-orbit {
  width: 30px;
  height: 30px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  position: absolute;
  top: -9px;
  left: 50%;
  transform: translateX(-50%);
  animation: rotate 4s linear infinite;
}

.moon {
  width: 4px;
  height: 4px;
  background-color: #ffffff;
  border-radius: 50%;
  position: absolute;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* 登录框样式 */
.login-container {
  position: relative;
  z-index: 1;
}

.login-card {
  width: 360px;
  background-color: #1e1e1e;
  border: none;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.15);
  color: #fff;
}

.login-title {
  text-align: center;
  font-size: 20px;
  margin-bottom: 20px;
  color: #00ffe0;
}
</style>