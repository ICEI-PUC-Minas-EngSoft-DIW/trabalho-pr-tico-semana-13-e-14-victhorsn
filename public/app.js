const API_URL = "http://localhost:3000/filmes";

// =======================
// LISTAGEM (index.html)
// =======================
if (document.getElementById("filmes-container")) {
  carregarFilmes();
}

async function carregarFilmes() {
  const container = document.getElementById("filmes-container");
  const res = await fetch(API_URL);
  const filmes = await res.json();

  container.innerHTML = filmes
    .map(
      (f) => `
      <div class="filme-card">
        <img src="${f.imagem}" alt="${f.titulo}">
        <h2>${f.titulo}</h2>
        <p><strong>Lançamento:</strong> ${f.data}</p>
        <div class="actions">
          <a href="detalhes.html?id=${f.id}" class="btn btn-ver">👁️ Ver detalhes</a>
          <button onclick="editarFilme(${f.id})" class="btn btn-editar">✏️ Editar</button>
          <button onclick="deletarFilme(${f.id})" class="btn btn-excluir">🗑️ Excluir</button>
        </div>
      </div>`
    )
    .join("");
}

// =======================
// CADASTRO/EDIÇÃO
// =======================
const form = document.getElementById("form-filme");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const filme = {
      titulo: document.getElementById("titulo").value,
      data: document.getElementById("data").value,
      imagem: document.getElementById("imagem").value,
      descricao: document.getElementById("descricao").value,
    };

    const id = document.getElementById("id").value;

    if (id) {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filme),
      });
      alert("Filme atualizado com sucesso!");
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filme),
      });
      alert("Filme adicionado com sucesso!");
    }

    window.location.href = "index.html";
  });
}

async function editarFilme(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const filme = await res.json();

  localStorage.setItem("filmeEdicao", JSON.stringify(filme));
  window.location.href = "cadastro_filmes.html";
}

// Pré-carrega dados na tela de edição
if (window.location.pathname.endsWith("cadastro_filmes.html")) {
  const filmeSalvo = JSON.parse(localStorage.getItem("filmeEdicao"));
  if (filmeSalvo) {
    document.getElementById("id").value = filmeSalvo.id;
    document.getElementById("titulo").value = filmeSalvo.titulo;
    document.getElementById("data").value = filmeSalvo.data;
    document.getElementById("imagem").value = filmeSalvo.imagem;
    document.getElementById("descricao").value = filmeSalvo.descricao;
    localStorage.removeItem("filmeEdicao");
  }
}

// =======================
// DETALHES
// =======================
if (window.location.pathname.endsWith("detalhes.html")) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (id) carregarDetalhes(id);
}

async function carregarDetalhes(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const filme = await res.json();

  const container = document.getElementById("detalhes-container");
  container.innerHTML = `
    <div class="filme-detalhe">
      <img src="${filme.imagem}" alt="${filme.titulo}">
      <div class="info">
        <h2>${filme.titulo}</h2>
        <p><strong>Lançamento:</strong> ${filme.data}</p>
        <p>${filme.descricao}</p>
      </div>
    </div>
  `;
}

// =======================
// EXCLUSÃO
// =======================
async function deletarFilme(id) {
  if (confirm("Deseja realmente excluir este filme?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    alert("Filme excluído!");
    carregarFilmes();
  }
}
