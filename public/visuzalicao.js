document.addEventListener("DOMContentLoaded", () => {
  const API = "http://localhost:3000/filmes";

  const graficoAnoCanvas = document.getElementById("graficoAno");
  const graficoGeneroCanvas = document.getElementById("graficoGenero");
  const container = document.querySelector(".container");

  // Gera n cores HSL simples
  function gerarCores(n) {
    const cores = [];
    for (let i = 0; i < n; i++) {
      const h = Math.round((i * 360) / n);
      cores.push(`hsl(${h} 70% 60%)`);
    }
    return cores;
  }

  // Extrai ano de string YYYY-MM-DD com validação simples
  function extrairAno(dataStr) {
    if (!dataStr || typeof dataStr !== "string") return null;
    const m = dataStr.match(/^(\d{4})-\d{2}-\d{2}$/);
    if (!m) return null;
    const ano = Number(m[1]);
    // valida intervalo razoável (ajuste se quiser)
    if (ano >= 1900 && ano <= 2100) return String(ano);
    return null;
  }

  // Mostra mensagem informativa na página
  function mostrarMensagem(texto) {
    // remove mensagens antigas
    const prev = document.getElementById("msgVisualizacao");
    if (prev) prev.remove();
    const p = document.createElement("p");
    p.id = "msgVisualizacao";
    p.style.textAlign = "center";
    p.style.color = "#ffcccb";
    p.style.marginTop = "12px";
    p.textContent = texto;
    if (container) container.prepend(p);
    else document.body.prepend(p);
  }

  async function carregarFilmes() {
    try {
      const resp = await fetch(API);
      if (!resp.ok) throw new Error("Erro ao buscar filmes: " + resp.status);
      const filmes = await resp.json();
      return filmes;
    } catch (err) {
      console.error(err);
      mostrarMensagem("Erro ao carregar filmes. Verifique o JSON Server.");
      return null;
    }
  }

  function agruparPorAno(filmes) {
    const contagem = {};
    filmes.forEach(f => {
      const ano = extrairAno(f.data);
      const key = ano || "Ano desconhecido";
      contagem[key] = (contagem[key] || 0) + 1;
    });
    // ordenar chaves numericamente se possível, mantendo "Ano desconhecido" no final
    const keys = Object.keys(contagem).sort((a, b) => {
      if (a === "Ano desconhecido") return 1;
      if (b === "Ano desconhecido") return -1;
      return Number(a) - Number(b);
    });
    const values = keys.map(k => contagem[k]);
    return { keys, values };
  }

  function agruparPorGenero(filmes) {
    const contagem = {};
    filmes.forEach(f => {
      const g = (f.genero && f.genero.trim()) || "Desconhecido";
      contagem[g] = (contagem[g] || 0) + 1;
    });
    const keys = Object.keys(contagem);
    const values = keys.map(k => contagem[k]);
    return { keys, values };
  }

  // Desenha gráficos (se já existir um Chart instanciado, este código não tenta destruí-lo;
  // se for necessário re-renderizar várias vezes, considere armazenar e chamar chart.destroy()).
  function desenharGraficoAno(keys, values) {
    if (!graficoAnoCanvas) {
      console.error("Canvas graficoAno não encontrado");
      return;
    }
    new Chart(graficoAnoCanvas, {
      type: "bar",
      data: {
        labels: keys,
        datasets: [{
          label: "Filmes por Ano",
          data: values,
          backgroundColor: gerarCores(values.length),
          borderColor: "rgba(0,0,0,0.1)",
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } }
        }
      }
    });
  }

  function desenharGraficoGenero(keys, values) {
    if (!graficoGeneroCanvas) {
      console.error("Canvas graficoGenero não encontrado");
      return;
    }
    new Chart(graficoGeneroCanvas, {
      type: "pie",
      data: {
        labels: keys,
        datasets: [{
          data: values,
          backgroundColor: gerarCores(values.length)
        }]
      },
      options: { responsive: true }
    });
  }

  // Fluxo principal
  (async () => {
    const filmes = await carregarFilmes();
    if (!filmes) return; // mensagem de erro já mostrada
    if (!Array.isArray(filmes) || filmes.length === 0) {
      mostrarMensagem("Nenhum filme cadastrado ainda.");
      return;
    }

    // se houver um registro com data claramente inválida, você pode avisar
    const problemaData = filmes.some(f => extrairAno(f.data) === null);
    if (problemaData) {
      mostrarMensagem("Alguns filmes têm datas inválidas e serão agrupados como 'Ano desconhecido'.");
      // a mensagem fica visível; pode ser removida depois se preferir
    }

    const { keys: anos, values: valoresAno } = agruparPorAno(filmes);
    const { keys: generos, values: valoresGenero } = agruparPorGenero(filmes);

    desenharGraficoAno(anos, valoresAno);
    desenharGraficoGenero(generos, valoresGenero);
  })();
});
