const fila = [];
const chefe = {
  nome: "CHARIZARD",
  imagem: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
  tipo: "FOGO"
};

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar chefe
  const chefeContainer = document.getElementById("chefe-container");
  chefeContainer.innerHTML = `
    <h2>CHEFE: ${chefe.nome}</h2>
    <img src="${chefe.imagem}" alt="${chefe.nome}" class="pokemon-chefe"/>
    <p>TIPO: ${chefe.tipo}</p>
  `;

  // Configurar eventos
  document.getElementById("batalhar").addEventListener("click", iniciarBatalha);
  document.getElementById("adicionar-desafiante").addEventListener("click", adicionarDesafiante);

  // Pré-carregar áudio
  const audio = document.getElementById("som-batalha");
  audio.volume = 0.5;
  audio.load();

  atualizarFila();
  atualizarRanking();
});

async function adicionarDesafiante() {
  try {
    const id = Math.floor(Math.random() * 150) + 1;
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();

    const desafiante = {
      nome: data.name.toUpperCase(),
      imagem: data.sprites.front_default,
      tipo: data.types[0].type.name.toUpperCase()
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
      <span>#${i + 1} - ${poke.nome} (${poke.tipo})</span>
      <img src="${poke.imagem}" alt="${poke.nome}"/>
    `;
    lista.appendChild(li);
  });
}

function iniciarBatalha() {
  if (fila.length === 0) {
    alert("FILA VAZIA! ADICIONE UM DESAFIANTE!");
    return;
  }

  // Desativar botões durante a batalha
  const botoes = document.querySelectorAll('button');
  botoes.forEach(botao => botao.disabled = true);

  const desafiante = fila.shift();
  const resultado = Math.random() > 0.5 ? "venceu" : "perdeu";

  // 1. Iniciar flash
  const flash = document.getElementById("efeito-flash");
  flash.classList.add("flash");
  
  // 2. Tocar som de batalha após 300ms
  setTimeout(() => {
    const audio = document.getElementById("som-batalha");
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Erro ao tocar som:", e));
    
    // 3. Fazer o chefe tremer
    const chefeImg = document.querySelector('.pokemon-chefe');
    chefeImg.classList.add("shake");
    
    // 4. Mostrar explosão
    const explosao = document.getElementById("efeito-explosao");
    const rect = chefeImg.getBoundingClientRect();
    explosao.style.left = `${rect.left + rect.width/2 - 100}px`;
    explosao.style.top = `${rect.top + rect.height/2 - 100}px`;
    explosao.classList.add("explosao");
  }, 300);

  // 5. Mostrar resultado após 2 segundos
  setTimeout(() => {
    mostrarResultado(desafiante, resultado);
    atualizarFila();
    
    // 6. Reativar botões
    botoes.forEach(botao => botao.disabled = false);
    
    // 7. Remover classes de animação
    flash.classList.remove("flash");
    const chefeImg = document.querySelector('.pokemon-chefe');
    chefeImg.classList.remove("shake");
    const explosao = document.getElementById("efeito-explosao");
    explosao.classList.remove("explosao");
  }, 2000);
}

function mostrarResultado(desafiante, resultado) {
  // Mostrar resultado
  const resultadoHTML = `
    <h2>${desafiante.nome} VS ${chefe.nome}</h2>
    <div class="batalha-resultado">
      <img src="${desafiante.imagem}" alt="${desafiante.nome}" />
      <span class="versus">VS</span>
      <img src="${chefe.imagem}" alt="${chefe.nome}" />
    </div>
    <h3 class="${resultado}">${desafiante.nome} ${resultado.toUpperCase()}!</h3>
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
      year: 'numeric'
    })
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
            <span class="data">${item.data}</span>
          </li>
        `).join("")}
      </ul>
    `;
  } else {
    div.innerHTML = `<h2>🏆 RANKING</h2><p>NENHUM VENCEDOR AINDA!</p>`;
  }
}