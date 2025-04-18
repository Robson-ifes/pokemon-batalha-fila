const fila = [];
const chefe = {
  nome: "CHARIZARD",
  imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
  tipo: "FOGO",
  vida: 100
};

// Variáveis globais para armazenar os danos
let danoChefe = 0;
let danoDesafiante = 0;

// Configuração das partículas
const particlesConfig = {
  "particles": {
    "number": {
      "value": 50,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffde00"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      }
    },
    "opacity": {
      "value": 0.5,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 4,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 2,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#ffde00",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 3,
      "direction": "none",
      "random": true,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": true,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      }
    },
    "modes": {
      "grab": {
        "distance": 140,
        "line_linked": {
          "opacity": 1
        }
      },
      "push": {
        "particles_nb": 4
      }
    }
  }
};

// Inicializar partículas
function initParticles() {
  particlesJS("particles-js", particlesConfig);
}

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar partículas
  initParticles();

  // Configurar eventos
  document.getElementById("batalhar").addEventListener("click", iniciarBatalha);
  document.getElementById("adicionar-desafiante").addEventListener("click", adicionarDesafiante);

  // Pré-carregar áudio
  const audio = document.getElementById("som-batalha");
  audio.volume = 0.5;
  audio.load();

  atualizarFila();
  atualizarRanking();
  atualizarBarraVida();
});

function atualizarBarraVida() {
  const healthBar = document.getElementById("chefe-health");
  healthBar.style.width = `${chefe.vida}%`;
  
  // Mudar cor conforme a vida
  if (chefe.vida <= 0) {
    healthBar.style.background = "#ff0000";
  } else if (chefe.vida < 20) {
    healthBar.style.background = "#ff0000";
  } else if (chefe.vida < 40) {
    healthBar.style.background = "linear-gradient(to right, #ff0000, #ff6600)";
  } else if (chefe.vida < 60) {
    healthBar.style.background = "linear-gradient(to right, #ff6600, #ffcc00)";
  } else {
    healthBar.style.background = "linear-gradient(to right, #00cc00, #00ff00)";
  }
}

async function adicionarDesafiante() {
  try {
    const id = Math.floor(Math.random() * 150) + 1;
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();

    const desafiante = {
      nome: data.name.toUpperCase(),
      imagem: data.sprites.front_default,
      tipo: data.types[0].type.name.toUpperCase(),
      vida: 100
    };

    fila.push(desafiante);
    atualizarFila();
    
    // Efeito visual ao adicionar
    const lista = document.getElementById("fila-lista");
    const itens = lista.getElementsByTagName('li');
    if (itens.length > 0) {
      itens[itens.length - 1].classList.add("destaque-entrada");
    }
    
  } catch (error) {
    console.error("Erro ao buscar Pokémon:", error);
    alert("OCORREU UM ERRO! TENTE NOVAMENTE!");
  }
}

function atualizarFila() {
  const lista = document.getElementById("fila-lista");
  lista.innerHTML = "";
  
  fila.forEach((poke, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="health-bar-container">
        <div class="health-bar">
          <div class="health-bar-fill" style="width: ${poke.vida}%"></div>
        </div>
        <span>${poke.nome}</span>
      </div>
      <div class="pokemon-info">
        <span>#${i + 1} - ${poke.nome} (${poke.tipo})</span>
        <img src="${poke.imagem}" alt="${poke.nome}"/>
      </div>
    `;
    lista.appendChild(li);
  });
}

function iniciarBatalha() {
  if (fila.length === 0) {
    alert("FILA VAZIA! ADICIONE UM DESAFIANTE!");
    return;
  }

  // Mudar fundo para modo batalha
  document.getElementById("background").className = "bg-battle";

  // Desativar botões durante a batalha
  const botoes = document.querySelectorAll('button');
  botoes.forEach(botao => botao.disabled = true);

  const desafiante = fila[0]; // Pega o primeiro mas não remove ainda
  const resultado = Math.random() > 0.5 ? "venceu" : "perdeu";

  // Calcular dano
  danoChefe = Math.floor(Math.random() * 30) + 10;
  danoDesafiante = Math.floor(Math.random() * 30) + 10;
  
  // Aplicar danos
  chefe.vida = Math.max(0, chefe.vida - danoDesafiante);
  desafiante.vida = Math.max(0, desafiante.vida - danoChefe);
  
  atualizarBarraVida();
  atualizarFila();

  // Efeito de dano no chefe
  const chefeImg = document.querySelector('.pokemon-chefe');
  chefeImg.classList.add("damage-effect");
  
  // Efeito de dano no desafiante
  const desafianteItem = document.querySelector('#fila-lista li:first-child');
  if (desafianteItem) {
    desafianteItem.classList.add("damage-effect");
  }

  setTimeout(() => {
    chefeImg.classList.remove("damage-effect");
    if (desafianteItem) desafianteItem.classList.remove("damage-effect");
  }, 500);

  // 1. Iniciar flash
  const flash = document.getElementById("efeito-flash");
  flash.classList.add("flash");
  
  // 2. Tocar som de batalha após 300ms
  setTimeout(() => {
    const audio = document.getElementById("som-batalha");
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Erro ao tocar som:", e));
    
    // 3. Fazer o chefe tremer
    chefeImg.classList.add("shake");
    
    // 4. Mostrar explosão
    const explosao = document.getElementById("efeito-explosao");
    const rect = chefeImg.getBoundingClientRect();
    explosao.style.left = `${rect.left + rect.width/2 - 150}px`;
    explosao.style.top = `${rect.top + rect.height/2 - 150}px`;
    explosao.classList.add("explosao");
  }, 300);

  // 5. Mostrar resultado após 2 segundos
  setTimeout(() => {
    // Ajustar vidas conforme resultado
    if (resultado === "venceu") {
      // Desafiante venceu (fica com 50% de vida)
      fila[0].vida = 50;
      // Chefe perdeu (vida zerada)
      chefe.vida = 0;
    } else {
      // Desafiante perdeu (remove da fila)
      fila.shift();
      // Chefe venceu (fica com 50% de vida)
      chefe.vida = 50;
    }
    
    // Atualizar displays
    atualizarBarraVida();
    atualizarFila();
    
    // Mostrar resultado
    mostrarResultado(desafiante, resultado);
    
    // Mudar fundo conforme resultado
    document.getElementById("background").className = resultado === "venceu" ? "bg-victory" : "bg-defeat";
    
    // Reativar botões
    botoes.forEach(botao => botao.disabled = false);
    
    // Remover classes de animação
    flash.classList.remove("flash");
    chefeImg.classList.remove("shake");
    const explosao = document.getElementById("efeito-explosao");
    explosao.classList.remove("explosao");

    // Resetar fundo após 3 segundos
    setTimeout(() => {
      document.getElementById("background").className = "bg-normal";
      // Resetar vida do chefe se necessário
      if (resultado === "venceu") {
        setTimeout(() => {
          chefe.vida = 100;
          atualizarBarraVida();
        }, 1000);
      }
    }, 3000);
  }, 2000);
}

function mostrarResultado(desafiante, resultado) {
  // Determinar vidas para exibição
  const vidaDesafiante = resultado === "venceu" ? 50 : 0;
  const vidaChefe = resultado === "venceu" ? 0 : 50;

  // Mostrar resultado
  const resultadoHTML = `
    <h2>${desafiante.nome} VS ${chefe.nome}</h2>
    <div class="batalha-resultado">
      <div class="pokemon-battle">
        <div class="health-bar-container">
          <div class="health-bar">
            <div class="health-bar-fill" style="width: ${vidaDesafiante}%"></div>
          </div>
        </div>
        <img src="${desafiante.imagem}" alt="${desafiante.nome}" />
      </div>
      <span class="versus">VS</span>
      <div class="pokemon-battle">
        <div class="health-bar-container">
          <div class="health-bar">
            <div class="health-bar-fill" style="width: ${vidaChefe}%"></div>
          </div>
        </div>
        <img src="${chefe.imagem}" alt="${chefe.nome}" />
      </div>
    </div>
    <h3 class="${resultado}">${desafiante.nome} ${resultado.toUpperCase()}!</h3>
    <p>Dano causado: ${resultado === "venceu" ? danoDesafiante : danoChefe}%</p>
  `;
  
  document.getElementById("resultado-batalha").innerHTML = resultadoHTML;
  
  if (resultado === "venceu") {
    salvarRanking(desafiante.nome);
    atualizarRanking();
  }
}

function salvarRanking(nome) {
  const ranking = JSON.parse(localStorage.getItem("ranking-pokemon") || "[]");
  ranking.unshift({
    nome: nome, 
    data: new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    vida: 50 // Vida restante do chefe
  });
  localStorage.setItem("ranking-pokemon", JSON.stringify(ranking));
}

function atualizarRanking() {
  const ranking = JSON.parse(localStorage.getItem("ranking-pokemon") || []);
  const div = document.getElementById("ranking");
  
  if (ranking.length > 0) {
    div.innerHTML = `
      <h2>🏆 RANKING</h2>
      <ul>
        ${ranking.slice(0, 5).map((item, i) => `
          <li>
            <span class="posicao">${i + 1}º</span>
            <span class="vencedor">${item.nome}</span>
            <span class="dano">Vida restante: ${100 - item.vida}%</span>
            <span class="data">${item.data}</span>
          </li>
        `).join("")}
      </ul>
    `;
  } else {
    div.innerHTML = `<h2>🏆 RANKING</h2><p>NENHUM VENCEDOR AINDA!</p>`;
  }
}