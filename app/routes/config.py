from flask import Blueprint, jsonify, request
from app.services.config_service import ConfigService

config_bp = Blueprint('config', __name__)

@config_bp.route('/api/config', methods=['GET'])
def get_config():
    """获取系统配置"""
    config = ConfigService.load_config()
    return jsonify({
        "code": 200,
        "data": config.__dict__,
        "message": "获取配置成功"
    })

@config_bp.route('/api/config', methods=['PUT'])
def update_config():
    """更新系统配置"""
    try:
        config_data = request.get_json()
        updated_config = ConfigService.update_config(config_data)
        return jsonify({
            "code": 200,
            "data": updated_config.__dict__,
            "message": "更新配置成功"
        })
    except Exception as e:
        return jsonify({
            "code": 500,
            "message": f"更新配置失败: {str(e)}"
        }), 500 