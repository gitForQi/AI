# AI小说写作助手

## 功能列表（左侧导航）

### 🤖 AI助手
- 智能对话
- 写作建议
- 情节规划
- 角色设计
- 场景构思

### ⚙️ 系统设置
- API设置
  - OpenAI API密钥
  - API Base地址
  - API代理设置
- 模型配置
  - 模型选择(GPT-3.5/GPT-4)
  - 温度参数调节
  - 最大令牌数
- 系统偏好
  - 自动保存间隔
  - 界面主题
  - 语言设置

### 📝 创作中心
- 项目管理
  - 新建项目
  - 打开项目
  - 导出项目
- 大纲管理
  - 创建大纲
  - 章节规划
  - 情节线索
- 章节写作
  - AI辅助创作
  - 实时编辑
  - 版本历史

### 👥 角色管理
- 角色列表
- 角色关系
- 性格设定
- 背景故事

### 🏞️ 场景管理
- 场景列表
- 场景描述
- 时间线
- 地理关系

### 📊 写作分析
- 情节分析
- 人物弧光
- 文风检测
- 矛盾冲突

### 📚 内容优化
- 文字润色
- 情节优化
- 细节补充
- 连贯性检查

## 技术架构

### 前端
- Vue.js 3.0
- Element Plus UI
- WebSocket实时通信

### 后端
- Python Flask
- OpenAI API集成
- WebSocket服务

### 数据存储
- 本地文件系统
- JSON配置文件
- 自动备份机制

## 项目结构
```python
ai_novel_assistant/
├── app/                    # 应用主目录
│   ├── __init__.py        
│   ├── routes/            # 路由模块
│   ├── models/            # 数据模型
│   ├── services/          # 业务逻辑
│   └── utils/             # 工具函数
├── static/                # 静态资源
├── templates/             # 模板文件
├── novels/               # 小说数据
├── config.py             # 配置文件
└── run.py               # 启动文件
```

## 快速开始

### 环境配置
```bash
# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

### 配置文件
```python
# config.py
class Config:
    SECRET_KEY = 'your-secret-key'
    OPENAI_API_KEY = 'your-api-key'
    OPENAI_API_BASE = 'https://api.openai.com/v1'
    AI_MODEL = 'gpt-3.5-turbo'
    MAX_TOKENS = 4096
    TEMPERATURE = 0.7
```

### 启动项目
```bash
export FLASK_APP=run.py
export FLASK_ENV=development
flask run
```

## API接口

### 系统设置
- GET  /api/config          # 获取配置
- PUT  /api/config          # 更新配置

### AI对话
- POST /api/chat           # 发送消息
- GET  /api/chat/history   # 获取历史

### 小说管理
- POST /api/novel          # 创建项目
- GET  /api/novel/:id      # 获取项目
- PUT  /api/novel/:id      # 更新项目

## 注意事项
- 定期备份数据
- 及时保存创作内容
- 合理设置AI参数

## 联系方式
- 问题反馈: [GitHub Issues]
- 功能建议: [Discussions]
- 技术支持: [Documentation]