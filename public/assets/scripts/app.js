const API = "http://localhost:3000/filmes";

// =====================
// LISTAR FILMES (HOME)
// =====================
async function carregarFilmes() {
  const res = await fetch(API);
  const filmes = await res.json();

  const container = document.getElementById("filmes-container");
  if (!container) return;

  container.innerHTML = "";

  filmes.forEach(filme => {
    container.innerHTML += `
      <div class="filme-card">
        <img src="${filme.imagem}">
        <h3>${filme.titulo}</h3>
        <p><b>Gênero:</b> ${filme.genero}</p>

        <div class="actions">
          <a href="detalhes.html?id=${filme.id}" class="btn btn-ver">Ver</a>
          <button onclick="editarFilme('${filme.id}')" class="btn btn-editar">Editar</button>
          <button onclick="excluirFilme('${filme.id}')" class="btn btn-excluir">Excluir</button>
        </div>
      </div>
    `;
  });
}

// =====================
// SALVAR FILME
// =====================
const form = document.getElementById("form-filme");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("id").value;

    const filme = {
      titulo: titulo.value,
      data: data.value,
      imagem: imagem.value,
      descricao: descricao.value,
      genero: genero.value
    };

    if (id) {
      await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filme)
      });
    } else {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filme)
      });
    }

    window.location.href = "index.html";
  });
}

// =====================
// EDITAR
// =====================
async function editarFilme(id) {
  const res = await fetch(`${API}/${id}`);
  const filme = await res.json();

  window.location.href = `cadastro_filmes.html?id=${id}`;

  setTimeout(() => {
    document.getElementById("id").value = filme.id;
    document.getElementById("titulo").value = filme.titulo;
    document.getElementById("data").value = filme.data;
    document.getElementById("imagem").value = filme.imagem;
    document.getElementById("descricao").value = filme.descricao;
    document.getElementById("genero").value = filme.genero;
  }, 300);
}

// =====================
// EXCLUIR
// =====================
async function excluirFilme(id) {
  if (!confirm("Excluir este filme?")) return;

  await fetch(`${API}/${id}`, { method: "DELETE" });
  carregarFilmes();
}

// =====================
// DETALHES
// =====================
async function carregarDetalhes() {
  const container = document.getElementById("detalhes-container");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const res = await fetch(`${API}/${id}`);
  const filme = await res.json();

  container.innerHTML = `
    <div class="filme-detalhe">
      <img src="${filme.imagem}">
      <div class="info">
        <h2>${filme.titulo}</h2>
        <p><b>Lançamento:</b> ${filme.data}</p>
        <p><b>Gênero:</b> ${filme.genero}</p>
        <p>${filme.descricao}</p>
      </div>
    </div>
  `;
}

document.getElementById("graficoFilmes")


carregarFilmes();
carregarDetalhes();
