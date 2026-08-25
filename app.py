import os
from dotenv import load_dotenv

# Importa o Flask, renderização, requisições, redirecionamento
from flask import Flask, render_template, request, redirect

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

# Inicializa o servidor web da aplicação Flask
app = Flask(__name__)

# Configura a chave secreta a partir da variável no arquivo .env
app.secret_key = os.getenv("CHAVE_SECRETA_FLASK")

# Lista global para armazenar os dicionários dos cadastros
lista_de_cadastros = []

# ROTA 1: Página Inicial (Home)
@app.route("/")
def home():
    busca = request.args.get("busca", "").strip().lower()

    if busca:
        registro_filtrados = [
            item for item in lista_de_cadastros if busca in item.get("usuario", "").lower()
        ]
    else:
        registro_filtrados = lista_de_cadastros

    # Cálculo dos indicadores
    total_registro = len(lista_de_cadastros)
    total_concluidos = sum(1 for item in lista_de_cadastros if item.get("status") == "Concluído")
    total_pendentes = sum(1 for item in lista_de_cadastros if item.get("status") == "Pendente")

    return render_template(
        "index.html",
        cadastro=registro_filtrados,
        total=total_registro,
        concluidos=total_concluidos,
        pendentes=total_pendentes,
        busca=busca
    )

# ROTA 2: Exibição da Tela de Cadastro (Método GET)
@app.route("/cadastro")
def pagina_cadastro():
    return render_template("cadastro.html")

# ROTA 3: Processamento dos Dados do Formulário (Método POST)
@app.route("/salvar", methods=["POST"])
def salvar_cadastro():
    usuario = request.form.get("campo_usuario", "").strip()
    senha   = request.form.get("campo_senha", "").strip()
    cnpj    = request.form.get("campo_cnpj", "").strip()
    cep     = request.form.get("campo_cep", "").strip()

    # Validação dos campos obrigatórios
    if not usuario or not senha:
        return "<h3>Erro 400: Preencha todos os campos obrigatórios (usuário e senha) do formulário</h3><br><a href='/cadastro'>Voltar ao formulário</a>", 400

    # Estrutura do registro salvo na lista
    novo_registro = {
        "usuario": usuario,
        "senha": senha,
        "cnpj": cnpj,
        "cep": cep,
        "valor": 0.0,  # Mantido para evitar erros no cálculo de faturamento na home
        "status": "Pendente"
    }

    lista_de_cadastros.append(novo_registro)
    return redirect("/")

# ROTA 4: Alterar Status
@app.route("/mudar-status/<int:indice>")
def mudar_status(indice):
    if 0 <= indice < len(lista_de_cadastros):
        if lista_de_cadastros[indice]["status"] == "Pendente":
            lista_de_cadastros[indice]["status"] = "Concluído"
        else:
            lista_de_cadastros[indice]["status"] = "Pendente"

    return redirect("/")

# ROTA 5: Excluir registro
@app.route("/excluir/<int:indice>")
def excluir_cadastro(indice):
    if 0 <= indice < len(lista_de_cadastros):
        lista_de_cadastros.pop(indice)
    return redirect("/")

if __name__ == "__main__":
    app.run(debug=True)
