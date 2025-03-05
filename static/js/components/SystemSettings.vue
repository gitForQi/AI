<template>
  <div class="system-settings">
    <el-form :model="config" label-width="120px">
      <el-form-item label="API密钥">
        <el-input v-model="config.api_key" type="password" show-password />
      </el-form-item>
      
      <el-form-item label="API基础地址">
        <el-input v-model="config.api_base" />
      </el-form-item>
      
      <el-form-item label="API代理">
        <el-input v-model="config.api_proxy" placeholder="可选" />
      </el-form-item>
      
      <el-form-item label="AI模型">
        <el-select v-model="config.model_name">
          <el-option label="GPT-3.5" value="gpt-3.5-turbo" />
          <el-option label="GPT-4" value="gpt-4" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="温度">
        <el-slider v-model="config.temperature" :min="0" :max="1" :step="0.1" />
      </el-form-item>
      
      <el-form-item label="最大令牌数">
        <el-input-number v-model="config.max_tokens" :min="1" :max="8192" />
      </el-form-item>
      
      <el-form-item label="自动保存间隔">
        <el-input-number v-model="config.auto_save_interval" :min="60" :step="60">
          <template #suffix>秒</template>
        </el-input-number>
      </el-form-item>
      
      <el-form-item label="界面主题">
        <el-select v-model="config.theme">
          <el-option label="浅色" value="light" />
          <el-option label="深色" value="dark" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="语言">
        <el-select v-model="config.language">
          <el-option label="简体中文" value="zh-CN" />
          <el-option label="English" value="en-US" />
        </el-select>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="saveConfig">保存配置</el-button>
        <el-button @click="resetConfig">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'SystemSettings',
  setup() {
    const config = ref({
      api_key: '',
      api_base: '',
      api_proxy: '',
      model_name: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 4096,
      auto_save_interval: 300,
      theme: 'light',
      language: 'zh-CN'
    })

    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config')
        const result = await response.json()
        if (result.code === 200) {
          config.value = result.data
        }
      } catch (error) {
        ElMessage.error('加载配置失败')
      }
    }

    const saveConfig = async () => {
      try {
        const response = await fetch('/api/config', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(config.value)
        })
        const result = await response.json()
        if (result.code === 200) {
          ElMessage.success('保存配置成功')
        } else {
          ElMessage.error(result.message)
        }
      } catch (error) {
        ElMessage.error('保存配置失败')
      }
    }

    const resetConfig = () => {
      loadConfig()
    }

    onMounted(() => {
      loadConfig()
    })

    return {
      config,
      saveConfig,
      resetConfig
    }
  }
}
</script>

<style scoped>
.system-settings {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
</style> 