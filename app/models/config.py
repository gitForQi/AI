from dataclasses import dataclass, field
from typing import List, Dict

@dataclass
class ModelConfig:
    name: str
    value: str
    max_tokens: int
    temperature: float
    description: str = ""

@dataclass
class SystemConfig:
    api_key: str = ""
    base_url: str = "https://api.openai.com/v1"
    api_proxy: str = ""
    model_name: str = "gpt-3.5-turbo"
    temperature: float = 0.7
    max_tokens: int = 4096
    auto_save_interval: int = 300  # 5分钟
    theme: str = "light"
    language: str = "zh-CN"
    models: List[Dict] = field(default_factory=lambda: [
        {
            "name": "GPT-3.5",
            "value": "gpt-3.5-turbo",
            "max_tokens": 4096,
            "temperature": 0.7,
            "description": "适用于大多数写作任务"
        },
        {
            "name": "GPT-4",
            "value": "gpt-4",
            "max_tokens": 8192,
            "temperature": 0.7,
            "description": "更强大的写作能力"
        }
    ]) 