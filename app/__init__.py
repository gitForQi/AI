from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    
    # 基础配置
    app.config['SECRET_KEY'] = 'your-secret-key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # 初始化数据库
    db.init_app(app)
    
    # 注册蓝图
    from app.routes.config import config_bp
    from app.routes.views import views_bp
    from app.routes.chat import chat_bp
    
    app.register_blueprint(config_bp)
    app.register_blueprint(views_bp)
    app.register_blueprint(chat_bp)
    
    # 创建数据库表
    with app.app_context():
        db.create_all()
    
    return app
