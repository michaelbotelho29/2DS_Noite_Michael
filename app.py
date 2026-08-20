# Importa o Flask, renderização, requisições, redirecionamento
from flask import Flask, render_template, request, redirect
 
# Inicializa o servidor web da aplicação Flask
app = Flask(__name__)
 
# Lista global para armazenar os dicionários dos cadastros
lista_de_cadastros = []
 
# ROTA 1: Página Inicial (Home)
@app.route("/")
def home():
    # 1. Capturar termo digitado no campo busca GET
    busca = request.args.get("busca", "").strip().lower()
 
    # 2. Filtra a lista se houver busca digitada
    if busca:
        registro_filtrados = [item for item in lista_de_cadastros if busca in item["nome"].lower()]
    else:
        registro_filtrados = lista_de_cadastros
 
    # 3. Cálculo de métrica / indicadores
    total_registro = len(lista_de_cadastros)  # Corrigido o typo de 'regitro'
    total_faturamento = sum(item["valor"] for item in lista_de_cadastros)
    total_concluidos = sum(1 for item in lista_de_cadastros if item["status"] == "Concluído")
 
    # 4. Enviar os indicadores para a página index.html
    return render_template(
        "index.html",
        cadastro=registro_filtrados,
        total=total_registro,
        faturamento=total_faturamento,
        concluidos=total_concluidos,
        busca=busca
    )
 
# ROTA 2: Exibição da Tela de Cadastro (Método GET)
@app.route("/cadastro")
def pagina_cadastro():
    return render_template("cadastro.html")
 
# ROTA 3: Processamento dos Dados do Formulário (Método POST)
@app.route("/salvar", methods=["POST"])
def salvar_cadastro():
    # Captura os dados enviados pelo formulário
    nome = request.form.get("campo_nome", "").strip() # Ajustado para 'nome'
    info = request.form.get("campo_info", "").strip() # Ajustado para 'info'
    valor_str = request.form.get("campo_valor", "0").strip()
 
    # Validação 1: Tratar conversão de valor numérico
    try: 
        valor = float(valor_str)
        if valor <= 0:
            raise ValueError()
    except ValueError:
        return "<h3>Erro 400: O valor deve ser maior que zero!</h3><br><a href='/cadastro'>Voltar ao formulário</a>", 400
 
    # Validação 2: Verificar se os campos obrigatórios vieram vazios
    if not nome or not info:
        return "<h3>Erro 400: Preencha todos os campos obrigatórios do formulário</h3><br><a href='/cadastro'>Voltar ao formulário</a>", 400
 
    # Criação da estrutura de dados 
    novo_registro = {
        "nome": nome,
        "info": info,
        "valor": valor,
        "status": "Pendente"  # Status sempre inicia como pendente
    }
 
    lista_de_cadastros.append(novo_registro)
    # Redirecionar para a home
    return redirect("/")
 
# ROTA 4: Alterar Status
@app.route("/mudar-status/<int:indice>")
def mudar_status(indice):
    if 0 <= indice < len(lista_de_cadastros):
        # Alterar o status entre "Pendente" e "Concluído" (Usando '=' e não '==')
        if lista_de_cadastros[indice]["status"] == "Pendente":
            lista_de_cadastros[indice]["status"] = "Concluído"
        else:
            lista_de_cadastros[indice]["status"] = "Pendente"
 
    return redirect("/")
 
# ROTA 5: Excluir registro
@app.route("/excluir/<int:indice>")  # Corrigido 'inidce' para 'indice'
def excluir_cadastro(indice):
    if 0 <= indice < len(lista_de_cadastros):
        lista_de_cadastros.pop(indice)
    return redirect("/")
# Garante que o servidor só inicialize se este arquivo for executado diretamente
if __name__ == "__main__":
    app.run(debug=True)