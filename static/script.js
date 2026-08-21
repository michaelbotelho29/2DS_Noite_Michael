document.addEventListener("DOMContentLoaded", () => {
    // 1. EFEITO DE DIGITAÇÃO CYBERPUNK (TYPING EFFECT)
    const titulosEfeito = document.querySelectorAll("h1, h2");
    titulosEfeito.forEach(titulo => {
        const textoOriginal = titulo.textContent;
        titulo.textContent = "";
        let i = 0;
        
        function digitar() {
            if (i < textoOriginal.length) {
                titulo.textContent += textoOriginal.charAt(i);
                i++;
                setTimeout(digitar, 50);
            }
        }
        digitar();
    });

    // 2. ENTRADA ANIMADA DOS CARDS E TABELA (FADE-IN SUCESSIVO)
    const cards = document.querySelectorAll(".card");
    cards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "all 0.5s ease";
        
        setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, index * 150); // Efeito cascata
    });

    const linhasTabela = document.querySelectorAll("tbody tr");
    linhasTabela.forEach((linha, index) => {
        linha.style.opacity = "0";
        linha.style.transform = "translateX(-10px)";
        linha.style.transition = "all 0.3s ease";
        
        setTimeout(() => {
            linha.style.opacity = "1";
            linha.style.transform = "translateX(0)";
        }, index * 80);
    });

    // 3. INTERAÇÃO E VALIDAÇÃO NOS INPUTS DOS FORMULÁRIOS
    const inputs = document.querySelectorAll("form input");
    inputs.forEach(input => {
        // Quando o usuário clica no campo
        input.addEventListener("focus", () => {
            input.parentElement.querySelector("label")?.style.setProperty("color", "#00e5ff");
        });

        // Quando o usuário sai do campo
        input.addEventListener("blur", () => {
            if (input.value.trim() === "") {
                input.style.borderColor = "#ff4a5a"; // Borda vermelha se estiver vazio e for obrigatório
                input.parentElement.querySelector("label")?.style.setProperty("color", "#ff4a5a");
            } else {
                input.style.borderColor = "#00e593"; // Borda verde se estiver preenchido
                input.parentElement.querySelector("label")?.style.setProperty("color", "#8f9cae");
            }
        });
    });

    // 4. MÁSCARA EM TEMPO REAL PARA O CAMPO DE VALOR (DINHEIRO)
    const inputValor = document.querySelector('input[name="campo_valor"]');
    if (inputValor) {
        inputValor.addEventListener("input", (e) => {
            // Garante que o usuário veja o feedback visual mudando de cor se o valor for válido
            if (parseFloat(e.target.value) > 0) {
                e.target.style.boxShadow = "0 0 10px rgba(0, 229, 147, 0.2)";
                e.target.style.borderColor = "#00e593";
            }
        });
    }

    // 5. CONFIRMAÇÃO DE EXCLUSÃO ESTILIZADA (SUBSTITUI O CONFIRM PREFEITO DO NAVEGADOR)
    const botoesExcluir = document.querySelectorAll(".btn-charge, .btn-danger");
    botoesExcluir.forEach(botao => {
        // Remove o onclick antigo do HTML para usarmos o nosso moderno via JS
        botao.removeAttribute("onclick");
        
        botao.addEventListener("click", (e) => {
            e.preventDefault(); // Impede o clique imediato
            const urlDestino = botao.getAttribute("href");

            // Cria um alerta modal cyberpunk dinâmico na tela
            const modal = document.createElement("div");
            modal.style.position = "fixed";
            modal.style.top = "0";
            modal.style.left = "0";
            modal.style.width = "100vw";
            modal.style.height = "100vh";
            modal.style.backgroundColor = "rgba(11, 15, 25, 0.9)";
            modal.style.display = "flex";
            modal.style.justifyContent = "center";
            modal.style.alignItems = "center";
            modal.style.zIndex = "9999";
            modal.style.opacity = "0";
            modal.style.transition = "opacity 0.3s ease";

            modal.innerHTML = `
                <div style="background: #121826; padding: 30px; border-radius: 12px; border: 1px solid #ff4a5a; text-align: center; box-shadow: 0 0 20px rgba(255, 74, 90, 0.2); max-width: 400px; width: 90%;">
                    <h3 style="color: #ff4a5a; margin-bottom: 15px; font-size: 20px;">[ALERTA DE SISTEMA]</h3>
                    <p style="color: #c3cadb; margin-bottom: 25px;">Tem certeza que deseja deletar este registro de forma permanente?</p>
                    <button id="cancelar-delete" style="background: #26334d; color: #ffffff; padding: 10px 20px; border: none; border-radius: 6px; margin-right: 10px; cursor: pointer; font-weight: bold;">CANCELAR</button>
                    <button id="confirmar-delete" style="background: #ff4a5a; color: #ffffff; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 10px rgba(255, 74, 90, 0.3);">DELETAR</button>
                </div>
            `;

            document.body.appendChild(modal);
            setTimeout(() => modal.style.opacity = "1", 10);

            // Ações do modal
            modal.querySelector("#cancelar-delete").addEventListener("click", () => {
                modal.style.opacity = "0";
                setTimeout(() => modal.remove(), 300);
            });

            modal.querySelector("#confirmar-delete").addEventListener("click", () => {
                // Efeito visual de sumir com a linha antes de mudar de página
                const linha = botao.closest("tr");
                if (linha) {
                    linha.style.transform = "scale(0.8)";
                    linha.style.opacity = "0";
                    linha.style.transition = "all 0.3s ease";
                }
                setTimeout(() => {
                    window.location.href = urlDestino;
                }, 300);
            });
        });
    });
});

// ===================================================
// EFEITOS PARA A PARTE DE FORA (AO REDOR DO CONTAINER)
// ===================================================

// 1. CRIA O FUNDO DE PARTÍCULAS E A BARRA DE PROGRESSO NO TOPO
const estiloExterno = document.createElement("style");
estiloExterno.textContent = `
    /* Barra de leitura tecnológica no topo */
    .cyber-progress-bar {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #00e5ff, #7209b7);
        width: 0%;
        z-index: 10000;
        box-shadow: 0 0 10px #00e5ff;
        transition: width 0.1s ease-out;
    }
    /* Tela de fundo para as partículas não atrapalharem o clique */
    #cyber-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -1;
        pointer-events: none;
        opacity: 0.15;
    }
`;
document.head.appendChild(estiloExterno);

// Cria o elemento da barra no topo
const progressBar = document.createElement("div");
progressBar.className = "cyber-progress-bar";
document.body.appendChild(progressBar);

// Atualiza a barra conforme o usuário rola a página
window.addEventListener("scroll", () => {
    const pixelsRolados = window.scrollY;
    const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
    const porcentagem = alturaTotal > 0 ? (pixelsRolados / alturaTotal) * 100 : 0;
    progressBar.style.width = porcentagem + "%";
});

// 2. SISTEMA DE PARTÍCULAS DIGITAIS NO FUNDO DA TELA (CANVAS)
const canvas = document.createElement("canvas");
canvas.id = "cyber-bg";
document.body.insertBefore(canvas, document.body.firstChild);

const ctx = canvas.getContext("2d");

function redimensionarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
redimensionarCanvas();
window.addEventListener("resize", redimensionarCanvas);

// Configuração das bolinhas/partículas neon
const particulas = [];
const numeroParticulas = 40;

for (let i = 0; i < numeroParticulas; i++) {
    particulas.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        raio: Math.random() * 2 + 1,
        velocidadeX: (Math.random() - 0.5) * 0.5,
        velocidadeY: (Math.random() - 0.5) * 0.5,
        cor: Math.random() > 0.5 ? "#00e5ff" : "#7209b7"
    });
}

function animarFundo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particulas.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.raio, 0, Math.PI * 2);
        ctx.fillStyle = p.cor;
        ctx.fill();
        
        // Move as partículas devagar
        p.x += p.velocidadeX;
        p.y += p.velocidadeY;
        
        // Rebate nas bordas da tela externa
        if (p.x < 0 || p.x > canvas.width) p.velocidadeX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.velocidadeY *= -1;
    });
    
    requestAnimationFrame(animarFundo);
}
animarFundo();

// ===================================================
// ULTRA HIGHLIGHT: EFEITOS EXTERNOS ALTA VISIBILIDADE
// ===================================================

// 1. ATUALIZA OS ESTILOS DA BARRA E DO CANVAS PARA MAIOR DESTAQUE
const estiloUltraVisivel = document.createElement("style");
estiloUltraVisivel.textContent = `
    /* Barra de progresso ultra neon e mais grossa */
    .cyber-progress-bar {
        position: fixed;
        top: 0;
        left: 0;
        height: 5px; /* Mais grossa para destacar */
        background: linear-gradient(90deg, #00e5ff, #7209b7, #00e5ff);
        width: 0%;
        z-index: 10000;
        box-shadow: 0 0 15px #00e5ff, 0 0 30px #7209b7; /* Brilho duplo */
        transition: width 0.1s ease-out;
    }
    /* Canvas de fundo bem mais visível */
    #cyber-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -1;
        pointer-events: none;
        opacity: 0.45; /* Opacidade aumentada de 0.15 para 0.45 */
    }
`;
document.head.appendChild(estiloUltraVisivel);

// Se a barra anterior já existia, atualiza. Se não, cria uma nova.
let pBar = document.querySelector(".cyber-progress-bar");
if (!pBar) {
    pBar = document.createElement("div");
    pBar.className = "cyber-progress-bar";
    document.body.appendChild(pBar);
}

window.addEventListener("scroll", () => {
    const pixelsRolados = window.scrollY;
    const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
    const porcentagem = alturaTotal > 0 ? (pixelsRolados / alturaTotal) * 100 : 0;
    pBar.style.width = porcentagem + "%";
});

// INSTANCIA OU REUTILIZA O CANVAS PARA A REDE DE DADOS REFORÇADA
let canvasVisivel = document.getElementById("cyber-bg");
if (!canvasVisivel) {
    canvasVisivel = document.createElement("canvas");
    canvasVisivel.id = "cyber-bg";
    document.body.insertBefore(canvasVisivel, document.body.firstChild);
}

const ctxVisivel = canvasVisivel.getContext("2d");

function ajustarCanvasVisivel() {
    canvasVisivel.width = window.innerWidth;
    canvasVisivel.height = window.innerHeight;
}
ajustarCanvasVisivel();
window.addEventListener("resize", ajustarCanvasVisivel);

// Configuração de partículas maiores e mais rápidas
const nósRede = [];
const totalNós = 45;

for (let i = 0; i < totalNós; i++) {
    nósRede.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        raio: Math.random() * 3 + 2, // Partículas maiores (2px a 5px)
        velX: (Math.random() - 0.5) * 0.8, // Velocidade levemente aumentada
        velY: (Math.random() - 0.5) * 0.8,
        cor: Math.random() > 0.4 ? "#00e5ff" : "#7209b7"
    });
}

// Função que desenha as linhas conectando os pontos ao redor do container
function desenharRedeExterna() {
    ctxVisivel.clearRect(0, 0, canvasVisivel.width, canvasVisivel.height);
    
    // Desenha as conexões primeiro
    for (let i = 0; i < nósRede.length; i++) {
        for (let j = i + 1; j < nósRede.length; j++) {
            const dist = Math.hypot(nósRede[i].x - nósRede[j].x, nósRede[i].y - nósRede[j].y);
            
            // Se os pontos estiverem próximos, desenha uma linha brilhante entre eles
            if (dist < 130) {
                ctxVisivel.beginPath();
                ctxVisivel.moveTo(nósRede[i].x, nósRede[i].y);
                ctxVisivel.lineTo(nósRede[j].x, nósRede[j].y);
                ctxVisivel.strokeStyle = `rgba(0, 229, 255, ${1 - dist / 130})`;
                ctxVisivel.lineWidth = 0.8;
                ctxVisivel.stroke();
            }
        }
    }

    // Desenha as partículas por cima
    nósRede.forEach(nó => {
        ctxVisivel.beginPath();
        ctxVisivel.arc(nó.x, nó.y, nó.raio, 0, Math.PI * 2);
        ctxVisivel.fillStyle = nó.cor;
        // Adiciona um efeito de glow individual em cada bola externa
        ctxVisivel.shadowBlur = 8;
        ctxVisivel.shadowColor = nó.cor;
        ctxVisivel.fill();
        
        // Reseta o shadow blur para não travar a renderização das linhas
        ctxVisivel.shadowBlur = 0;

        // Atualiza movimentação pelas bordas externas
        nó.x += nó.velX;
        nó.y += nó.velY;
        
        if (nó.x < 0 || nó.x > canvasVisivel.width) nó.velX *= -1;
        if (nó.y < 0 || nó.y > canvasVisivel.width) nó.velY *= -1;
    });
    
    requestAnimationFrame(desenharRedeExterna);
}
desenharRedeExterna();


// ===================================================
// INJEÇÃO DE ELEMENTO RECOMENDADO: TERMINAL DE LOGS VIVO
// ===================================================

// 1. Injeta o CSS do terminal direto para manter o style.css limpo
const estiloTerminal = document.createElement("style");
estiloTerminal.textContent = `
    .terminal-logs {
        background: #070a12;
        border: 1px solid #1f293d;
        border-top: 2px solid #00e5ff;
        border-radius: 6px;
        margin-top: 25px;
        font-family: 'Courier New', Courier, monospace;
        box-shadow: 0 4px 15px rgba(0,0,0,0.4);
        overflow: hidden;
    }
    .terminal-topo {
        background: #121826;
        padding: 8px 12px;
        display: flex;
        align-items: center;
        gap: 6px;
        border-bottom: 1px solid #1f293d;
    }
    .circulo {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
    }
    .vermelho { background: #ff4a5a; }
    .amarelo { background: #ffb800; }
    .verde { background: #00e593; }
    .terminal-titulo {
        color: #6c7d93;
        font-size: 11px;
        margin: 0 0 0 10px !important;
        font-weight: bold;
        letter-spacing: 1px;
    }
    .terminal-conteudo {
        padding: 15px;
        height: 110px;
        overflow-y: auto;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .log-linha {
        margin: 0 !important;
        color: #00e593; /* Verde matrix clássico */
        opacity: 0;
        transform: translateY(5px);
        animation: entrarLog 0.2s forwards;
    }
    .log-info { color: #00e5ff; }
    .log-aviso { color: #ffb800; }
    @keyframes entrarLog {
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(estiloTerminal);

// 2. Lógica para simular mensagens reais do servidor CornTeam
const logTextoContainer = document.getElementById("log-texto");

if (logTextoContainer) {
    const mensagensPossiveis = [
        { texto: "[INFO] Sincronizando banco de dados SQL...", classe: "log-info" },
        { texto: "[OK] Conexão criptografada estabelecida.", classe: "log-linha" },
        { texto: "[AVISO] Verificando requisições pendentes...", classe: "log-aviso" },
        { texto: "[INFO] Memória do servidor: 14% de uso.", classe: "log-info" },
        { texto: "[OK] Cache de métricas limpo com sucesso.", classe: "log-linha" },
        { texto: "[INFO] Projeto CornTeam rodando de forma estável.", classe: "log-info" }
    ];

    setInterval(() => {
        // Seleciona uma mensagem aleatória
        const msgAleatoria = mensagensPossiveis[Math.floor(Math.random() * mensagensPossiveis.length)];
        
        // Cria o novo parágrafo de log
        const novaLinha = document.createElement("p");
        novaLinha.className = `log-linha ${msgAleatoria.classe}`;
        
        // Pega o horário atual para ficar realista
        const agora = new Date();
        const horaFormatada = agora.toTimeString().split(' ')[0];
        
        novaLinha.textContent = `[${horaFormatada}] ${msgAleatoria.texto}`;
        
        logTextoContainer.appendChild(novaLinha);
        
        // Auto-scroll para acompanhar o último log inserido
        logTextoContainer.scrollTop = logTextoContainer.scrollHeight;
        
        // Mantém apenas os últimos 20 logs para não travar a memória do navegador
        if (logTextoContainer.children.length > 20) {
            logTextoContainer.children[0].remove();
        }
    }, 4000); // Adiciona um log a cada 4 segundos
}


