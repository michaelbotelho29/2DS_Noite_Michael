import os
from flask import Flask
from database import db
from routes import main_bp

app = Flask(__name__)

# Configuração da Chave Secreta
app.secret_key = "sua_chave_secreta_aqui"

# Configuração do Banco de Dados SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///banco.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicialização da extensão do banco de dados na aplicação
db.init_app(app)

# Registro do Blueprint com as rotas do projeto
app.register_blueprint(main_bp)

# Criação automática das tabelas SQLite no banco de dados
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)