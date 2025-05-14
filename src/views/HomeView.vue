<template>
  <div class="home-container">
    <!-- 欢迎卡片 -->
    <el-card class="welcome-card">
      <div class="welcome-content">
        <div class="welcome-text">
          <h1 class="welcome-title">おかえりなさい、若葉むつみ</h1>
          <p class="welcome-subtitle">今日も一日頑張りましょう！</p>
          <el-button type="primary" class="action-button" @click="goToDashboard">
            ダッシュボードを見る
          </el-button>
        </div>
        <div class="welcome-image">
          <img src="/img/wakaba-illustration.svg" alt="若葉むつみ" class="character-image" />
        </div>
      </div>
    </el-card>

    <!-- 快速操作 -->
    <div class="quick-actions">
      <h2 class="section-title">クイックアクション</h2>
      <div class="action-grid">
        <el-card 
          v-for="(action, index) in quickActions" 
          :key="index"
          class="action-card"
          :body-style="{ padding: '20px' }"
          shadow="hover"
          @click="handleAction(action.path)"
        >
          <div class="action-content">
            <el-icon :size="32" :color="action.color" class="action-icon">
              <component :is="action.icon" />
            </el-icon>
            <h3 class="action-title">{{ action.title }}</h3>
            <p class="action-desc">{{ action.description }}</p>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="recent-activity">
      <h2 class="section-title">最近のアクティビティ</h2>
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in recentActivities"
          :key="index"
          :timestamp="activity.time"
          :type="activity.type"
          :color="activity.color"
          :hollow="activity.hollow"
        >
          <el-card>
            <p>{{ activity.content }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { markRaw } from 'vue'
import { 
  Upload as UploadIcon, 
  PictureRounded as PictureRoundedIcon, 
  Star as StarIcon, 
  Setting as SettingIcon 
} from '@element-plus/icons-vue'

const router = useRouter()

// 快速操作
const quickActions = [
  {
    title: '画像をアップロード',
    description: '新しい画像をアップロードします',
    icon: markRaw(UploadIcon),
    path: '/upload',
    color: '#ff7e79'
  },
  {
    title: 'ギャラリーを見る',
    description: 'アップロード済みの画像を閲覧します',
    icon: markRaw(PictureRoundedIcon),
    path: '/gallery',
    color: '#36a3f7'
  },
  {
    title: 'お気に入り',
    description: 'お気に入りに登録した画像を表示します',
    icon: markRaw(StarIcon),
    path: '/favorites',
    color: '#f6ad49'
  },
  {
    title: '設定',
    description: 'アプリケーションの設定を変更します',
    icon: markRaw(SettingIcon),
    path: '/settings',
    color: '#67c23a'
  }
]

// 最近の活動
const recentActivities = [
  {
    content: '新しい画像を10枚アップロードしました',
    time: '2023-05-15 14:30',
    type: 'primary',
    color: '#ff7e79',
    hollow: true
  },
  {
    content: '画像にタグを追加しました',
    time: '2023-05-15 10:15',
    type: 'success',
    color: '#67c23a',
    hollow: true
  },
  {
    content: '新しいアルバムを作成しました',
    time: '2023-05-14 16:45',
    type: 'warning',
    color: '#f6ad49',
    hollow: true
  },
  {
    content: 'プロフィールを更新しました',
    time: '2023-05-14 09:20',
    type: 'info',
    color: '#36a3f7',
    hollow: true
  }
]

// 导航到仪表盘
const goToDashboard = () => {
  router.push('/dashboard')
}

// 处理快速操作点击
const handleAction = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 欢迎卡片样式 */
.welcome-card {
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #ffd6e7 0%, #ff8fab 100%);
  border: none;
  color: #fff;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
}

.welcome-text {
  flex: 1;
}

.welcome-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #fff;
}

.welcome-subtitle {
  font-size: 16px;
  margin-bottom: 24px;
  opacity: 0.9;
}

.action-button {
  background-color: #fff;
  color: #ff7e79;
  border: none;
  font-weight: bold;
  padding: 10px 24px;
  border-radius: 20px;
  transition: all 0.3s;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.character-image {
  max-height: 200px;
  transition: all 0.3s;
}

.character-image:hover {
  transform: scale(1.05);
}

/* 快速操作 */
.quick-actions {
  margin-bottom: 32px;
}

.section-title {
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.section-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 18px;
  background: #ff7e79;
  margin-right: 8px;
  border-radius: 2px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.action-card {
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s;
  border: 1px solid #ebeef5;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.action-content {
  text-align: center;
  padding: 10px;
}

.action-icon {
  margin-bottom: 16px;
  transition: all 0.3s;
}

.action-card:hover .action-icon {
  transform: scale(1.2);
}

.action-title {
  font-size: 16px;
  margin-bottom: 8px;
  color: #333;
}

.action-desc {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

/* 最近活动 */
.recent-activity {
  margin-bottom: 32px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .welcome-content {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }
  
  .welcome-text {
    margin-bottom: 20px;
  }
  
  .character-image {
    max-height: 150px;
  }
  
  .action-grid {
    grid-template-columns: 1fr;
  }
}
</style>
