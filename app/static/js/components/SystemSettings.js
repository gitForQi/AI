const { createApp, ref, computed } = Vue;
const { ElMessage, ElMessageBox } = ElementPlus;

const SystemSettings = {
    setup() {
        const config = ref({
            api_key: '',
            base_url: '',
            api_proxy: '',
            model_name: 'gpt-3.5-turbo',
            temperature: 0.7,
            max_tokens: 4096,
            auto_save_interval: 300,
            theme: 'light',
            language: 'zh-CN',
            models: []
        });

        // 新增：模型编辑对话框
        const modelDialogVisible = ref(false);
        const editingModel = ref({
            name: '',
            value: '',
            max_tokens: 4096,
            temperature: 0.7,
            description: ''
        });
        const isEditMode = ref(false);

        // 加载配置
        const loadConfig = async () => {
            try {
                const response = await fetch('/api/config');
                const result = await response.json();
                if (result.code === 200) {
                    config.value = result.data;
                }
            } catch (error) {
                ElMessage.error('加载配置失败');
            }
        };

        // 保存配置
        const saveConfig = async () => {
            try {
                const response = await fetch('/api/config', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(config.value)
                });
                const result = await response.json();
                if (result.code === 200) {
                    ElMessage.success('保存配置成功');
                } else {
                    ElMessage.error(result.message);
                }
            } catch (error) {
                ElMessage.error('保存配置失败');
            }
        };

        // 重置配置
        const resetConfig = () => {
            loadConfig();
        };

        // 新增：添加模型
        const addModel = () => {
            isEditMode.value = false;
            editingModel.value = {
                name: '',
                value: '',
                max_tokens: 4096,
                temperature: 0.7,
                description: ''
            };
            modelDialogVisible.value = true;
        };

        // 新增：编辑模型
        const editModel = (model) => {
            isEditMode.value = true;
            editingModel.value = { ...model };
            modelDialogVisible.value = true;
        };

        // 新增：删除模型
        const deleteModel = async (model) => {
            try {
                await ElMessageBox.confirm(
                    `确定要删除模型 "${model.name}" 吗？`,
                    '警告',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                );
                
                const index = config.value.models.findIndex(m => m.value === model.value);
                if (index > -1) {
                    config.value.models.splice(index, 1);
                    await saveConfig();
                    ElMessage.success('删除成功');
                }
            } catch (error) {
                if (error !== 'cancel') {
                    ElMessage.error('删除失败');
                }
            }
        };

        // 新增：保存模型
        const saveModel = async () => {
            if (!editingModel.value.name || !editingModel.value.value) {
                ElMessage.error('模型名称和值不能为空');
                return;
            }

            if (!isEditMode.value) {
                // 添加新模型
                config.value.models.push({ ...editingModel.value });
            } else {
                // 更新现有模型
                const index = config.value.models.findIndex(m => m.value === editingModel.value.value);
                if (index > -1) {
                    config.value.models[index] = { ...editingModel.value };
                }
            }

            await saveConfig();
            modelDialogVisible.value = false;
        };

        // 页面加载时获取配置
        loadConfig();

        return {
            config,
            saveConfig,
            resetConfig,
            // 新增：模型管理相关
            modelDialogVisible,
            editingModel,
            isEditMode,
            addModel,
            editModel,
            deleteModel,
            saveModel
        };
    },
    template: `
        <div class="system-settings">
            <el-form :model="config" label-width="120px">
                <el-form-item label="API密钥">
                    <el-input v-model="config.api_key" type="password" show-password />
                </el-form-item>
                
                <el-form-item label="API基础地址">
                    <el-input v-model="config.base_url" />
                </el-form-item>
                
                <el-form-item label="API代理">
                    <el-input v-model="config.api_proxy" placeholder="可选" />
                </el-form-item>
                
                <el-form-item label="AI模型">
                    <div class="model-section">
                        <el-select v-model="config.model_name" style="width: 100%">
                            <el-option
                                v-for="model in config.models"
                                :key="model.value"
                                :label="model.name"
                                :value="model.value">
                                <span>{{ model.name }}</span>
                                <span class="model-description">{{ model.description }}</span>
                            </el-option>
                        </el-select>
                        <div class="model-actions">
                            <el-button type="primary" @click="addModel">添加模型</el-button>
                        </div>
                    </div>
                </el-form-item>
                
                <el-form-item label="模型列表">
                    <el-table :data="config.models" style="width: 100%">
                        <el-table-column prop="name" label="名称" />
                        <el-table-column prop="value" label="模型ID" />
                        <el-table-column prop="max_tokens" label="最大令牌" />
                        <el-table-column prop="temperature" label="温度" />
                        <el-table-column prop="description" label="描述" />
                        <el-table-column label="操作" width="150">
                            <template #default="scope">
                                <el-button size="small" @click="editModel(scope.row)">编辑</el-button>
                                <el-button size="small" type="danger" @click="deleteModel(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                
                <el-form-item label="温度">
                    <el-slider v-model="config.temperature" :min="0" :max="1" :step="0.1" />
                </el-form-item>
                
                <el-form-item label="最大令牌数">
                    <el-input-number v-model="config.max_tokens" :min="1" :max="8192" style="width: 100%" />
                </el-form-item>
                
                <el-form-item label="自动保存间隔">
                    <el-input-number 
                        v-model="config.auto_save_interval" 
                        :min="60" 
                        :step="60" 
                        style="width: 100%"
                    >
                        <template #suffix>秒</template>
                    </el-input-number>
                </el-form-item>
                
                <el-form-item label="界面主题">
                    <el-select v-model="config.theme" style="width: 100%">
                        <el-option label="浅色" value="light" />
                        <el-option label="深色" value="dark" />
                    </el-select>
                </el-form-item>
                
                <el-form-item label="语言">
                    <el-select v-model="config.language" style="width: 100%">
                        <el-option label="简体中文" value="zh-CN" />
                        <el-option label="English" value="en-US" />
                    </el-select>
                </el-form-item>
                
                <el-form-item>
                    <el-button type="primary" @click="saveConfig">保存配置</el-button>
                    <el-button @click="resetConfig">重置</el-button>
                </el-form-item>
            </el-form>

            <!-- 模型编辑对话框 -->
            <el-dialog
                :title="isEditMode ? '编辑模型' : '添加模型'"
                v-model="modelDialogVisible"
                width="500px"
            >
                <el-form :model="editingModel" label-width="100px">
                    <el-form-item label="模型名称">
                        <el-input v-model="editingModel.name" />
                    </el-form-item>
                    <el-form-item label="模型ID">
                        <el-input v-model="editingModel.value" :disabled="isEditMode" />
                    </el-form-item>
                    <el-form-item label="最大令牌">
                        <el-input-number v-model="editingModel.max_tokens" :min="1" :max="32768" />
                    </el-form-item>
                    <el-form-item label="默认温度">
                        <el-slider v-model="editingModel.temperature" :min="0" :max="1" :step="0.1" />
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input v-model="editingModel.description" type="textarea" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="modelDialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="saveModel">确定</el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    `
};

// 创建 Vue 应用并挂载
const app = createApp(SystemSettings);
app.use(ElementPlus);
app.mount('#settings-app'); 