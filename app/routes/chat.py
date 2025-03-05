from flask import Blueprint, jsonify, request
from app.services.chat_service import ChatService
from app.models.chat import ChatMessage, ChatHistory

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/api/chat/history', methods=['GET'])
def get_history():
    """获取聊天历史"""
    history = ChatService.load_history()
    return jsonify({
        "code": 200,
        "data": [msg.__dict__ for msg in history.messages],
        "message": "获取历史成功"
    })

@chat_bp.route('/api/chat/history', methods=['DELETE'])
def clear_history():
    """清空聊天历史"""
    ChatService.save_history(ChatHistory())
    return jsonify({
        "code": 200,
        "message": "清空历史成功"
    })

@chat_bp.route('/api/chat/send', methods=['POST'])
def send_message():
    """发送消息"""
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({
                "code": 400,
                "message": "消息不能为空"
            }), 400
        
        # 保存用户消息
        user_message = ChatMessage(role="user", content=message)
        ChatService.add_message(user_message)
        
        # 获取AI响应
        ai_response = ChatService.get_ai_response(message)
        
        # 保存AI响应
        ai_message = ChatMessage(role="assistant", content=ai_response)
        ChatService.add_message(ai_message)
        
        return jsonify({
            "code": 200,
            "data": ai_message.__dict__,
            "message": "发送成功"
        })
    except Exception as e:
        return jsonify({
            "code": 500,
            "message": f"发送失败: {str(e)}"
        }), 500 