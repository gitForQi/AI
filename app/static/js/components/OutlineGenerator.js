const { createApp, ref, reactive } = Vue;
const { ElMessage } = ElementPlus;

const OutlineGenerator = {
    setup() {
        // 表单数据
        const outlineForm = reactive({
            title: '',
            background: '',
            styles: [], // 改为数组以支持多选
            customStyles: [], // 新增：自定义风格数组
            chapters: 10,
            characters: [{
                name: '',
                role: '',
                description: '',
                personality: '',
                goals: [''],
                relationships: []
            }],
            conflicts: [{
                type: '',
                description: '',
                relatedCharacters: [],
                resolution: ''
            }],
            requirements: ''
        });

        // 预设故事风格选项
        const styleOptions = ref([
            { label: '奇幻', value: 'fantasy' },
            { label: '科幻', value: 'sci-fi' },
            { label: '武侠', value: 'wuxia' },
            { label: '言情', value: 'romance' },
            { label: '悬疑', value: 'mystery' },
            { label: '都市', value: 'urban' },
            { label: '历史', value: 'historical' },
            { label: '惊悚', value: 'thriller' },
            { label: '冒险', value: 'adventure' }
        ]);

        // 新增：自定义风格输入
        const newStyle = ref('');

        // 新增：添加自定义风格
        const addCustomStyle = () => {
            if (!newStyle.value.trim()) {
                return;
            }
            // 检查是否已存在
            const styleExists = styleOptions.value.some(s => s.label === newStyle.value) ||
                              outlineForm.customStyles.includes(newStyle.value);
            if (styleExists) {
                ElMessage.warning('该风格已存在');
                return;
            }
            // 添加到自定义风格列表
            outlineForm.customStyles.push(newStyle.value);
            // 自动选中新添加的风格
            outlineForm.styles.push(newStyle.value);
            newStyle.value = '';
        };

        // 新增：删除自定义风格
        const removeCustomStyle = (style) => {
            const index = outlineForm.customStyles.indexOf(style);
            if (index > -1) {
                outlineForm.customStyles.splice(index, 1);
                // 同时从选中的风格中移除
                const selectedIndex = outlineForm.styles.indexOf(style);
                if (selectedIndex > -1) {
                    outlineForm.styles.splice(selectedIndex, 1);
                }
            }
        };

        // 角色身份预设选项
        const roleOptions = [
            { label: '主角', value: 'protagonist' },
            { label: '反派', value: 'antagonist' },
            { label: '配角', value: 'supporting' },
            { label: '导师', value: 'mentor' },
            { label: '盟友', value: 'ally' },
            { label: '对手', value: 'rival' }
        ];

        // 冲突类型预设选项
        const conflictTypes = [
            { label: '人物内心冲突', value: 'internal' },
            { label: '人物之间冲突', value: 'interpersonal' },
            { label: '人物与环境冲突', value: 'environmental' },
            { label: '人物与社会冲突', value: 'social' },
            { label: '人物与命运冲突', value: 'fate' }
        ];

        // 生成的大纲
        const generatedOutline = ref('');
        const loading = ref(false);

        // 添加角色
        const addCharacter = () => {
            outlineForm.characters.push({
                name: '',
                role: '',
                description: '',
                personality: '',
                goals: [''],
                relationships: []
            });
        };

        // 删除角色
        const removeCharacter = (index) => {
            outlineForm.characters.splice(index, 1);
        };

        // 添加角色目标
        const addCharacterGoal = (characterIndex) => {
            outlineForm.characters[characterIndex].goals.push('');
        };

        // 删除角色目标
        const removeCharacterGoal = (characterIndex, goalIndex) => {
            outlineForm.characters[characterIndex].goals.splice(goalIndex, 1);
        };

        // 添加冲突
        const addConflict = () => {
            outlineForm.conflicts.push({
                type: '',
                description: '',
                relatedCharacters: [],
                resolution: ''
            });
        };

        // 删除冲突
        const removeConflict = (index) => {
            outlineForm.conflicts.splice(index, 1);
        };
        // 生成大纲（测试用）
        const generateOutline = async () => {
            if (!outlineForm.title || !outlineForm.background) {
                ElMessage.warning('请至少填写小说标题和背景设定');
                return;
            }
        };
        // 添加展开状态控制 (修复位置错误)
        const showAdvanced = ref(false);

        return {
            outlineForm,
            styleOptions,
            newStyle,
            addCustomStyle,
            removeCustomStyle,
            generatedOutline,
            loading,
            addCharacter,
            removeCharacter,
            addConflict,
            removeConflict,
            generateOutline,
            roleOptions,
            conflictTypes,
            addCharacterGoal,
            removeCharacterGoal,
            showAdvanced
        };
    },  // <-- 确保 setup() 函数在此正确闭合
template: `
        <div class="outline-container">
            <h2>小说大纲生成</h2>
            
            <el-form :model="outlineForm" label-width="100px" class="outline-form">
                <!-- 基础配置部分保持不变 -->
                <el-form-item label="小说标题" required>
                    <el-input v-model="outlineForm.title" placeholder="请输入小说标题" />
                </el-form-item>
                
                <el-form-item label="故事背景" required>
                    <el-input 
                        v-model="outlineForm.background" 
                        type="textarea" 
                        :rows="4"
                        placeholder="请描述故事的背景设定，包括时代、地点等" 
                    />
                </el-form-item>
                
                <el-form-item label="故事风格">
                    <div class="style-section">
                        <!-- 预设风格多选 -->
                        <el-checkbox-group v-model="outlineForm.styles">
                            <el-checkbox 
                                v-for="item in styleOptions" 
                                :key="item.value" 
                                :label="item.value"
                            >
                                {{ item.label }}
                            </el-checkbox>
                        </el-checkbox-group>
                        
                        <!-- 自定义风格输入 -->
                        <div class="custom-style-input">
                            <el-input
                                v-model="newStyle"
                                placeholder="添加自定义风格"
                                @keyup.enter="addCustomStyle"
                            >
                                <template #append>
                                    <el-button @click="addCustomStyle">添加</el-button>
                                </template>
                            </el-input>
                        </div>
                        
                        <!-- 自定义风格标签展示 -->
                        <div class="custom-style-tags" v-if="outlineForm.customStyles.length">
                            <el-tag
                                v-for="style in outlineForm.customStyles"
                                :key="style"
                                closable
                                @close="removeCustomStyle(style)"
                                class="custom-style-tag"
                            >
                                {{ style }}
                            </el-tag>
                        </div>
                    </div>
                </el-form-item>
                
                <el-form-item label="章节数量">
                    <el-input-number 
                        v-model="outlineForm.chapters" 
                        :min="1" 
                        :max="100"
                        style="width: 100%"
                    />
                </el-form-item>
                <!-- 新增：包裹所有高级配置内容 -->
                <div v-show="showAdvanced">
                    <!-- 人物设定部分 -->
                    <div class="section-title">人物设定（可选）</div>
                    <div v-for="(character, charIndex) in outlineForm.characters" 
                         :key="charIndex" 
                         class="character-card">
                        <div class="card-header">
                            <h3>角色 {{ charIndex + 1 }}</h3>
                            <el-button 
                                v-if="charIndex > 0" 
                                type="danger" 
                                size="small" 
                                @click="removeCharacter(charIndex)"
                            >
                                删除角色
                            </el-button>
                        </div>
                        
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="角色名称">
                                    <el-input v-model="character.name" placeholder="角色名称" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="角色身份">
                                    <el-select v-model="character.role" placeholder="选择角色身份" style="width: 100%">
                                        <el-option
                                            v-for="role in roleOptions"
                                            :key="role.value"
                                            :label="role.label"
                                            :value="role.value"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        
                        <el-form-item label="性格特点">
                            <el-input 
                                v-model="character.personality" 
                                type="textarea" 
                                :rows="2"
                                placeholder="描述角色的性格特点" 
                            />
                        </el-form-item>
                        
                        <el-form-item label="背景描述">
                            <el-input 
                                v-model="character.description" 
                                type="textarea" 
                                :rows="3"
                                placeholder="描述角色的背景故事" 
                            />
                        </el-form-item>
                        
                        <div class="character-goals">
                            <div class="goals-header">
                                <label>角色目标</label>
                                <el-button 
                                    type="primary" 
                                    size="small"
                                    @click="addCharacterGoal(charIndex)"
                                >
                                    添加目标
                                </el-button>
                            </div>
                            <div v-for="(goal, goalIndex) in character.goals" 
                                 :key="goalIndex"
                                 class="goal-item">
                                <el-input 
                                    v-model="character.goals[goalIndex]"
                                    placeholder="角色想要达成的目标"
                                >
                                    <template #append>
                                        <el-button 
                                            v-if="goalIndex > 0"
                                            @click="removeCharacterGoal(charIndex, goalIndex)"
                                        >
                                            删除
                                        </el-button>
                                    </template>
                                </el-input>
                            </div>
                        </div>
                    </div>
                    <el-button type="primary" plain @click="addCharacter">添加角色</el-button>
                    <!-- 核心冲突部分 -->
                    <div class="section-title">核心冲突（可选）</div>
                    <div v-for="(conflict, conflictIndex) in outlineForm.conflicts" 
                         :key="conflictIndex"
                         class="conflict-card">
                        <div class="card-header">
                            <h3>冲突 {{ conflictIndex + 1 }}</h3>
                            <el-button 
                                v-if="conflictIndex > 0" 
                                type="danger" 
                                size="small" 
                                @click="removeConflict(conflictIndex)"
                            >
                                删除冲突
                            </el-button>
                        </div>
                        
                        <el-form-item label="冲突类型">
                            <el-select v-model="conflict.type" placeholder="选择冲突类型" style="width: 100%">
                                <el-option
                                    v-for="type in conflictTypes"
                                    :key="type.value"
                                    :label="type.label"
                                    :value="type.value"
                                />
                            </el-select>
                        </el-form-item>
                        
                        <el-form-item label="冲突描述">
                            <el-input 
                                v-model="conflict.description" 
                                type="textarea" 
                                :rows="3"
                                placeholder="详细描述冲突的内容" 
                            />
                        </el-form-item>
                        
                        <el-form-item label="相关角色">
                            <el-select 
                                v-model="conflict.relatedCharacters" 
                                multiple 
                                placeholder="选择相关角色"
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="(char, index) in outlineForm.characters"
                                    :key="index"
                                    :label="char.name"
                                    :value="index"
                                />
                            </el-select>
                        </el-form-item>
                        
                        <el-form-item label="预期解决">
                            <el-input 
                                v-model="conflict.resolution" 
                                type="textarea" 
                                :rows="2"
                                placeholder="描述冲突可能的解决方式" 
                            />
                        </el-form-item>
                    </div>
                    <el-button type="primary" plain @click="addConflict">添加冲突</el-button>
                </div>
                <!-- 移动高级按钮到生成按钮上方 -->
                <el-form-item label-width="0">
                    <div class="advanced-toggle" style="margin: 20px 0 10px">
                        <el-button 
                            type="primary" 
                            plain
                            @click="showAdvanced = !showAdvanced"
                            class="toggle-button">
                            {{ showAdvanced ? '收起高级配置' : '展开高级配置' }}
                            <i :class="showAdvanced ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                        </el-button>
                    </div>
                </el-form-item>
                <!-- 生成按钮保持原位 -->
                <el-form-item>
                    <el-button 
                        type="primary" 
                        @click="generateOutline" 
                        :loading="loading"
                        style="width: 100%">
                        生成大纲
                    </el-button>
                </el-form-item>
            </el-form>
            
            <div v-if="generatedOutline" class="generated-outline">
                <div class="section-title">生成结果</div>
                <div class="outline-content">
                    {{ generatedOutline }}
                </div>
                <div class="outline-actions">
                    <el-button type="primary">保存大纲</el-button>
                    <el-button>导出</el-button>
                </div>
            </div>
        </div>
    `  // <-- 确保模板字符串正确闭合
};

// 创建 Vue 应用并挂载
const app = createApp(OutlineGenerator);
app.use(ElementPlus);
app.mount('#outline-app');