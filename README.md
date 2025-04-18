# 🧩 Simulador de Batalhas Pokémon - Fila FIFO

Este é um projeto web que simula batalhas entre Pokémons desafiantes e um chefe fixo (Charizard). Os desafiantes são adicionados a uma fila (estrutura FIFO), e enfrentam o chefe em batalhas com resultado aleatório. Vencedores são registrados em um ranking armazenado localmente.

---

## 🔥 Chefe da Batalha

- **Nome:** Charizard  
- **Tipo:** Fogo  
- **Imagem:**  
  ![Charizard](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png)

---

## 🚀 Funcionalidades

- Adicionar desafiantes aleatórios da PokéAPI
- Simular batalhas com efeitos visuais e sonoros
- Utilização de fila para organizar os duelos (FIFO)
- Registro dos vencedores em ranking (localStorage)
- Ranking exibido com nome, data e posição

---

## 🎮 Como usar

1. Clique em **"Adicionar Desafiante"** para inserir um Pokémon aleatório na fila.
2. Clique em **"Batalhar"** para iniciar a luta do primeiro desafiante contra o chefe.
3. Veja o resultado da batalha com efeitos visuais.
4. Se o desafiante vencer, ele será adicionado ao ranking.

---

## 🛠️ Tecnologias Utilizadas

- HTML5  
- CSS3 (com animações personalizadas)  
- JavaScript (puro)  
- PokéAPI: [https://pokeapi.co](https://pokeapi.co)  
- Armazenamento local via `localStorage`

---

## 📸 Capturas de Tela

> _Você pode adicionar aqui imagens da interface do projeto quando quiser._

---

## 📌 Observações

- O sistema de vitória/derrota é aleatório em 50% dos casos e em 50% dos casos é utilizado o poder dos Pokémons.
- Ranking é salvo apenas localmente (no navegador do usuário).
- Experiência otimizada para desktop.

---

## 🧑‍💻 Autor

Desenvolvido por Robson Silva Ribeiro.

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.
