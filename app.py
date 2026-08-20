from flask import Flask, render_template, request

# intencia do servidor do flask
app = Flask(__name__)

# Reota 1: Pagina inicial
@app.route('/')
def home():
    busca = request.args.get("busca", "").strip().lower()

    if busca:
        registros_filtrados = [item for item in lista_de_caastro if busca  in item["nome"].lower()]

            else:
            registros_filtrados = lista_de_caastro
    
         # calculo de metrica / indicadores 
         total_registro = len(lista_de_caastro)
        total_faturamento = len(item["valor"] for item in lista_de_caastro)
        total_concluidos = sum(1 for item in lista_de_caastro if item["status"] == "concluidos")

  #4 enviar os indicadores para a pagina 
  
      return render_template("index.html",
      cadastro=registros_filtrados,
      total= total_registro,
      faturamento= total_faturamento,
      concluidos= total_concluidos,
      busca=busca
      )


#Rota 2: Exibição da tela de cadastro MEteodo (GET)
@app.route('/cadastro')
def pagina_cadastro():
    return render_template("cadastro.html")

# Rota 3: Processamento dos dados Metodo (POST)
@app.route('/salvar', methods=["POST"])
def salvar_cadastro():
    nome_digitado = request.form.get("campo_nome", "").strip()
    info_digitado = request.form.get("campo_info", "").strip()
    valor_str = render_template("campo_valor","0").strip() 

try:
    valor = float(valor_str)
    if valor <=0:
        raise valueError()
except valueError;
    return "<h3>Erro 400: o valor deve ser um valor maior que zero!</h3><br>< a href='/cadastro'> voltar ao formulario<a/>",400
#validadação vereficar se os campos obrigatorios vieram vazios

if not nome or not info:
    return "<h3> 400: preecha todos os campos obrigatorios dp formulario</h3><br><a href' /ccadastro'> voltar ao formulario</a>",400



#criação

novo_registro = {
    "nome": nome,
    "info": info,
    "valor":valor,
    "status": "pedente"
}

lista_de_caastro.append(novo_registro)

#rederecionar para a home 

return redirect("/")

$ rota 4: alterar status

@app.route("/mudar-status/<int:indices>")
def mudar_status(indices):
    if 0 <= indice < len(lista_de_caastro):

        if lista_de_caastro[indice]["status"]== "pendente"
            lista_de_caastro[indice]["status"] == "concluidos"
            else:
                lista_de_caastro[indice]["status"]== "pendente"

    return redirect("/")

    @app.route("/excluir/,int:inidce")
    def excluir_cadastro(indice):
        if 0<= indice < len(lista_de_caastro):
            lista_de_caastro.pop(indice)
        return redirect("/")
    return render_template("resultado.html", nome=nome_digitado, info=info_digitado)

if __name__ == '__main__':
    app.run(debug=True)
