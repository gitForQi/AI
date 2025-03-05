from flask import Blueprint, render_template

views_bp = Blueprint('views', __name__)

@views_bp.route('/')
def index():
    """主页"""
    return render_template('index.html')

@views_bp.route('/settings')
def settings():
    """设置页面"""
    return render_template('config.html')

@views_bp.route('/chat')
def chat():
    """聊天页面"""
    return render_template('chat.html')

@views_bp.route('/outline')
def outline():
    """大纲生成页面"""
    return render_template('outline/generate.html') 