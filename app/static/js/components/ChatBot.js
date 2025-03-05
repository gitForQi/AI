const { createApp, ref, onMounted, nextTick } = Vue;
const { ElMessage, ElMessageBox } = ElementPlus;

const ChatBot = {
    setup() {
        const messages = ref([]);
        const newMessage = ref('');
        const chatContainer = ref(null);
        const loading = ref(false);

        // 加载聊天历史
        const loadHistory = async () => {
            try {
                const response = await fetch('/api/chat/history');
                const result = await response.json();
                if (result.code === 200) {
                    messages.value = result.data;
                    await nextTick();
                    scrollToBottom();
                }
            } catch (error) {
                ElMessage.error('加载历史失败');
            }
        };

        // 发送消息
        const sendMessage = async () => {
            if (!newMessage.value.trim() || loading.value) {
                return;
            }

            loading.value = true;
            const userMessage = newMessage.value;
            
            // 立即添加用户消息到界面
            messages.value.push({
                role: 'user',
                content: userMessage,
                timestamp: new Date().toLocaleString()
            });
            newMessage.value = '';
            await nextTick();
            scrollToBottom();

            try {
                const response = await fetch('/api/chat/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: userMessage
                    })
                });
                
                const result = await response.json();
                if (result.code === 200) {
                    // 添加AI响应到界面
                    messages.value.push(result.data);
                    await nextTick();
                    scrollToBottom();
                } else {
                    ElMessage.error(result.message);
                }
            } catch (error) {
                ElMessage.error('发送失败');
                // 发送失败时移除用户消息
                messages.value.pop();
            } finally {
                loading.value = false;
            }
        };

        // 处理按键事件
        const handleKeyPress = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // 阻止默认的换行行为
                sendMessage();
            }
        };

        // 清空历史
        const clearHistory = async () => {
            try {
                await ElMessageBox.confirm(
                    '确定要清空聊天历史吗？',
                    '警告',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                );
                
                const response = await fetch('/api/chat/history', {
                    method: 'DELETE'
                });
                
                const result = await response.json();
                if (result.code === 200) {
                    messages.value = [];
                    ElMessage.success('清空成功');
                }
            } catch (error) {
                if (error !== 'cancel') {
                    ElMessage.error('清空失败');
                }
            }
        };

        // 滚动到底部
        const scrollToBottom = () => {
            if (chatContainer.value) {
                chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
            }
        };

        // 页面加载时获取历史消息
        onMounted(() => {
            loadHistory();
        });

        return {
            messages,
            newMessage,
            chatContainer,
            loading,
            sendMessage,
            clearHistory,
            handleKeyPress
        };
    },
    template: `
        <div class="chat-container">
            <div class="chat-header">
                <h2>AI助手</h2>
                <el-button type="danger" size="small" @click="clearHistory">清空历史</el-button>
            </div>
            
            <div class="chat-messages" ref="chatContainer">
                <div v-for="msg in messages" :key="msg.timestamp" 
                     :class="['message', msg.role === 'user' ? 'user' : 'assistant']">
                    <div class="message-content">
                        <div class="message-text">{{ msg.content }}</div>
                        <div class="message-time">{{ msg.timestamp }}</div>
                    </div>
                </div>
                <div v-if="loading" class="message assistant">
                    <div class="message-content">
                        <div class="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="chat-input">
                <el-input
                    v-model="newMessage"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入消息，按Enter发送，Shift+Enter换行"
                    :disabled="loading"
                    @keydown="handleKeyPress"
                />
                <el-button 
                    type="primary" 
                    :loading="loading"
                    @click="sendMessage">发送</el-button>
            </div>
        </div>
    `
};

// 创建 Vue 应用并挂载
const app = createApp(ChatBot);
app.use(ElementPlus);
app.mount('#chat-app'); 