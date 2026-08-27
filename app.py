from flask import Flask, render_template, request, redirect, session
import os

app = Flask(__name__)
# Chave secreta necessária para usar a sessão (session)
app.secret_key = "sua_chave_secreta_aqui"

# Lista global para armazenar os cadastros completos
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

# ROTA 2: ETAPA 1 - Exibir Tela de Cadastro (Usuário, Senha, CNPJ, CEP)
@app.route("/cadastro")
def pagina_cadastro():
    return render_template("cadastro.html")

# ROTA 3: ETAPA 1 - Salvar dados iniciais e REDIRECIONAR para Contato
@app.route("/salvar", methods=["POST"])
def salvar_cadastro():
    usuario = request.form.get("campo_usuario", "").strip()
    senha   = request.form.get("campo_senha", "").strip()
    cnpj    = request.form.get("campo_cnpj", "").strip()
    cep     = request.form.get("campo_cep", "").strip()

    if not usuario or not senha:
        return "<h3>Erro 400: Preencha todos os campos obrigatórios (usuário e senha)</h3><br><a href='/cadastro'>Voltar</a>", 400

    # Guarda os dados da 1ª etapa temporariamente na sessão
    session['dados_temp'] = {
        "usuario": usuario,
        "senha": senha,
        "cnpj": cnpj,
        "cep": cep
    }

    # Redireciona diretamente para a tela de contato
    return redirect("/contato")

# ROTA 4: ETAPA 2 - Exibir Tela de Contato
@app.route("/contato")
def pagina_contato():
    # Se o usuário tentar acessar direto sem passar da etapa 1, manda de volta pro cadastro
    if 'dados_temp' not in session:
        return redirect("/cadastro")
    return render_template("contato.html")

# ROTA 5: ETAPA 2 - Salvar Contato e Finalizar o Registro Completo
@app.route("/salvar-contato", methods=["POST"])
def salvar_contato():
    if 'dados_temp' not in session:
        return redirect("/cadastro")

    telefone = request.form.get("campo_telefone", "").strip()
    email    = request.form.get("campo_email", "").strip()

    # Recupera os dados guardados na sessão
    dados_iniciais = session.pop('dados_temp', None)

    # Junta tudo em um único objeto de cadastro
    novo_registro = {
        "usuario": dados_iniciais["usuario"],
        "senha": dados_iniciais["senha"],
        "cnpj": dados_iniciais["cnpj"],
        "cep": dados_iniciais["cep"],
        "telefone": telefone,
        "email": email,
        "valor": 0.0,
        "status": "Pendente"
    }

    # Salva na lista principal
    lista_de_cadastros.append(novo_registro)

    # Retorna para a home com o cadastro concluído
    return redirect("/")

# ROTA 6: Alterar Status
@app.route("/mudar-status/<int:indice>")
def mudar_status(indice):
    if 0 <= indice < len(lista_de_cadastros):
        if lista_de_cadastros[indice]["status"] == "Pendente":
            lista_de_cadastros[indice]["status"] = "Concluído"
        else:
            lista_de_cadastros[indice]["status"] = "Pendente"
    return redirect("/")

# ROTA 7: Excluir registro
@app.route("/excluir/<int:indice>")
def excluir_cadastro(indice):
    if 0 <= indice < len(lista_de_cadastros):
        lista_de_cadastros.pop(indice)
    return redirect("/")

if __name__ == "__main__":
    app.run(debug=True)