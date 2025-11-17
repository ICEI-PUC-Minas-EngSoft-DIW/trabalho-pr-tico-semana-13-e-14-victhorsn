async function carregarDados() {
    const resposta = await fetch("http://localhost:3000/filmes");
    const filmes = await resposta.json();

    // Contar filmes por gênero
    const generos = {};
    filmes.forEach(f => {
        generos[f.genero] = (generos[f.genero] || 0) + 1;
    });

    // Preparar dados para o Chart.js
    const labels = Object.keys(generos);
    const valores = Object.values(generos);

    const ctx = document.getElementById("graficoFilmes");

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: valores
            }]
        }
    });
}

carregarDados();
