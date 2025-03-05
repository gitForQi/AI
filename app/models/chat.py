from dataclasses import dataclass
from datetime import datetime
from typing import List

@dataclass
class ChatMessage:
    role: str  # 'user' 或 'assistant'
    content: str
    timestamp: str = ""

    def __post_init__(self):
        if not self.timestamp:
            self.timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

@dataclass
class ChatHistory:
    messages: List[ChatMessage] = None
    
    def __post_init__(self):
        if self.messages is None:
            self.messages = [] 