from flask import Blueprint, render_template, request, redirect, session
from database import db
from models import Registro

main_bp = Blueprint('main', __name__)

@main_bp.route("/")
def home():
    busca = request.args.get("busca", "").strip()

    if busca:
        registros = Registro.query.filter(Registro.nome.ilike(f"%{busca}%")).all()
    else:
        registros = Registro.query.all()

    total_registros = len(registros)    
    concluidos = sum(1 for item in registros if item.status == "Concluído")
    pendentes = sum(1 for item in registros if item.status == "Pendente")

    return render_template(
        "index.html",
        cadastro=registros,     # Nome mantido como 'cadastro' para bater com o template
        total=total_registros,
        concluidos=concluidos,
        pendentes=pendentes,
        busca=busca
    )

@main_bp.route("/cadastro")
def pagina_cadastros():
    return render_template("cadastro.html")

@main_bp.route("/salvar", methods=["POST"])
def salvar_cadastro():
    usuario = request.form.get("campo_usuario", "").strip()
    senha   = request.form.get("campo_senha", "").strip()
    cnpj    = request.form.get("campo_cnpj", "").strip()
    cep     = request.form.get("campo_cep", "").strip()

    if not usuario or not senha:
        return "<h3>Erro 400: Preencha usuário e senha</h3><a href='/cadastro'>Voltar</a>", 400

    session['dados_temp'] = {
        "usuario": usuario,
        "senha": senha,
        "cnpj": cnpj,
        "cep": cep
    }

    return redirect("/contato")

@main_bp.route("/contato")
def pagina_contato():
    if 'dados_temp' not in session:
        return redirect("/cadastro")
    return render_template("contato.html")

@main_bp.route("/salvar-contato", methods=["POST"])
def salvar_contato():
    if 'dados_temp' not in session:
        return redirect("/cadastro")

    telefone = request.form.get("campo_telefone", "").strip()
    email    = request.form.get("campo_email", "").strip()

    dados = session.pop('dados_temp', None)

    novo_registro = Registro(
        nome=dados["usuario"],
        info=f"CNPJ: {dados['cnpj']} | CEP: {dados['cep']} | Email: {email} | Tel: {telefone} | Senha: {dados['senha']}",
        valor=0.0
    )
    
    db.session.add(novo_registro)
    db.session.commit()

    return redirect("/")

@main_bp.route("/mudar-status/<int:id>")
def mudar_status(id):
    registro = Registro.query.get(id)
    if registro:
        registro.status = "Concluído" if registro.status == "Pendente" else "Pendente"
        db.session.commit()
    return redirect("/")

@main_bp.route("/excluir/<int:id>")
def excluir_cadastro(id):
    registro = Registro.query.get(id)
    if registro:
        db.session.delete(registro)
        db.session.commit()
    return redirect("/")