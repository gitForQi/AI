import json
import os
from typing import List
from app.models.chat import ChatMessage, ChatHistory
from app.services.config_service import ConfigService
from openai import OpenAI

class ChatService:
    HISTORY_FILE = "config/chat_history.json"
    
    @classmethod
    def ensure_history_file(cls):
        os.makedirs(os.path.dirname(cls.HISTORY_FILE), exist_ok=True)
        if not os.path.exists(cls.HISTORY_FILE):
            with open(cls.HISTORY_FILE, 'w', encoding='utf-8') as f:
                json.dump({"messages": []}, f)

    @classmethod
    def load_history(cls) -> ChatHistory:
        cls.ensure_history_file()
        try:
            with open(cls.HISTORY_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                messages = [ChatMessage(**msg) for msg in data["messages"]]
                return ChatHistory(messages=messages)
        except Exception as e:
            print(f"加载聊天历史失败: {e}")
            return ChatHistory()

    @classmethod
    def save_history(cls, history: ChatHistory):
        cls.ensure_history_file()
        try:
            with open(cls.HISTORY_FILE, 'w', encoding='utf-8') as f:
                json.dump({"messages": [msg.__dict__ for msg in history.messages]}, f, 
                         ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"保存聊天历史失败: {e}")

    @classmethod
    def add_message(cls, message: ChatMessage) -> ChatHistory:
        history = cls.load_history()
        history.messages.append(message)
        cls.save_history(history)
        return history

    @classmethod
    def get_ai_response(cls, message: str) -> str:
        config = ConfigService.load_config()
        
        # 创建OpenAI客户端
        client = OpenAI(
            api_key=config.api_key,
            base_url=config.base_url
        )
        
        try:
            # 获取历史消息
            history = cls.load_history()
            messages = [{"role": msg.role, "content": msg.content} 
                       for msg in history.messages[-5:]]  # 只使用最近5条消息作为上下文
            messages.append({"role": "user", "content": message})
            
            # 调用API
            response = client.chat.completions.create(
                model=config.model_name,
                messages=messages,
                temperature=config.temperature,
                max_tokens=config.max_tokens
            )
            
            return response.choices[0].message.content
        except Exception as e:
            print(f"获取AI响应失败: {e}")
            return f"抱歉，发生错误：{str(e)}" 