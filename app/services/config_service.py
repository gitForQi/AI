import json
import os
from app.models.config import SystemConfig

class ConfigService:
    CONFIG_FILE = "config/system_config.json"
    
    @classmethod
    def ensure_config_dir(cls):
        os.makedirs(os.path.dirname(cls.CONFIG_FILE), exist_ok=True)
    
    @classmethod
    def load_config(cls) -> SystemConfig:
        cls.ensure_config_dir()
        try:
            if os.path.exists(cls.CONFIG_FILE):
                with open(cls.CONFIG_FILE, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    return SystemConfig(**data)
        except Exception as e:
            print(f"加载配置文件失败: {e}")
        return SystemConfig()
    
    @classmethod
    def save_config(cls, config: SystemConfig) -> bool:
        cls.ensure_config_dir()
        try:
            with open(cls.CONFIG_FILE, 'w', encoding='utf-8') as f:
                json.dump(config.__dict__, f, ensure_ascii=False, indent=2)
            return True
        except Exception as e:
            print(f"保存配置文件失败: {e}")
            return False
    
    @classmethod
    def update_config(cls, config_data: dict) -> SystemConfig:
        current_config = cls.load_config()
        for key, value in config_data.items():
            if hasattr(current_config, key):
                setattr(current_config, key, value)
        cls.save_config(current_config)
        return current_config 